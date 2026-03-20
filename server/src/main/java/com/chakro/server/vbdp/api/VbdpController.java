package com.chakro.server.vbdp.api;

import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.service.VbdpOrchestrationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public-facing API for the Virtual Business Development Partner (VBDP).
 */
@RestController
@RequestMapping(path = "/api/v1/vbdp", produces = MediaType.APPLICATION_JSON_VALUE)
public class VbdpController {

    private final VbdpOrchestrationService orchestrationService;

    public VbdpController(VbdpOrchestrationService orchestrationService) {
        this.orchestrationService = orchestrationService;
    }

    @PostMapping("/discover")
    public DiscoveryReport discover(@RequestParam("query") String query) {
        return orchestrationService.runDiscovery(query);
    }

    @PostMapping("/validate")
    public List<HackathonOpportunity> validate(@RequestBody List<HackathonOpportunity> opportunities) {
        return orchestrationService.runSecurityReview(opportunities);
    }
}
