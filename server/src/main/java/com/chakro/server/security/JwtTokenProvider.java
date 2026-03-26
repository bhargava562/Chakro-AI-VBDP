package com.chakro.server.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility component for JWT token generation and validation.
 * Uses JJWT (JSON Web Token for Java) library.
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret-key:my-secret-key-for-jwts-that-is-at-least-32-characters-long}")
    private String secretKey;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationMs;

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Generates an access token for a user.
     * Default expiration: 1 hour
     */
    public String generateAccessToken(String userId, String email, String role) {
        return generateToken(userId, email, role, expirationMs);
    }

    /**
     * Generates a refresh token for a user.
     * Default expiration: 7 days
     */
    public String generateRefreshToken(String userId, String email) {
        return generateToken(userId, email, null, refreshExpirationMs);
    }

    /**
     * Internal method to generate JWT tokens.
     */
    private String generateToken(String userId, String email, String role, long expirationMs) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        if (role != null) {
            claims.put("role", role);
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the email (subject) from a JWT token.
     */
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * Extracts the userId from a JWT token.
     */
    public String getUserIdFromToken(String token) {
        return getClaimsFromToken(token).get("userId", String.class);
    }

    /**
     * Extracts the role from a JWT token (access tokens only).
     */
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    /**
     * Validates if a token is still valid (not expired).
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * Extracts all claims from a JWT token.
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Checks if a token is expired.
     */
    public boolean isTokenExpired(String token) {
        try {
            return getClaimsFromToken(token).getExpiration().before(new Date());
        } catch (Exception ex) {
            return true;
        }
    }

    /**
     * Gets the expiration time in milliseconds from the token.
     */
    public long getExpirationTimeMs(String token) {
        return getClaimsFromToken(token).getExpiration().getTime();
    }
}
