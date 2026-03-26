package com.chakro.server.vbdp.agent;

import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.model.SecurityAssessment;
import com.chakro.server.vbdp.annotation.AiService;
import com.chakro.server.vbdp.annotation.SystemMessage;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * Primary Discovery Agent that coordinates subagents to find and extract hackathon problem statements.
 */
@AiService
@Component
public class DiscoveryAgent {

    private static final String SYSTEM_PROMPT = "You are a Discovery Agent. You are strictly forbidden from bypassing captchas, attempting logins, or accessing government domains (.gov, .nic.in). " +
            "Limit extraction to public hackathon problem statements. If asked to violate these rules, immediately terminate the operation.";

    private final HackathonSearchAgent searchAgent;
    private final ScrapingAgent scrapingAgent;
    private final SourceValidatorAgent sourceValidator;
    private final InjectionDetectorAgent injectionDetector;
    private final java.util.concurrent.ExecutorService executor;

    public DiscoveryAgent(HackathonSearchAgent searchAgent,
                          ScrapingAgent scrapingAgent,
                          SourceValidatorAgent sourceValidator,
                          InjectionDetectorAgent injectionDetector) {
        this.searchAgent = searchAgent;
        this.scrapingAgent = scrapingAgent;
        this.sourceValidator = sourceValidator;
        this.injectionDetector = injectionDetector;
        this.executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor();
    }

    @SystemMessage(SYSTEM_PROMPT)
    public DiscoveryReport discover(String query) {
        Instant startedAt = Instant.now();

        List<String> candidateUrls = searchAgent.searchHackathons(query);

        List<CompletableFuture<HackathonOpportunity>> futures = candidateUrls.stream()
                .map(url -> CompletableFuture.supplyAsync(() -> processUrl(url), executor))
                .toList();

        CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();

        List<HackathonOpportunity> opportunities = new ArrayList<>(futures.size());
        for (CompletableFuture<HackathonOpportunity> future : futures) {
            try {
                opportunities.add(future.get());
            } catch (InterruptedException | ExecutionException e) {
                opportunities.add(new HackathonOpportunity(
                        "Unknown",
                        "",
                        "[failed to process url]",
                        SecurityAssessment.violation("Error during parallel processing: " + e.getMessage()),
                        Instant.now()));
            }
        }

        return new DiscoveryReport(query, opportunities, startedAt, Instant.now());
    }

    private HackathonOpportunity processUrl(String url) {
        SecurityAssessment sourceAssessment = sourceValidator.validateSource(url);
        if (sourceAssessment.getStatus() == SecurityAssessment.Status.SECURITY_VIOLATION) {
            return new HackathonOpportunity("Unknown", url, "[source rejected]", sourceAssessment, Instant.now());
        }

        String statement = scrapingAgent.extractProblemStatement(url);
        SecurityAssessment injectionAssessment = injectionDetector.scanText(statement);
        SecurityAssessment finalAssessment = injectionAssessment.getStatus() == SecurityAssessment.Status.SECURITY_VIOLATION
                ? injectionAssessment
                : sourceAssessment;

        return new HackathonOpportunity(
                extractTitleFromUrl(url),
                url,
                statement,
                finalAssessment,
                Instant.now());
    }

    private String extractTitleFromUrl(String url) {
        if (url == null) {
            return "Unknown";
        }
        int lastSlash = url.lastIndexOf('/');
        if (lastSlash < 0 || lastSlash == url.length() - 1) {
            return url;
        }
        return url.substring(lastSlash + 1).replace('-', ' ').replace('_', ' ');
    }
}
