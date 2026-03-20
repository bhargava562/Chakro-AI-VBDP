package com.chakro.server.vbdp.model;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Result of running the Security Agent checks on a given URL/text.
 */
public final class SecurityAssessment {

    public enum Status {
        PASS,
        WARNING,
        SECURITY_VIOLATION
    }

    private final Status status;
    private final List<String> findings;

    public SecurityAssessment(Status status, List<String> findings) {
        this.status = Objects.requireNonNull(status);
        this.findings = Collections.unmodifiableList(Objects.requireNonNull(findings));
    }

    public Status getStatus() {
        return status;
    }

    public List<String> getFindings() {
        return findings;
    }

    public static SecurityAssessment pass() {
        return new SecurityAssessment(Status.PASS, Collections.emptyList());
    }

    public static SecurityAssessment violation(String message) {
        return new SecurityAssessment(Status.SECURITY_VIOLATION, List.of(message));
    }

    public static SecurityAssessment warning(String message) {
        return new SecurityAssessment(Status.WARNING, List.of(message));
    }
}
