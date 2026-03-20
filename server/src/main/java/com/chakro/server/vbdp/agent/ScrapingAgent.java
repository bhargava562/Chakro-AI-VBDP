package com.chakro.server.vbdp.agent;

import com.chakro.server.vbdp.annotation.AiService;
import com.chakro.server.vbdp.annotation.SystemMessage;
import com.chakro.server.vbdp.service.GroqService;
import com.chakro.server.vbdp.tools.WebScraperTools;
import org.springframework.stereotype.Component;

/**
 * Subagent responsible for extracting the problem statement from a hackathon page.
 */
@AiService
@Component
public class ScrapingAgent {

    private static final String SYSTEM_PROMPT = "You are a Scraping Agent that extracts the problem statement from a given hackathon page. " +
            "You must NOT log in, bypass CAPTCHAs, or access government domains (.gov, .nic.in). " +
            "Return only the clean textual problem statement and a short title, without any markup.";

    private final GroqService groqService;
    private final WebScraperTools scraperTools;

    public ScrapingAgent(GroqService groqService, WebScraperTools scraperTools) {
        this.groqService = groqService;
        this.scraperTools = scraperTools;
    }

    @SystemMessage(SYSTEM_PROMPT)
    public String extractProblemStatement(String url) {
        String pageText = scraperTools.fetchPageContent(url);
        if (pageText == null || pageText.isBlank()) {
            return "";
        }

        // Use the model to filter/select the most relevant segment of the page.
        String prompt = "Extract the hackathon problem statement from the following page content. " +
                "Return a concise, plain-text description only (no metadata or links).\n\n" + pageText;

        return groqService.ask(SYSTEM_PROMPT, prompt);
    }
}
