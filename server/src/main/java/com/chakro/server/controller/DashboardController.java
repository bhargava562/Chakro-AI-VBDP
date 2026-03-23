package com.chakro.server.controller;

import com.chakro.server.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for dashboard data endpoints.
 * Provides metrics, profile, opportunities, and analytics data.
 * All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/v1/dashboard/metrics
     * Returns key performance metrics for the authenticated user.
     */
    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics(Authentication authentication) {
        log.info("GET /api/v1/dashboard/metrics - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getUserMetrics(UUID.fromString(userId)));
    }

    /**
     * GET /api/v1/dashboard/profile
     * Returns the authenticated user's profile information.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        log.info("GET /api/v1/dashboard/profile - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getUserProfile(UUID.fromString(userId)));
    }

    /**
     * GET /api/v1/dashboard/tenders
     * Returns active tender opportunities for the user.
     * Query param: limit (default 10)
     */
    @GetMapping("/tenders")
    public ResponseEntity<?> getTenderAlerts(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("GET /api/v1/dashboard/tenders - user: {} limit: {}", authentication.getName(), limit);
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getTenderAlerts(UUID.fromString(userId), limit));
    }

    /**
     * GET /api/v1/dashboard/proposals
     * Returns recent proposals for the authenticated user.
     */
    @GetMapping("/proposals")
    public ResponseEntity<?> getRecentProposals(Authentication authentication) {
        log.info("GET /api/v1/dashboard/proposals - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getRecentProposals(UUID.fromString(userId)));
    }

    /**
     * GET /api/v1/dashboard/compliance
     * Returns compliance warnings and notices for the user.
     */
    @GetMapping("/compliance")
    public ResponseEntity<?> getComplianceWarnings(Authentication authentication) {
        log.info("GET /api/v1/dashboard/compliance - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getComplianceWarnings(UUID.fromString(userId)));
    }

    /**
     * GET /api/v1/dashboard/industry-analytics
     * Returns industry distribution analytics.
     */
    @GetMapping("/industry-analytics")
    public ResponseEntity<?> getIndustryAnalytics(Authentication authentication) {
        log.info("GET /api/v1/dashboard/industry-analytics - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getIndustryAnalytics(UUID.fromString(userId)));
    }

    /**
     * GET /api/v1/dashboard/win-trends
     * Returns win probability trends analytics.
     */
    @GetMapping("/win-trends")
    public ResponseEntity<?> getWinTrendAnalytics(Authentication authentication) {
        log.info("GET /api/v1/dashboard/win-trends - user: {}", authentication.getName());
        String userId = extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(dashboardService.getWinTrendAnalytics(UUID.fromString(userId)));
    }

    // ========== Helper Methods ==========

    /**
     * Extracts user ID from Spring Security authentication.
     * In a JWT setup, this would typically come from the token claims.
     * For now, using principal name (email) as fallback.
     */
    private String extractUserIdFromAuth(Authentication authentication) {
        // TODO: Extract userId from JWT token claims
        // For now, use the principal name (email) 
        return authentication.getName();
    }
}
