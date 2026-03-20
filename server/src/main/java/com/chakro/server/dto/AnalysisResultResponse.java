package com.chakro.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for structured analysis results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResultResponse {

    private List<String> requirements;
    private List<String> risks;
    private String eligibility;
    private String scope;
    private String deadlines;
    private String complianceNotes;
    private String technicalSpecs;
    private String summary;
}
