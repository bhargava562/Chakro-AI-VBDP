package com.chakro.server.exception;

/**
 * Thrown when proposal generation fails (e.g., content generation error,
 * document file creation failure, template retrieval issue).
 */
public class ProposalGenerationException extends RuntimeException {

    public ProposalGenerationException(String message) {
        super(message);
    }

    public ProposalGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
