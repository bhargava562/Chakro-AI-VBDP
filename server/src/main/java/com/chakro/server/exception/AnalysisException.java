package com.chakro.server.exception;

/**
 * Thrown when the analysis pipeline encounters an unrecoverable error
 * (e.g., document parsing failure, AI model timeout, invalid content).
 */
public class AnalysisException extends RuntimeException {

    public AnalysisException(String message) {
        super(message);
    }

    public AnalysisException(String message, Throwable cause) {
        super(message, cause);
    }
}
