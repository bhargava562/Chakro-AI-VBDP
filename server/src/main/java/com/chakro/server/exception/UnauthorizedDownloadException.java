package com.chakro.server.exception;

/**
 * Thrown when a download is attempted on a proposal whose status is not APPROVED.
 * This enforces the HITL (Human-in-the-Loop) workflow requirement.
 */
public class UnauthorizedDownloadException extends RuntimeException {

    public UnauthorizedDownloadException(String message) {
        super(message);
    }
}
