package com.chakro.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for human review of a proposal draft.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalReviewRequest {

    /**
     * Review decision: APPROVED or REVISION_REQUESTED.
     */
    @NotNull(message = "Review decision is required")
    private ReviewDecision decision;

    /**
     * Optional feedback for revision requests.
     */
    private String feedback;

    public enum ReviewDecision {
        APPROVED,
        REVISION_REQUESTED
    }
}
