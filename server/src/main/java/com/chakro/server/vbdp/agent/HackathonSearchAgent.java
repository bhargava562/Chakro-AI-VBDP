package com.chakro.server.vbdp.agent;

import com.chakro.server.vbdp.annotation.AiService;
import com.chakro.server.vbdp.annotation.SystemMessage;
import com.chakro.server.vbdp.service.GroqService;
import com.chakro.server.vbdp.tools.WebScraperTools;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Subagent that uses search tools to locate public hackathon problem statements.
 */
@AiService
@Component
public class HackathonSearchAgent {

    private static final String SYSTEM_PROMPT = "You are a Hackathon Search Agent. Your job is to find public hackathon (tender) pages from open portals (e.g., Devpost, HackerEarth). " +
            "You must NOT attempt to bypass captchas, log in, or access government (.gov, .nic.in) domains. " +
            "Return only URLs that appear to contain problem statements. Do not crawl private or authenticated services.";

    private final GroqService groqService;
    private final WebScraperTools scraperTools;

    public HackathonSearchAgent(GroqService groqService, WebScraperTools scraperTools) {
        this.groqService = groqService;
        this.scraperTools = scraperTools;
    }

    @SystemMessage(SYSTEM_PROMPT)
    public List<String> searchHackathons(String query) {
        // Use the Groq model as a reasoning engine to suggest keywords and validate candidate URLs.
        String prompt = "Given the user query, suggest 3 focused search strings to discover hackathon problem statements. Query: " + query;
        String suggested = groqService.ask(SYSTEM_PROMPT, prompt);

        // Fall back to raw query if model does not respond.
        String effectiveQuery = (suggested == null || suggested.isBlank()) ? query : suggested;

        return scraperTools.searchWeb(effectiveQuery);
    }
}
