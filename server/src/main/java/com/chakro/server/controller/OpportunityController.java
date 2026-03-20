package com.chakro.server.controller;

import com.chakro.server.dto.OpportunityRequest;
import com.chakro.server.dto.OpportunityResponse;
import com.chakro.server.dto.ProposalResponse;
import com.chakro.server.service.WorkflowOrchestrationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for opportunity management — submission, listing,
 * analysis triggering, and proposal generation.
 */
@RestController
@RequestMapping("/api/v1/opportunities")
public class OpportunityController {

    private static final Logger log = LoggerFactory.getLogger(OpportunityController.class);
    private final WorkflowOrchestrationService workflowService;

    public OpportunityController(WorkflowOrchestrationService workflowService) {
        this.workflowService = workflowService;
    }

    /**
     * Submit a new tender opportunity.
     */
    @PostMapping
    public ResponseEntity<OpportunityResponse> submitOpportunity(
            @Valid @RequestBody OpportunityRequest request) {
        log.info("POST /api/v1/opportunities — title: {}", request.getTitle());
        OpportunityResponse response = workflowService.submitOpportunity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * List all opportunities.
     */
    @GetMapping
    public ResponseEntity<List<OpportunityResponse>> listOpportunities() {
        log.info("GET /api/v1/opportunities");
        List<OpportunityResponse> responses = workflowService.listOpportunities();
        return ResponseEntity.ok(responses);
    }

    /**
     * Get opportunity details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OpportunityResponse> getOpportunity(@PathVariable UUID id) {
        log.info("GET /api/v1/opportunities/{}", id);
        OpportunityResponse response = workflowService.getOpportunity(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Trigger analysis for an opportunity.
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<OpportunityResponse> analyzeOpportunity(@PathVariable UUID id) {
        log.info("POST /api/v1/opportunities/{}/analyze", id);
        OpportunityResponse response = workflowService.runAnalysis(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Trigger proposal generation for an analyzed opportunity.
     */
    @PostMapping("/{id}/generate-proposal")
    public ResponseEntity<ProposalResponse> generateProposal(@PathVariable UUID id) {
        log.info("POST /api/v1/opportunities/{}/generate-proposal", id);
        ProposalResponse response = workflowService.generateProposal(id);
        return ResponseEntity.ok(response);
    }
}
