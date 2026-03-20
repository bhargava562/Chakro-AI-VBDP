package com.chakro.server.vbdp.agent;

import com.chakro.server.vbdp.annotation.AiService;
import com.chakro.server.vbdp.annotation.SystemMessage;
import com.chakro.server.vbdp.model.SecurityAssessment;
import com.chakro.server.vbdp.tools.SecurityTools;
import org.springframework.stereotype.Component;

/**
 * Validates SSL/TLS and domain reputation for discovered URLs.
 */
@AiService
@Component
public class SourceValidatorAgent {

    private static final String SYSTEM_PROMPT = "You are a Source Validator Agent. Your job is to validate that the source URL is authentic and likely not malicious. " +
            "You must not attempt to access private APIs or credentials. If the site fails TLS checks or domain reputation, flag it.";

    private final SecurityTools securityTools;

    public SourceValidatorAgent(SecurityTools securityTools) {
        this.securityTools = securityTools;
    }

    @SystemMessage(SYSTEM_PROMPT)
    public SecurityAssessment validateSource(String url) {
        boolean tlsOk = securityTools.verifySSL(extractHost(url));
        if (!tlsOk) {
            return SecurityAssessment.violation("TLS/SSL validation failed for " + url);
        }

        SecurityAssessment reputation = securityTools.checkDomainReputation(url);
        if (reputation.getStatus() == SecurityAssessment.Status.SECURITY_VIOLATION) {
            return reputation;
        }

        return reputation;
    }

    private String extractHost(String url) {
        try {
            return new java.net.URI(url).getHost();
        } catch (Exception e) {
            return url;
        }
    }
}
