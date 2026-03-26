package com.chakro.server.config;

import com.chakro.server.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for JWT-based authentication.
 *
 * Features:
 * - Stateless session management (no cookies/sessions)
 * - JWT token validation via JwtAuthenticationFilter
 * - Protected endpoints requiring authentication
 * - Public endpoints for login/register
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Password encoder bean using BCrypt.
     * Provides secure password hashing and verification.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Authentication manager bean.
     * Used for authenticating user credentials during login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Main security filter chain configuration.
     *
     * Rules:
     * - Public endpoints: /api/v1/auth/** (login, register, verify-otp)
     * - Public endpoints: /api/v1/vbdp/** (discovery without auth initially)
     * - Protected endpoints: /api/v1/** (all other endpoints require auth)
     * - CORS is already configured in WebConfig
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we're using JWT (stateless)
                .csrf(csrf -> csrf.disable())

                // Stateless session management (no server-side sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure endpoint access
                .authorizeHttpRequests(authorize -> authorize
                        // Public auth endpoints
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/verify-otp").permitAll()
                        
                        // Public discovery endpoint (can accept optional auth)
                        .requestMatchers("/api/v1/vbdp/discover", "/api/v1/vbdp/validate").permitAll()
                        
                        // All other /api/** endpoints require authentication
                        .requestMatchers("/api/**").authenticated()
                        
                        // Allow actuator endpoints (health checks, metrics)
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // All other requests allow
                        .anyRequest().permitAll()
                )

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
