package com.chakro.server;

import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.dto.OpportunityRequest;
import com.chakro.server.dto.ProposalReviewRequest;
import com.chakro.server.exception.ResourceNotFoundException;
import com.chakro.server.exception.UnauthorizedDownloadException;
import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.repository.ProposalDraftRepository;
import com.chakro.server.service.AnalysisService;
import com.chakro.server.service.ProposalService;
import com.chakro.server.service.WorkflowOrchestrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WorkflowOrchestrationService covering state transitions,
 * HITL workflow, and download enforcement.
 */
@ExtendWith(MockitoExtension.class)
class WorkflowOrchestrationServiceTest {

    @Mock
    private OpportunityRepository opportunityRepository;

    @Mock
    private ProposalDraftRepository proposalDraftRepository;

    @Mock
    private AnalysisService analysisService;

    @Mock
    private ProposalService proposalService;

    @InjectMocks
    private WorkflowOrchestrationService workflowService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        // Inject ObjectMapper via reflection since it's a constructor parameter
        try {
            var field = WorkflowOrchestrationService.class.getDeclaredField("objectMapper");
            field.setAccessible(true);
            field.set(workflowService, objectMapper);
        } catch (Exception e) {
            // ObjectMapper will be injected normally in Spring context
        }
    }

    @Nested
    @DisplayName("submitOpportunity")
    class SubmitOpportunityTests {

        @Test
        @DisplayName("should create opportunity with INGESTED status")
        void shouldCreateWithIngestedStatus() {
            OpportunityRequest request = OpportunityRequest.builder()
                    .title("Test Tender")
                    .description("Test description")
                    .sourceUrl("https://example.com/tender")
                    .build();

            Opportunity savedOpportunity = Opportunity.builder()
                    .id(UUID.randomUUID())
                    .title("Test Tender")
                    .description("Test description")
                    .sourceUrl("https://example.com/tender")
                    .status(OpportunityStatus.INGESTED)
                    .build();

            when(opportunityRepository.save(any(Opportunity.class)))
                    .thenReturn(savedOpportunity);

            var response = workflowService.submitOpportunity(request);

            assertThat(response.getTitle()).isEqualTo("Test Tender");
            assertThat(response.getStatus()).isEqualTo(OpportunityStatus.INGESTED);
            verify(opportunityRepository).save(any(Opportunity.class));
        }
    }

    @Nested
    @DisplayName("downloadFinalProposal")
    class DownloadTests {

        @Test
        @DisplayName("should allow download for APPROVED status")
        void shouldAllowApprovedDownload() {
            UUID id = UUID.randomUUID();
            Opportunity opportunity = Opportunity.builder()
                    .id(id)
                    .title("Approved Tender")
                    .status(OpportunityStatus.APPROVED)
                    .build();

            ProposalDraft draft = ProposalDraft.builder()
                    .id(UUID.randomUUID())
                    .opportunity(opportunity)
                    .contentText("Final content")
                    .version(1)
                    .build();

            when(opportunityRepository.findById(id)).thenReturn(Optional.of(opportunity));
            when(proposalService.getLatestDraft(id)).thenReturn(draft);

            ProposalDraft result = workflowService.downloadFinalProposal(id);

            assertThat(result.getContentText()).isEqualTo("Final content");
        }

        @Test
        @DisplayName("should deny download for AWAITING_REVIEW status")
        void shouldDenyNonApprovedDownload() {
            UUID id = UUID.randomUUID();
            Opportunity opportunity = Opportunity.builder()
                    .id(id)
                    .title("Pending Tender")
                    .status(OpportunityStatus.AWAITING_REVIEW)
                    .build();

            when(opportunityRepository.findById(id)).thenReturn(Optional.of(opportunity));

            assertThatThrownBy(() -> workflowService.downloadFinalProposal(id))
                    .isInstanceOf(UnauthorizedDownloadException.class)
                    .hasMessageContaining("not been approved");
        }

        @Test
        @DisplayName("should deny download for INGESTED status")
        void shouldDenyIngestedDownload() {
            UUID id = UUID.randomUUID();
            Opportunity opportunity = Opportunity.builder()
                    .id(id)
                    .title("New Tender")
                    .status(OpportunityStatus.INGESTED)
                    .build();

            when(opportunityRepository.findById(id)).thenReturn(Optional.of(opportunity));

            assertThatThrownBy(() -> workflowService.downloadFinalProposal(id))
                    .isInstanceOf(UnauthorizedDownloadException.class);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException for missing opportunity")
        void shouldThrowNotFoundForMissing() {
            UUID id = UUID.randomUUID();
            when(opportunityRepository.findById(id)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> workflowService.downloadFinalProposal(id))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("not found");
        }
    }

    @Nested
    @DisplayName("reviewProposal")
    class ReviewTests {

        @Test
        @DisplayName("should throw for non-AWAITING_REVIEW status")
        void shouldRejectReviewForWrongStatus() {
            UUID id = UUID.randomUUID();
            Opportunity opportunity = Opportunity.builder()
                    .id(id)
                    .title("Test")
                    .status(OpportunityStatus.INGESTED)
                    .build();

            ProposalReviewRequest request = ProposalReviewRequest.builder()
                    .decision(ProposalReviewRequest.ReviewDecision.APPROVED)
                    .build();

            when(opportunityRepository.findById(id)).thenReturn(Optional.of(opportunity));

            assertThatThrownBy(() -> workflowService.reviewProposal(id, request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("not in AWAITING_REVIEW");
        }
    }
}
