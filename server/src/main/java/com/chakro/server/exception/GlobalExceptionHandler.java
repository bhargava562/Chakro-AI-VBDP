package com.chakro.server.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.stream.Collectors;

/**
 * Global exception handler that catches all custom and runtime exceptions,
 * returning sanitized JSON responses. Prevents application crashes and secret leaks.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex,
                                                         HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(SecurityViolationException.class)
    public ResponseEntity<ErrorResponse> handleSecurityViolation(SecurityViolationException ex,
                                                                 HttpServletRequest request) {
        log.error("SECURITY VIOLATION DETECTED: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Security Validation Failed. Request rejected.", request);
    }

    @ExceptionHandler(ScrapingTimeoutException.class)
    public ResponseEntity<ErrorResponse> handleScrapingTimeout(ScrapingTimeoutException ex,
                                                               HttpServletRequest request) {
        log.warn("Scraping timeout: {}", ex.getMessage());
        return buildResponse(HttpStatus.GATEWAY_TIMEOUT, "The discovery target took too long to respond.", request);
    }

    @ExceptionHandler(AnalysisParsingException.class)
    public ResponseEntity<ErrorResponse> handleAnalysisParsing(AnalysisParsingException ex,
                                                               HttpServletRequest request) {
        log.error("Analysis Output Parsing Error: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNPROCESSABLE_ENTITY, "AI output format was invalid.", request);
    }

    @ExceptionHandler(AnalysisException.class)
    public ResponseEntity<ErrorResponse> handleAnalysisError(AnalysisException ex,
                                                              HttpServletRequest request) {
        log.error("Analysis pipeline error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Analysis failed. Please try again or contact support.", request);
    }

    @ExceptionHandler(ProposalGenerationException.class)
    public ResponseEntity<ErrorResponse> handleProposalError(ProposalGenerationException ex,
                                                              HttpServletRequest request) {
        log.error("Proposal generation error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Proposal generation failed. Please try again or contact support.", request);
    }

    @ExceptionHandler(UnauthorizedDownloadException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedDownload(UnauthorizedDownloadException ex,
                                                                     HttpServletRequest request) {
        log.warn("Unauthorized download attempt: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                           HttpServletRequest request) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));
        log.warn("Validation error: {}", details);
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed: " + details, request);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex,
                                                             HttpServletRequest request) {
        log.warn("Illegal state: {}", ex.getMessage());
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex,
                                                        HttpServletRequest request) {
        log.error("Unexpected runtime error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex,
                                                        HttpServletRequest request) {
        log.error("Unexpected error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.", request);
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message,
                                                         HttpServletRequest request) {
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(OffsetDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}
