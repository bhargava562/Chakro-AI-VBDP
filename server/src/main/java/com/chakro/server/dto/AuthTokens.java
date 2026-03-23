package com.chakro.server.dto;

import java.io.Serializable;

/**
 * DTO for JWT tokens in response.
 */
public record AuthTokens(
        String accessToken,
        String refreshToken,
        long expiresAt
) implements Serializable {}
