package com.chakro.server.dto;

import java.io.Serializable;

/**
 * DTO for authentication response.
 * Returned after successful login or registration.
 */
public record AuthResponse(
        UserResponse user,
        AuthTokens tokens
) implements Serializable {}
