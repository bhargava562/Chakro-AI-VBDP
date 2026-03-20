package com.chakro.server.controller;

import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.service.WorkflowOrchestrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for secure proposal download.
 * Strictly enforces APPROVED status before allowing downloads.
 */
@RestController
@RequestMapping("/api/v1/opportunities")
public class DownloadController {

    private static final Logger log = LoggerFactory.getLogger(DownloadController.class);
    private final WorkflowOrchestrationService workflowService;

    public DownloadController(WorkflowOrchestrationService workflowService) {
        this.workflowService = workflowService;
    }

    /**
     * Download the final approved proposal.
     * Returns the proposal content as a downloadable text file.
     * Throws UnauthorizedDownloadException if status is not APPROVED.
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFinalProposal(@PathVariable UUID id) {
        log.info("GET /api/v1/opportunities/{}/download", id);

        // This call enforces APPROVED-only status check
        ProposalDraft draft = workflowService.downloadFinalProposal(id);

        String fileName = "proposal_v" + draft.getVersion() + "_" + id + ".txt";
        byte[] content = draft.getContentText() != null
                ? draft.getContentText().getBytes()
                : new byte[0];

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(content.length)
                .body(content);
    }
}
