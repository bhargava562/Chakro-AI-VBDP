package com.chakro.server.vbdp.api;

import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.service.VbdpOrchestrationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Master Agent (CEO Agent) — the ONLY entry point the frontend calls.
 * Orchestrates Discovery → Security → Analysis → Response internally.
 */
@RestController
@RequestMapping(path = "/api/v1/agent", produces = MediaType.APPLICATION_JSON_VALUE)
public class MasterAgentController {

    private final VbdpOrchestrationService orchestrationService;

    public MasterAgentController(VbdpOrchestrationService orchestrationService) {
        this.orchestrationService = orchestrationService;
    }

    /**
     * Single discovery entry point. Returns results without writing to DB.
     * Requires authenticated user.
     */
    @PostMapping("/run")
    @PreAuthorize("isAuthenticated()")
    public DiscoveryReport run(@RequestParam("query") String query) {
        return orchestrationService.runDiscovery(query);
    }

    /**
     * Explicit commit — only called when user initiates "Send Proposal".
     * This is the ONLY path that writes to the database.
     * Requires authenticated user.
     */
    @PostMapping("/commit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> commit(@RequestBody HackathonOpportunity opportunity) {
        orchestrationService.commitOpportunity(opportunity);
        return ResponseEntity.accepted().build();
    }
}
