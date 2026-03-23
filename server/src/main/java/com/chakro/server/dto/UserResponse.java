package com.chakro.server.dto;

import java.io.Serializable;

/**
 * DTO for authenticated user response.
 * Safely exposes public user information.
 */
public record UserResponse(
        String id,
        String email,
        String name,
        String role,
        String tenantId,
        String avatar,
        String createdAt
) implements Serializable {}
