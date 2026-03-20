package com.chakro.server.exception;

public class ScrapingTimeoutException extends RuntimeException {
    public ScrapingTimeoutException(String message) {
        super(message);
    }
}
