package com.chakro.server.controller;

import com.chakro.server.dto.ProposalResponse;
import com.chakro.server.dto.ProposalReviewRequest;
import com.chakro.server.service.WorkflowOrchestrationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for HITL (Human-in-the-Loop) proposal review workflow.
 * Exposes endpoints for viewing and approving/rejecting proposal drafts.
 */
@RestController
@RequestMapping("/api/v1/opportunities")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);
    private final WorkflowOrchestrationService workflowService;

    public ReviewController(WorkflowOrchestrationService workflowService) {
        this.workflowService = workflowService;
    }

    /**
     * Get the current proposal draft for review.
     */
    @GetMapping("/{id}/proposal")
    public ResponseEntity<ProposalResponse> getProposalForReview(@PathVariable UUID id) {
        log.info("GET /api/v1/opportunities/{}/proposal", id);
        ProposalResponse response = workflowService.getProposalForReview(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Submit a review decision (APPROVED or REVISION_REQUESTED with feedback).
     * If approved, updates status to APPROVED.
     * If revision requested, restarts the Response Agent with feedback.
     */
    @PostMapping("/{id}/review")
    public ResponseEntity<ProposalResponse> reviewProposal(
            @PathVariable UUID id,
            @Valid @RequestBody ProposalReviewRequest reviewRequest) {
        log.info("POST /api/v1/opportunities/{}/review — decision: {}",
                id, reviewRequest.getDecision());
        ProposalResponse response = workflowService.reviewProposal(id, reviewRequest);
        return ResponseEntity.ok(response);
    }
}
