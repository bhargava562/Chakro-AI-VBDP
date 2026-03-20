package com.chakro.server.dto;

import com.chakro.server.domain.OpportunityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for opportunity details including analysis results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityResponse {

    private UUID id;
    private String title;
    private String description;
    private String sourceUrl;
    private OpportunityStatus status;
    private AnalysisResultResponse analysisResult;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
