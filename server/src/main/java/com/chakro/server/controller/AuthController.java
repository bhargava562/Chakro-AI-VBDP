package com.chakro.server.controller;

import com.chakro.server.dto.*;
import com.chakro.server.service.AuthenticationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * REST controller for authentication endpoints.
 * Handles user registration, login, token refresh, and profile retrieval.
 * 
 * All endpoints are public except /profile which requires authentication.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    /**
     * POST /api/v1/auth/login
     * Authenticates user with email and password.
     * Returns JWT tokens and user profile.
     *
     * @param request Login credentials (email, password)
     * @return AuthResponse with user and tokens
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/v1/auth/login - email: {}", request.email());
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/register
     * Registers a new user account.
     * Creates tenant if needed. Returns JWT tokens.
     *
     * @param request Registration data (name, email, password, company)
     * @return AuthResponse with user and tokens
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/v1/auth/register - email: {}", request.email());
        AuthResponse response = authenticationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/v1/auth/verify-otp
     * Verifies OTP and authenticates user.
     * Returns JWT tokens on success.
     *
     * @param request OTP verification data (email, otp)
     * @return AuthResponse with user and tokens
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOTP(@Valid @RequestBody OTPRequest request) {
        log.info("POST /api/v1/auth/verify-otp - email: {}", request.email());
        AuthResponse response = authenticationService.verifyOTP(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/refresh
     * Refreshes access token using refresh token.
     * Returns new access and refresh tokens.
     *
     * Request body should contain: { "refreshToken": "..." }
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        log.info("POST /api/v1/auth/refresh");
        AuthResponse response = authenticationService.refreshToken(request.refreshToken());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/auth/profile
     * Retrieves authenticated user's profile.
     * Requires valid JWT token in Authorization header.
     *
     * @param principal Spring Security principal containing authenticated user
     * @return UserResponse with user details
     */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.chakro.server.domain.User user) {
        log.info("GET /api/v1/auth/profile - user: {}", user.getEmail());
        
        UserResponse response = new UserResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getTenant().getId().toString(),
                user.getAvatarUrl(),
                user.getCreatedAt().toString()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/logout
     * Invalidates refresh token (optional, client can just discard tokens).
     * Tokens are stateless so server-side logout is optional.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(Principal principal) {
        log.info("POST /api/v1/auth/logout - user: {}", principal.getName());
        // Token-based auth is stateless, client removes tokens
        // Optional: blacklist refresh token in database
        return ResponseEntity.noContent().build();
    }

    // ========== Error Handling ==========

    /**
     * Exception handler for validation errors.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("VALIDATION_ERROR", ex.getMessage()));
    }

    /**
     * Exception handler for authentication errors.
     */
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex) {
        log.warn("Authentication error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("AUTHENTICATION_ERROR", "Invalid credentials"));
    }
}

/**
 * Request body for token refresh endpoint.
 */
record RefreshTokenRequest(String refreshToken) {}

/**
 * Standard error response format.
 */
record ErrorResponse(String errorCode, String message) {}
