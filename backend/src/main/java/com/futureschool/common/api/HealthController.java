package com.futureschool.common.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public health check endpoint for monitoring uptime without exposing credentials.
 */
@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Public health monitoring endpoints")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend application health status")
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth(HttpServletRequest request) {
        String requestId = (String) request.getAttribute(CorrelationIdFilter.REQUEST_ID_ATTRIBUTE);
        Map<String, String> status = Map.of(
                "status", "UP",
                "application", "FutureSchool Backend Foundation",
                "version", "1.0.0-SNAPSHOT"
        );
        return ResponseEntity.ok(ApiResponse.of(status, requestId));
    }
}
