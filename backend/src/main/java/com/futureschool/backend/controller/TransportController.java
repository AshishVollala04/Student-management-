package com.futureschool.backend.controller;

import com.futureschool.backend.entity.TransportRoute;
import com.futureschool.backend.service.TransportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
@Tag(name = "Transport & Fleet", description = "Endpoints for school bus routes, driver details, and student stop assignments")
public class TransportController {

    private final TransportService transportService;

    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @GetMapping("/routes")
    @Operation(summary = "Get all active bus routes and vehicle allocations")
    public ResponseEntity<List<TransportRoute>> getRoutes() {
        return ResponseEntity.ok(transportService.getAllRoutes());
    }

    @PostMapping("/routes")
    @Operation(summary = "Create or update a school bus route")
    public ResponseEntity<TransportRoute> saveRoute(@RequestBody TransportRoute route) {
        return ResponseEntity.ok(transportService.saveRoute(route));
    }

    @DeleteMapping("/routes/{id}")
    @Operation(summary = "Delete bus route")
    public ResponseEntity<?> deleteRoute(@PathVariable String id) {
        transportService.deleteRoute(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Route deleted: " + id));
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign a student to a transport route")
    public ResponseEntity<?> assignStudent(@RequestBody Map<String, String> body) {
        try {
            String studentId = body.get("studentId");
            String routeId = body.get("routeId");
            return ResponseEntity.ok(transportService.assignStudentToRoute(studentId, routeId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
