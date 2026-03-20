package com.chakro.server.service;

import com.chakro.server.domain.AnalysisResult;
import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.dto.*;
import com.chakro.server.exception.ResourceNotFoundException;
import com.chakro.server.exception.UnauthorizedDownloadException;
import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.repository.ProposalDraftRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Top-level orchestration service managing the entire VBDP workflow lifecycle:
 * Ingest → Analyze → Generate Proposal → Human Review → Approve/Reject → Download.
 */
@Service
public class WorkflowOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(WorkflowOrchestrationService.class);

    private final OpportunityRepository opportunityRepository;
    private final ProposalDraftRepository proposalDraftRepository;
    private final AnalysisService analysisService;
    private final ProposalService proposalService;
    private final ObjectMapper objectMapper;

    public WorkflowOrchestrationService(OpportunityRepository opportunityRepository,
                                         ProposalDraftRepository proposalDraftRepository,
                                         AnalysisService analysisService,
                                         ProposalService proposalService,
                                         ObjectMapper objectMapper) {
        this.opportunityRepository = opportunityRepository;
        this.proposalDraftRepository = proposalDraftRepository;
        this.analysisService = analysisService;
        this.proposalService = proposalService;
        this.objectMapper = objectMapper;
    }

    // ==================== Opportunity Management ====================

    /**
     * Submit a new opportunity into the pipeline.
     */
    @Transactional
    public OpportunityResponse submitOpportunity(OpportunityRequest request) {
        log.info("Submitting new opportunity: {}", request.getTitle());

        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .sourceUrl(request.getSourceUrl())
                .sourceDocumentText(request.getDocumentContent())
                .status(OpportunityStatus.INGESTED)
                .build();

        opportunity = opportunityRepository.save(opportunity);
        log.info("Opportunity created with ID: {}", opportunity.getId());

        return mapToResponse(opportunity);
    }

    /**
     * Get opportunity details by ID.
     */
    public OpportunityResponse getOpportunity(UUID opportunityId) {
        Opportunity opportunity = findOpportunity(opportunityId);
        return mapToResponse(opportunity);
    }

    /**
     * List all opportunities.
     */
    public List<OpportunityResponse> listOpportunities() {
        return opportunityRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==================== Analysis ====================

    /**
     * Trigger analysis for an opportunity.
     */
    public OpportunityResponse runAnalysis(UUID opportunityId) {
        log.info("Triggering analysis for opportunity: {}", opportunityId);
        analysisService.runAnalysis(opportunityId);
        Opportunity opportunity = findOpportunity(opportunityId);
        return mapToResponse(opportunity);
    }

    // ==================== Proposal Generation ====================

    /**
     * Trigger proposal generation for an analyzed opportunity.
     */
    public ProposalResponse generateProposal(UUID opportunityId) {
        log.info("Triggering proposal generation for opportunity: {}", opportunityId);
        ProposalDraft draft = proposalService.generateProposal(opportunityId);
        Opportunity opportunity = findOpportunity(opportunityId);
        return mapToProposalResponse(draft, opportunity);
    }

    // ==================== HITL Review ====================

    /**
     * Get the current proposal draft for review.
     */
    public ProposalResponse getProposalForReview(UUID opportunityId) {
        ProposalDraft draft = proposalService.getLatestDraft(opportunityId);
        Opportunity opportunity = findOpportunity(opportunityId);
        return mapToProposalResponse(draft, opportunity);
    }

    /**
     * Process human review decision (approve or request revision).
     */
    @Transactional
    public ProposalResponse reviewProposal(UUID opportunityId,
                                            ProposalReviewRequest reviewRequest) {
        log.info("Processing review for opportunity {}: {}",
                opportunityId, reviewRequest.getDecision());

        Opportunity opportunity = findOpportunity(opportunityId);

        if (opportunity.getStatus() != OpportunityStatus.AWAITING_REVIEW) {
            throw new IllegalStateException(
                    "Opportunity is not in AWAITING_REVIEW status. Current: "
                    + opportunity.getStatus());
        }

        if (reviewRequest.getDecision() == ProposalReviewRequest.ReviewDecision.APPROVED) {
            // Approve
            opportunity.setStatus(OpportunityStatus.APPROVED);
            opportunityRepository.save(opportunity);
            log.info("Proposal APPROVED for opportunity {}", opportunityId);

            ProposalDraft draft = proposalService.getLatestDraft(opportunityId);
            return mapToProposalResponse(draft, opportunity);

        } else {
            // Revision requested — restart Response Agent with feedback
            opportunity.setStatus(OpportunityStatus.REVISION_REQUESTED);
            opportunityRepository.save(opportunity);
            log.info("Revision requested for opportunity {}", opportunityId);

            ProposalDraft revisedDraft = proposalService.reviseProposal(
                    opportunityId, reviewRequest.getFeedback());
            opportunity = findOpportunity(opportunityId); // Refresh
            return mapToProposalResponse(revisedDraft, opportunity);
        }
    }

    // ==================== Download ====================

    /**
     * Download the final approved proposal.
     * STRICTLY enforces APPROVED status — throws UnauthorizedDownloadException otherwise.
     */
    public ProposalDraft downloadFinalProposal(UUID opportunityId) {
        Opportunity opportunity = findOpportunity(opportunityId);

        // STRICT status enforcement
        if (opportunity.getStatus() != OpportunityStatus.APPROVED) {
            log.warn("Download denied for opportunity {}. Status: {}",
                    opportunityId, opportunity.getStatus());
            throw new UnauthorizedDownloadException(
                    "Download is not permitted. The proposal for opportunity '"
                    + opportunity.getTitle() + "' has not been approved. "
                    + "Current status: " + opportunity.getStatus()
                    + ". Please complete the review process before downloading.");
        }

        return proposalService.getLatestDraft(opportunityId);
    }

    // ==================== Mapping Helpers ====================

    private Opportunity findOpportunity(UUID opportunityId) {
        return opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Opportunity not found: " + opportunityId));
    }

    private OpportunityResponse mapToResponse(Opportunity opportunity) {
        OpportunityResponse response = OpportunityResponse.builder()
                .id(opportunity.getId())
                .title(opportunity.getTitle())
                .description(opportunity.getDescription())
                .sourceUrl(opportunity.getSourceUrl())
                .status(opportunity.getStatus())
                .createdAt(opportunity.getCreatedAt())
                .updatedAt(opportunity.getUpdatedAt())
                .build();

        // Parse analysis result if available
        if (opportunity.getRawAnalysisJson() != null
                && !opportunity.getRawAnalysisJson().isBlank()) {
            try {
                AnalysisResult result = objectMapper.readValue(
                        opportunity.getRawAnalysisJson(), AnalysisResult.class);
                response.setAnalysisResult(AnalysisResultResponse.builder()
                        .requirements(result.requirements())
                        .risks(result.risks())
                        .eligibility(result.eligibility())
                        .scope(result.scope())
                        .deadlines(result.deadlines())
                        .complianceNotes(result.complianceNotes())
                        .technicalSpecs(result.technicalSpecs())
                        .summary(result.summary())
                        .build());
            } catch (JsonProcessingException e) {
                log.warn("Failed to parse analysis JSON for opportunity {}",
                        opportunity.getId());
            }
        }

        return response;
    }

    private ProposalResponse mapToProposalResponse(ProposalDraft draft,
                                                     Opportunity opportunity) {
        String downloadUrl = "/api/v1/opportunities/" + opportunity.getId() + "/download";

        return ProposalResponse.builder()
                .id(draft.getId())
                .opportunityId(opportunity.getId())
                .status(opportunity.getStatus())
                .downloadUrl(opportunity.getStatus() == OpportunityStatus.APPROVED
                        ? downloadUrl : null)
                .version(draft.getVersion())
                .previewHtml(truncatePreview(draft.getContentHtml()))
                .reviewFeedback(draft.getReviewFeedback())
                .build();
    }

    private String truncatePreview(String html) {
        if (html == null) return null;
        return html.length() > 2000 ? html.substring(0, 2000) + "..." : html;
    }
}
