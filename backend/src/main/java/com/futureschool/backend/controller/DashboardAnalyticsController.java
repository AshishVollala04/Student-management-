package com.futureschool.backend.controller;

import com.futureschool.backend.service.DashboardAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Dashboard & Analytics", description = "Endpoints for multi-role dashboard statistics and academic leaderboards")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService analyticsService;

    public DashboardAnalyticsController(DashboardAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get KPI overview statistics for role-specific dashboards")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@RequestParam(required = false) String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (auth != null) ? auth.getName() : "user";
        return ResponseEntity.ok(analyticsService.getDashboardStats(role, userId));
    }

    @GetMapping("/analytics/leaderboard")
    @Operation(summary = "Get academic performance rankings and student leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard() {
        return ResponseEntity.ok(analyticsService.getLeaderboard());
    }
}
