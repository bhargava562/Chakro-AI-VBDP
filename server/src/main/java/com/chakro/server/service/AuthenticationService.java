package com.chakro.server.service;

import com.chakro.server.domain.Tenant;
import com.chakro.server.domain.User;
import com.chakro.server.dto.*;
import com.chakro.server.repository.TenantRepository;
import com.chakro.server.repository.UserRepository;
import com.chakro.server.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Authentication service handling login, registration, and token management.
 * Implements secure password hashing and JWT token generation.
 */
@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository,
                               TenantRepository tenantRepository,
                               JwtTokenProvider tokenProvider,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates user credentials and returns JWT tokens.
     * @throws BadCredentialsException if email not found or password incorrect
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        User user = userRepository.findByEmailAndIsActiveTrue(request.email())
                .orElseThrow(() -> {
                    log.warn("Login failed: user not found or inactive - {}", request.email());
                    return new BadCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Login failed: incorrect password for {}", request.email());
            throw new BadCredentialsException("Invalid email or password");
        }

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );
        String refreshToken = tokenProvider.generateRefreshToken(
                user.getId().toString(),
                user.getEmail()
        );

        // Store refresh token in database
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(OffsetDateTime.now().plusDays(7));
        userRepository.save(user);

        log.info("Login successful for email: {}", request.email());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    /**
     * Registers a new user account.
     * Creates a tenant if company doesn't exist.
     * @throws IllegalArgumentException if email already exists
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.email());

        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration failed: email already exists - {}", request.email());
            throw new IllegalArgumentException("Email already registered");
        }

        // Find or create tenant
        Optional<Tenant> existingTenant = tenantRepository.findByName(request.companyName());
        Tenant tenant = existingTenant.orElseGet(() -> {
            Tenant newTenant = Tenant.builder()
                    .name(request.companyName())
                    .companyName(request.companyName())
                    .build();
            return tenantRepository.save(newTenant);
        });

        // Create new user
        User newUser = User.builder()
                .tenant(tenant)
                .email(request.email())
                .name(request.name())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(User.Role.owner) // First user is owner
                .isActive(true)
                .build();

        newUser = userRepository.save(newUser);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(
                newUser.getId().toString(),
                newUser.getEmail(),
                newUser.getRole().name()
        );
        String refreshToken = tokenProvider.generateRefreshToken(
                newUser.getId().toString(),
                newUser.getEmail()
        );

        // Store refresh token
        newUser.setRefreshToken(refreshToken);
        newUser.setRefreshTokenExpiry(OffsetDateTime.now().plusDays(7));
        userRepository.save(newUser);

        log.info("Registration successful for email: {}", request.email());
        return buildAuthResponse(newUser, accessToken, refreshToken);
    }

    /**
     * Verifies OTP and authenticates user.
     * Checks if OTP matches and has not expired.
     */
    @Transactional
    public AuthResponse verifyOTP(OTPRequest request) {
        log.info("OTP verification attempt for email: {}", request.email());

        User user = userRepository.findByEmailAndIsActiveTrue(request.email())
                .orElseThrow(() -> {
                    log.warn("OTP verification failed: user not found - {}", request.email());
                    return new BadCredentialsException("User not found");
                });

        // Actual OTP verification
        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.otp())) {
            log.warn("OTP verification failed: invalid code for {}", request.email());
            throw new BadCredentialsException("Invalid OTP code");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(OffsetDateTime.now())) {
            log.warn("OTP verification failed: code expired for {}", request.email());
            throw new BadCredentialsException("OTP code has expired");
        }

        // Clear OTP after successful verification
        user.setOtpCode(null);
        user.setOtpExpiry(null);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );
        String refreshToken = tokenProvider.generateRefreshToken(
                user.getId().toString(),
                user.getEmail()
        );

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(OffsetDateTime.now().plusDays(7));
        userRepository.save(user);

        log.info("OTP verification successful for email: {}", request.email());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    /**
     * Generates and stores a new 6-digit OTP for the given user.
     * @return The generated OTP code
     */
    @Transactional
    public String generateOTP(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(OffsetDateTime.now().plusMinutes(10));
        userRepository.save(user);

        log.info("Generated new OTP for user: {}", email);
        return otp;
    }

    /**
     * Refreshes an access token using a valid refresh token.
     */
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            log.warn("Token refresh failed: invalid or expired refresh token");
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        // Verify stored refresh token matches
        if (!refreshToken.equals(user.getRefreshToken())) {
            log.warn("Token refresh failed: refresh token mismatch for {}", email);
            throw new BadCredentialsException("Invalid refresh token");
        }

        // Generate new tokens
        String newAccessToken = tokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );
        String newRefreshToken = tokenProvider.generateRefreshToken(
                user.getId().toString(),
                user.getEmail()
        );

        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiry(OffsetDateTime.now().plusDays(7));
        userRepository.save(user);

        log.info("Token refresh successful for email: {}", email);
        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    /**
     * Gets user profile by ID.
     */
    @Transactional
    public UserResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return mapUserToResponse(user);
    }

    /**
     * Helper method to build AuthResponse from User and tokens.
     */
    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        UserResponse userResponse = mapUserToResponse(user);
        long expiresAt = tokenProvider.getExpirationTimeMs(accessToken);
        return new AuthResponse(
                userResponse,
                new AuthTokens(accessToken, refreshToken, expiresAt)
        );
    }

    /**
     * Helper method to map User entity to UserResponse DTO.
     */
    private UserResponse mapUserToResponse(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getTenant().getId().toString(),
                user.getAvatarUrl(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : OffsetDateTime.now().toString()
        );
    }
}
