package com.chakro.server.agent.sub;

import com.chakro.server.agent.tool.DocumentParsingTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Sub-agent responsible for ingesting opportunity documents.
 * Takes raw URL or document input and returns cleaned text.
 */
@Component
public class DocumentIngestionSubAgent {

    private static final Logger log = LoggerFactory.getLogger(DocumentIngestionSubAgent.class);
    private final DocumentParsingTool documentParsingTool;

    public DocumentIngestionSubAgent(DocumentParsingTool documentParsingTool) {
        this.documentParsingTool = documentParsingTool;
    }

    /**
     * Ingests a document from a URL or raw content and
     * returns cleaned, parsed text ready for analysis.
     *
     * @param sourceUrl optional URL to fetch document from
     * @param rawContent optional raw HTML/text content
     * @return cleaned document text
     */
    public String ingest(String sourceUrl, String rawContent) {
        log.info("DocumentIngestionSubAgent: starting ingestion");

        String inputData;
        if (sourceUrl != null && !sourceUrl.isBlank()) {
            inputData = sourceUrl;
            log.info("Ingesting from URL source");
        } else if (rawContent != null && !rawContent.isBlank()) {
            inputData = rawContent;
            log.info("Ingesting from raw content ({} chars)", rawContent.length());
        } else {
            log.warn("No source URL or content provided for ingestion");
            return "";
        }

        String parsedText = documentParsingTool.parseDocumentContent(inputData);

        if (parsedText.startsWith("Error")) {
            log.error("Document ingestion failed: {}", parsedText);
            return parsedText;
        }

        log.info("DocumentIngestionSubAgent: completed. Extracted {} chars", parsedText.length());
        return parsedText;
    }
}
