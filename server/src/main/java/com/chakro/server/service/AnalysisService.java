package com.chakro.server.service;

import com.chakro.server.agent.sub.DocumentIngestionSubAgent;
import com.chakro.server.agent.sub.RequirementsExtractionSubAgent;
import com.chakro.server.agent.sub.RiskAssessmentSubAgent;
import com.chakro.server.domain.AnalysisResult;
import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.exception.AnalysisException;
import com.chakro.server.exception.ResourceNotFoundException;
import com.chakro.server.repository.OpportunityRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

/**
 * Orchestrates the analysis pipeline: DocumentIngestion → RequirementsExtraction →
 * RiskAssessment → consolidation into AnalysisResult → persistence with ANALYSIS_COMPLETE status.
 * Uses Virtual Threads for parallel sub-agent execution.
 */
@Service
public class AnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final OpportunityRepository opportunityRepository;
    private final DocumentIngestionSubAgent documentIngestionSubAgent;
    private final RequirementsExtractionSubAgent requirementsExtractionSubAgent;
    private final RiskAssessmentSubAgent riskAssessmentSubAgent;
    private final ExecutorService virtualThreadExecutor;
    private final ObjectMapper objectMapper;

    public AnalysisService(OpportunityRepository opportunityRepository,
                           DocumentIngestionSubAgent documentIngestionSubAgent,
                           RequirementsExtractionSubAgent requirementsExtractionSubAgent,
                           RiskAssessmentSubAgent riskAssessmentSubAgent,
                           ExecutorService virtualThreadExecutor,
                           ObjectMapper objectMapper) {
        this.opportunityRepository = opportunityRepository;
        this.documentIngestionSubAgent = documentIngestionSubAgent;
        this.requirementsExtractionSubAgent = requirementsExtractionSubAgent;
        this.riskAssessmentSubAgent = riskAssessmentSubAgent;
        this.virtualThreadExecutor = virtualThreadExecutor;
        this.objectMapper = objectMapper;
    }

    /**
     * Run the full analysis pipeline for a given opportunity.
     *
     * @param opportunityId the ID of the opportunity to analyze
     * @return the completed AnalysisResult
     */
    @Transactional
    public AnalysisResult runAnalysis(UUID opportunityId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Opportunity not found: " + opportunityId));

        // Validate state transition
        if (opportunity.getStatus() != OpportunityStatus.INGESTED
                && opportunity.getStatus() != OpportunityStatus.ANALYZING) {
            throw new IllegalStateException(
                    "Cannot analyze opportunity in status: " + opportunity.getStatus());
        }

        // Update status to ANALYZING
        opportunity.setStatus(OpportunityStatus.ANALYZING);
        opportunityRepository.save(opportunity);

        try {
            // Step 1: Document Ingestion
            log.info("Step 1: Ingesting document for opportunity {}", opportunityId);
            String documentText = documentIngestionSubAgent.ingest(
                    opportunity.getSourceUrl(),
                    opportunity.getSourceDocumentText());

            if (documentText == null || documentText.isBlank() || documentText.startsWith("Error")) {
                throw new AnalysisException("Document ingestion failed: " + documentText);
            }

            // Store parsed text
            opportunity.setSourceDocumentText(documentText);

            // Step 2 & 3: Parallel - Requirements Extraction + Risk Assessment
            log.info("Step 2 & 3: Running parallel sub-agents for opportunity {}", opportunityId);

            Future<String> requirementsFuture = virtualThreadExecutor.submit(
                    () -> requirementsExtractionSubAgent.extractRequirements(documentText));
            Future<String> risksFuture = virtualThreadExecutor.submit(
                    () -> riskAssessmentSubAgent.assessRisks(documentText));

            String requirementsResult = requirementsFuture.get();
            String risksResult = risksFuture.get();

            // Step 4: Consolidate into AnalysisResult
            log.info("Step 4: Consolidating analysis for opportunity {}", opportunityId);
            AnalysisResult analysisResult = consolidateResults(
                    requirementsResult, risksResult, documentText);

            // Persist analysis
            String analysisJson = objectMapper.writeValueAsString(analysisResult);
            opportunity.setRawAnalysisJson(analysisJson);
            opportunity.setStatus(OpportunityStatus.ANALYSIS_COMPLETE);
            opportunityRepository.save(opportunity);

            log.info("Analysis completed successfully for opportunity {}", opportunityId);
            return analysisResult;

        } catch (AnalysisException e) {
            throw e;
        } catch (JsonProcessingException e) {
            throw new AnalysisException("Failed to serialize analysis result", e);
        } catch (Exception e) {
            log.error("Analysis pipeline failed for opportunity {}: {}",
                    opportunityId, e.getMessage(), e);
            throw new AnalysisException("Analysis pipeline failed: " + e.getMessage(), e);
        }
    }

    /**
     * Consolidates requirements and risk assessment outputs into a structured AnalysisResult.
     */
    private AnalysisResult consolidateResults(String requirementsOutput,
                                               String risksOutput,
                                               String documentText) {
        // Parse requirements into list (split by newlines, filter empties)
        List<String> requirements = List.of(requirementsOutput.split("\\n")).stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        // Parse risks into list
        List<String> risks = List.of(risksOutput.split("\\n")).stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return new AnalysisResult(
                requirements,
                risks,
                extractSection(requirementsOutput, "eligibility"),
                extractSection(requirementsOutput, "scope"),
                extractSection(requirementsOutput, "deadline"),
                extractSection(requirementsOutput, "compliance"),
                extractSection(requirementsOutput, "technical"),
                "Analysis completed. Found " + requirements.size() + " requirements and "
                        + risks.size() + " risk items."
        );
    }

    /**
     * Simple keyword-based section extraction from LLM output.
     */
    private String extractSection(String text, String keyword) {
        String[] lines = text.split("\\n");
        StringBuilder result = new StringBuilder();
        boolean capturing = false;

        for (String line : lines) {
            if (line.toLowerCase().contains(keyword.toLowerCase())) {
                capturing = true;
                result.append(line.trim()).append("\n");
            } else if (capturing) {
                if (line.trim().isEmpty() || line.matches("^\\d+\\..*")
                        || line.matches("^[-*].*") || line.startsWith("  ")) {
                    result.append(line.trim()).append("\n");
                } else {
                    break;
                }
            }
        }

        String extracted = result.toString().trim();
        return extracted.isEmpty() ? "See full analysis for details." : extracted;
    }
}
