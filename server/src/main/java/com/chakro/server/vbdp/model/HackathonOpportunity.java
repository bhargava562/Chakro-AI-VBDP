package com.chakro.server.vbdp.model;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * Represents a single hackathon/problem-statement match discovered by the Discovery Agent.
 */
public final class HackathonOpportunity {

    private final String title;
    private final String url;
    private final String problemStatement;
    private final SecurityAssessment securityAssessment;
    private final Instant discoveredAt;

    public HackathonOpportunity(String title,
                                String url,
                                String problemStatement,
                                SecurityAssessment securityAssessment,
                                Instant discoveredAt) {
        this.title = Objects.requireNonNull(title);
        this.url = Objects.requireNonNull(url);
        this.problemStatement = Objects.requireNonNull(problemStatement);
        this.securityAssessment = Objects.requireNonNull(securityAssessment);
        this.discoveredAt = Objects.requireNonNull(discoveredAt);
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getProblemStatement() {
        return problemStatement;
    }

    public SecurityAssessment getSecurityAssessment() {
        return securityAssessment;
    }

    public Instant getDiscoveredAt() {
        return discoveredAt;
    }
}
