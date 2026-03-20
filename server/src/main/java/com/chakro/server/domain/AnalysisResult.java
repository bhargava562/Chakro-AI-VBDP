package com.chakro.server.domain;

import java.util.List;

/**
 * Structured in-memory representation of the analysis output
 * produced by the Analysis Agent pipeline. This is serialized to
 * JSON and stored in Opportunity.rawAnalysisJson.
 */
public record AnalysisResult(
        List<String> requirements,
        List<String> risks,
        String eligibility,
        String scope,
        String deadlines,
        String complianceNotes,
        String technicalSpecs,
        String summary
) {
    /**
     * Factory method for creating an empty/error result.
     */
    public static AnalysisResult empty(String reason) {
        return new AnalysisResult(
                List.of(), List.of(),
                "Unable to determine", "Unable to determine",
                "Unable to determine", reason,
                "Unable to determine", reason
        );
    }
}
