package com.chakro.server.agent.tool;

import dev.langchain4j.agent.tool.Tool;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * LangChain4j tool for parsing and extracting clean text from
 * HTML documents or URLs. Uses Jsoup for secure parsing.
 */
@Component
public class DocumentParsingTool {

    private static final Logger log = LoggerFactory.getLogger(DocumentParsingTool.class);
    private static final int TIMEOUT_MS = 15_000;
    private static final int MAX_BODY_SIZE = 5_000_000; // 5MB
    private static final String USER_AGENT = "ChakroVBDP/1.0 (Business Document Analyzer)";

    @Tool("Parses a document from a URL or raw HTML content and extracts clean text. "
            + "Input can be a URL starting with http/https or raw HTML content.")
    public String parseDocumentContent(String data) {
        if (data == null || data.isBlank()) {
            return "Error: No document data provided.";
        }

        try {
            Document doc;
            if (data.startsWith("http://") || data.startsWith("https://")) {
                log.info("Fetching document from URL: {}", truncateUrl(data));
                doc = Jsoup.connect(data)
                        .userAgent(USER_AGENT)
                        .timeout(TIMEOUT_MS)
                        .maxBodySize(MAX_BODY_SIZE)
                        .followRedirects(true)
                        .get();
            } else {
                log.info("Parsing raw HTML/text content ({} chars)", data.length());
                doc = Jsoup.parse(data);
            }

            // Extract and clean text
            String cleanText = doc.body().text();

            // Remove any remaining HTML tags for safety
            cleanText = Jsoup.clean(cleanText, Safelist.none());

            // Truncate very long documents for context window management
            if (cleanText.length() > 50_000) {
                log.warn("Document truncated from {} to 50000 chars", cleanText.length());
                cleanText = cleanText.substring(0, 50_000)
                        + "\n\n[Document truncated at 50,000 characters]";
            }

            log.info("Successfully parsed document: {} chars extracted", cleanText.length());
            return cleanText;

        } catch (Exception e) {
            log.error("Document parsing failed: {}", e.getMessage());
            return "Error parsing document: " + sanitizeErrorMessage(e.getMessage());
        }
    }

    private String truncateUrl(String url) {
        return url.length() > 100 ? url.substring(0, 100) + "..." : url;
    }

    private String sanitizeErrorMessage(String message) {
        if (message == null) return "Unknown error";
        // Remove potential stack traces or internal details
        return message.replaceAll("\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", "[IP_REDACTED]")
                .replaceAll("/[a-zA-Z]+/[a-zA-Z]+/[a-zA-Z]+", "[PATH_REDACTED]");
    }
}
