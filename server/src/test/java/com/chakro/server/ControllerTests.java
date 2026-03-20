package com.chakro.server;

import com.chakro.server.controller.DownloadController;
import com.chakro.server.controller.OpportunityController;
import com.chakro.server.controller.ReviewController;
import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.dto.*;
import com.chakro.server.exception.GlobalExceptionHandler;
import com.chakro.server.exception.ResourceNotFoundException;
import com.chakro.server.exception.UnauthorizedDownloadException;
import com.chakro.server.service.WorkflowOrchestrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Comprehensive unit tests for all REST controllers using MockMvc.
 * Tests cover happy paths, validation errors, state enforcement, and error handling.
 */
@WebMvcTest({OpportunityController.class, ReviewController.class,
        DownloadController.class, GlobalExceptionHandler.class})
class ControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private WorkflowOrchestrationService workflowService;

    // ==================== OpportunityController Tests ====================

    @Nested
    @DisplayName("OpportunityController")
    class OpportunityControllerTests {

        @Test
        @DisplayName("POST /api/v1/opportunities — should create opportunity")
        void shouldCreateOpportunity() throws Exception {
            UUID id = UUID.randomUUID();
            OpportunityRequest request = OpportunityRequest.builder()
                    .title("Government IT Procurement 2025")
                    .description("Large-scale IT infrastructure tender")
                    .sourceUrl("https://example.com/tender/123")
                    .build();

            OpportunityResponse response = OpportunityResponse.builder()
                    .id(id)
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .sourceUrl(request.getSourceUrl())
                    .status(OpportunityStatus.INGESTED)
                    .createdAt(OffsetDateTime.now())
                    .build();

            when(workflowService.submitOpportunity(any())).thenReturn(response);

            mockMvc.perform(post("/api/v1/opportunities")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.title").value("Government IT Procurement 2025"))
                    .andExpect(jsonPath("$.status").value("INGESTED"));

            verify(workflowService).submitOpportunity(any());
        }

        @Test
        @DisplayName("POST /api/v1/opportunities — should reject blank title")
        void shouldRejectBlankTitle() throws Exception {
            OpportunityRequest request = OpportunityRequest.builder()
                    .title("")
                    .build();

            mockMvc.perform(post("/api/v1/opportunities")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").exists());
        }

        @Test
        @DisplayName("GET /api/v1/opportunities — should list all opportunities")
        void shouldListOpportunities() throws Exception {
            OpportunityResponse opp1 = OpportunityResponse.builder()
                    .id(UUID.randomUUID())
                    .title("Tender A")
                    .status(OpportunityStatus.INGESTED)
                    .build();

            when(workflowService.listOpportunities()).thenReturn(List.of(opp1));

            mockMvc.perform(get("/api/v1/opportunities"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].title").value("Tender A"));
        }

        @Test
        @DisplayName("GET /api/v1/opportunities/{id} — should return 404 for missing ID")
        void shouldReturn404ForMissingOpportunity() throws Exception {
            UUID id = UUID.randomUUID();
            when(workflowService.getOpportunity(id))
                    .thenThrow(new ResourceNotFoundException("Opportunity not found: " + id));

            mockMvc.perform(get("/api/v1/opportunities/" + id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.error").value("Not Found"));
        }

        @Test
        @DisplayName("POST /api/v1/opportunities/{id}/analyze — should trigger analysis")
        void shouldTriggerAnalysis() throws Exception {
            UUID id = UUID.randomUUID();
            OpportunityResponse response = OpportunityResponse.builder()
                    .id(id)
                    .title("Tender")
                    .status(OpportunityStatus.ANALYSIS_COMPLETE)
                    .build();

            when(workflowService.runAnalysis(id)).thenReturn(response);

            mockMvc.perform(post("/api/v1/opportunities/" + id + "/analyze"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("ANALYSIS_COMPLETE"));
        }
    }

    // ==================== ReviewController Tests ====================

    @Nested
    @DisplayName("ReviewController")
    class ReviewControllerTests {

        @Test
        @DisplayName("POST /review — should approve proposal")
        void shouldApproveProposal() throws Exception {
            UUID id = UUID.randomUUID();
            ProposalReviewRequest reviewRequest = ProposalReviewRequest.builder()
                    .decision(ProposalReviewRequest.ReviewDecision.APPROVED)
                    .build();

            ProposalResponse response = ProposalResponse.builder()
                    .id(UUID.randomUUID())
                    .opportunityId(id)
                    .status(OpportunityStatus.APPROVED)
                    .version(1)
                    .downloadUrl("/api/v1/opportunities/" + id + "/download")
                    .build();

            when(workflowService.reviewProposal(eq(id), any())).thenReturn(response);

            mockMvc.perform(post("/api/v1/opportunities/" + id + "/review")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(reviewRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("APPROVED"))
                    .andExpect(jsonPath("$.downloadUrl").exists());
        }

        @Test
        @DisplayName("POST /review — should handle revision request")
        void shouldHandleRevisionRequest() throws Exception {
            UUID id = UUID.randomUUID();
            ProposalReviewRequest reviewRequest = ProposalReviewRequest.builder()
                    .decision(ProposalReviewRequest.ReviewDecision.REVISION_REQUESTED)
                    .feedback("Please strengthen the technical approach section")
                    .build();

            ProposalResponse response = ProposalResponse.builder()
                    .id(UUID.randomUUID())
                    .opportunityId(id)
                    .status(OpportunityStatus.AWAITING_REVIEW)
                    .version(2)
                    .reviewFeedback("Please strengthen the technical approach section")
                    .build();

            when(workflowService.reviewProposal(eq(id), any())).thenReturn(response);

            mockMvc.perform(post("/api/v1/opportunities/" + id + "/review")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(reviewRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.version").value(2));
        }
    }

    // ==================== DownloadController Tests ====================

    @Nested
    @DisplayName("DownloadController")
    class DownloadControllerTests {

        @Test
        @DisplayName("GET /download — should return file for APPROVED proposal")
        void shouldDownloadApprovedProposal() throws Exception {
            UUID id = UUID.randomUUID();
            Opportunity opp = Opportunity.builder()
                    .id(id)
                    .title("Test")
                    .status(OpportunityStatus.APPROVED)
                    .build();

            ProposalDraft draft = ProposalDraft.builder()
                    .id(UUID.randomUUID())
                    .opportunity(opp)
                    .contentText("Proposal content here")
                    .version(1)
                    .build();

            when(workflowService.downloadFinalProposal(id)).thenReturn(draft);

            mockMvc.perform(get("/api/v1/opportunities/" + id + "/download"))
                    .andExpect(status().isOk())
                    .andExpect(header().string("Content-Disposition",
                            org.hamcrest.Matchers.containsString("attachment")));
        }

        @Test
        @DisplayName("GET /download — should return 403 for non-APPROVED proposal")
        void shouldDenyDownloadForNonApproved() throws Exception {
            UUID id = UUID.randomUUID();
            when(workflowService.downloadFinalProposal(id))
                    .thenThrow(new UnauthorizedDownloadException(
                            "Download is not permitted. Proposal not approved."));

            mockMvc.perform(get("/api/v1/opportunities/" + id + "/download"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.error").value("Forbidden"))
                    .andExpect(jsonPath("$.message").value(
                            org.hamcrest.Matchers.containsString("not permitted")));
        }
    }
}
