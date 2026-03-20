package com.chakro.server.dto;

import com.chakro.server.domain.OpportunityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for proposal draft details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {

    private UUID id;
    private UUID opportunityId;
    private OpportunityStatus status;
    private String downloadUrl;
    private Integer version;
    private String previewHtml;
    private String reviewFeedback;
}
