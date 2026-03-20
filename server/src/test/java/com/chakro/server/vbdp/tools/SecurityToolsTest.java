package com.chakro.server.vbdp.tools;

import com.chakro.server.vbdp.model.SecurityAssessment;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityToolsTest {

    private final SecurityTools tools = new SecurityTools();

    @Test
    void detectMaliciousPatterns_shouldFlagSqlInjection() {
        SecurityAssessment assessment = tools.detectMaliciousPatterns("SELECT * FROM users; --");
        assertThat(assessment.getStatus()).isEqualTo(SecurityAssessment.Status.SECURITY_VIOLATION);
        assertThat(assessment.getFindings()).anyMatch(f -> f.contains("SQL injection"));
    }

    @Test
    void detectMaliciousPatterns_shouldPassCleanText() {
        SecurityAssessment assessment = tools.detectMaliciousPatterns("This is a normal problem statement.");
        assertThat(assessment.getStatus()).isEqualTo(SecurityAssessment.Status.PASS);
    }
}
