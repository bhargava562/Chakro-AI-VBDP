package com.chakro.server.vbdp.tools;

import com.chakro.server.vbdp.annotation.Tool;
import com.chakro.server.vbdp.model.SecurityAssessment;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Security tooling for validating source authenticity and detecting injection patterns.
 */
@Component
public class SecurityTools {

    private static final Duration TLS_CHECK_TIMEOUT = Duration.ofSeconds(10);

    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile("(\\b(select|union|insert|update|delete|drop|truncate)\\b|--|;|/\\*)", Pattern.CASE_INSENSITIVE);
    private static final Pattern XSS_PATTERN = Pattern.compile("(<script|<img|<iframe|onerror=|onload=)", Pattern.CASE_INSENSITIVE);
    private static final Pattern PROMPT_INJECTION_PATTERN = Pattern.compile("(ignore\s+.*instructions|forget\s+.*previous|this\s+is\s+not\s+part|malicious|javascript:)", Pattern.CASE_INSENSITIVE);

    @Tool
    public boolean verifySSL(String domain) {
        try {
            URI uri = new URI("https://" + domain);
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(TLS_CHECK_TIMEOUT)
                    .build();
            HttpRequest request = HttpRequest.newBuilder(uri)
                    .GET()
                    .build();

            HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
            // If we got any response, the TLS handshake succeeded.
            return response.statusCode() >= 200 && response.statusCode() < 500;
        } catch (Exception e) {
            return false;
        }
    }

    @Tool
    public SecurityAssessment checkDomainReputation(String url) {
        try {
            URI uri = URI.create(url);
            String host = uri.getHost();
            if (host == null) {
                return SecurityAssessment.violation("Malformed URL provided");
            }

            String lower = host.toLowerCase(Locale.ROOT);
            List<String> findings = new ArrayList<>();

            // Basic heuristics.
            if (lower.contains("bit.ly") || lower.contains("tinyurl") || lower.contains("t.co")) {
                findings.add("URL uses a URL shortener (potentially obfuscated destination)");
            }
            if (lower.endsWith(".ru") || lower.endsWith(".cn") || lower.endsWith(".kp")) {
                findings.add("URL is hosted in a high-risk top-level domain");
            }
            if (lower.contains("login") || lower.contains("secure")) {
                findings.add("URL contains login/secure keywords; validate expected portal");
            }

            if (findings.isEmpty()) {
                return SecurityAssessment.pass();
            }
            return new SecurityAssessment(SecurityAssessment.Status.WARNING, findings);
        } catch (Exception e) {
            return SecurityAssessment.violation("Failed to assess domain reputation: " + e.getMessage());
        }
    }

    @Tool
    public SecurityAssessment detectMaliciousPatterns(String text) {
        if (text == null || text.isBlank()) {
            return SecurityAssessment.pass();
        }

        List<String> findings = new ArrayList<>();
        if (SQL_INJECTION_PATTERN.matcher(text).find()) {
            findings.add("Potential SQL injection patterns detected");
        }
        if (XSS_PATTERN.matcher(text).find()) {
            findings.add("Possible XSS payload detected");
        }
        if (PROMPT_INJECTION_PATTERN.matcher(text).find()) {
            findings.add("Potential prompt injection content detected");
        }

        if (findings.isEmpty()) {
            return SecurityAssessment.pass();
        }

        return new SecurityAssessment(SecurityAssessment.Status.SECURITY_VIOLATION, findings);
    }
}
