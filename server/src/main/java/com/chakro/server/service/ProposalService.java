package com.chakro.server.service;

import com.chakro.server.agent.sub.ContentGenerationSubAgent;
import com.chakro.server.agent.sub.StructurePlannerSubAgent;
import com.chakro.server.agent.tool.DocumentGenerationTool;
import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.exception.ProposalGenerationException;
import com.chakro.server.exception.ResourceNotFoundException;
import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.repository.ProposalDraftRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Orchestrates proposal generation: retrieve analysis → plan structure →
 * generate content → create document file → persist draft with AWAITING_REVIEW status.
 * Supports feedback-driven revision for HITL workflow.
 */
@Service
public class ProposalService {

    private static final Logger log = LoggerFactory.getLogger(ProposalService.class);

    private final OpportunityRepository opportunityRepository;
    private final ProposalDraftRepository proposalDraftRepository;
    private final StructurePlannerSubAgent structurePlannerSubAgent;
    private final ContentGenerationSubAgent contentGenerationSubAgent;
    private final DocumentGenerationTool documentGenerationTool;

    @Value("${vbdp.download-token-expiry-hours:24}")
    private int downloadTokenExpiryHours;

    public ProposalService(OpportunityRepository opportunityRepository,
                           ProposalDraftRepository proposalDraftRepository,
                           StructurePlannerSubAgent structurePlannerSubAgent,
                           ContentGenerationSubAgent contentGenerationSubAgent,
                           DocumentGenerationTool documentGenerationTool) {
        this.opportunityRepository = opportunityRepository;
        this.proposalDraftRepository = proposalDraftRepository;
        this.structurePlannerSubAgent = structurePlannerSubAgent;
        this.contentGenerationSubAgent = contentGenerationSubAgent;
        this.documentGenerationTool = documentGenerationTool;
    }

    /**
     * Generate a new proposal draft for an analyzed opportunity.
     *
     * @param opportunityId the ID of the opportunity
     * @return the created ProposalDraft
     */
    @Transactional
    public ProposalDraft generateProposal(UUID opportunityId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Opportunity not found: " + opportunityId));

        // Validate state
        if (opportunity.getStatus() != OpportunityStatus.ANALYSIS_COMPLETE
                && opportunity.getStatus() != OpportunityStatus.REVISION_REQUESTED) {
            throw new IllegalStateException(
                    "Cannot generate proposal in status: " + opportunity.getStatus()
                    + ". Analysis must be complete first.");
        }

        String analysisData = opportunity.getRawAnalysisJson();
        if (analysisData == null || analysisData.isBlank()) {
            throw new ProposalGenerationException(
                    "No analysis data available for opportunity: " + opportunityId);
        }

        opportunity.setStatus(OpportunityStatus.GENERATING_PROPOSAL);
        opportunityRepository.save(opportunity);

        try {
            // Step 1: Plan proposal structure
            log.info("Step 1: Planning proposal structure for opportunity {}", opportunityId);
            String proposalStructure = structurePlannerSubAgent.planStructure(analysisData);

            // Step 2: Generate content
            log.info("Step 2: Generating proposal content for opportunity {}", opportunityId);
            String proposalContent = contentGenerationSubAgent.generateContent(
                    analysisData, proposalStructure);

            // Step 3: Generate document file
            log.info("Step 3: Generating document file for opportunity {}", opportunityId);
            String filePath = documentGenerationTool.generateDocumentFile(proposalContent);

            // Determine version
            int version = proposalDraftRepository
                    .findTopByOpportunityIdOrderByVersionDesc(opportunityId)
                    .map(d -> d.getVersion() + 1)
                    .orElse(1);

            // Step 4: Create and persist draft
            String downloadToken = UUID.randomUUID().toString();
            ProposalDraft draft = ProposalDraft.builder()
                    .opportunity(opportunity)
                    .contentHtml(proposalContent)
                    .contentText(proposalContent)
                    .downloadToken(downloadToken)
                    .tokenExpiry(OffsetDateTime.now().plusHours(downloadTokenExpiryHours))
                    .version(version)
                    .build();

            proposalDraftRepository.save(draft);

            // Update opportunity status
            opportunity.setStatus(OpportunityStatus.AWAITING_REVIEW);
            opportunityRepository.save(opportunity);

            log.info("Proposal draft v{} created for opportunity {} with token {}",
                    version, opportunityId, downloadToken);
            return draft;

        } catch (ProposalGenerationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Proposal generation failed for opportunity {}: {}",
                    opportunityId, e.getMessage(), e);
            throw new ProposalGenerationException(
                    "Proposal generation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Revise an existing proposal based on human feedback.
     *
     * @param opportunityId the opportunity ID
     * @param feedback human reviewer feedback
     * @return the revised ProposalDraft
     */
    @Transactional
    public ProposalDraft reviseProposal(UUID opportunityId, String feedback) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Opportunity not found: " + opportunityId));

        Optional<ProposalDraft> existingDraft =
                proposalDraftRepository.findTopByOpportunityIdOrderByVersionDesc(opportunityId);

        if (existingDraft.isEmpty()) {
            throw new ProposalGenerationException(
                    "No existing draft to revise for opportunity: " + opportunityId);
        }

        ProposalDraft previousDraft = existingDraft.get();

        opportunity.setStatus(OpportunityStatus.GENERATING_PROPOSAL);
        opportunityRepository.save(opportunity);

        try {
            // Refine content with feedback
            log.info("Revising proposal for opportunity {} with feedback", opportunityId);
            String revisedContent = contentGenerationSubAgent.refineContent(
                    previousDraft.getContentText(), feedback);

            // Generate new document file
            String filePath = documentGenerationTool.generateDocumentFile(revisedContent);

            // Create new version
            String downloadToken = UUID.randomUUID().toString();
            ProposalDraft revisedDraft = ProposalDraft.builder()
                    .opportunity(opportunity)
                    .contentHtml(revisedContent)
                    .contentText(revisedContent)
                    .downloadToken(downloadToken)
                    .tokenExpiry(OffsetDateTime.now().plusHours(downloadTokenExpiryHours))
                    .reviewFeedback(feedback)
                    .version(previousDraft.getVersion() + 1)
                    .build();

            proposalDraftRepository.save(revisedDraft);

            opportunity.setStatus(OpportunityStatus.AWAITING_REVIEW);
            opportunityRepository.save(opportunity);

            log.info("Revised proposal v{} created for opportunity {}",
                    revisedDraft.getVersion(), opportunityId);
            return revisedDraft;

        } catch (Exception e) {
            log.error("Proposal revision failed for opportunity {}: {}",
                    opportunityId, e.getMessage(), e);
            throw new ProposalGenerationException(
                    "Proposal revision failed: " + e.getMessage(), e);
        }
    }

    /**
     * Get the latest proposal draft for an opportunity.
     */
    public ProposalDraft getLatestDraft(UUID opportunityId) {
        return proposalDraftRepository.findTopByOpportunityIdOrderByVersionDesc(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No proposal draft found for opportunity: " + opportunityId));
    }
}
