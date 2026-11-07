package com.futureschool.backend.controller;

import com.futureschool.backend.entity.Parent;
import com.futureschool.backend.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parents")
@Tag(name = "Parents", description = "Endpoints for managing parent accounts and multi-child relationships")
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    @GetMapping
    @Operation(summary = "Get all parents")
    public ResponseEntity<List<Parent>> getAllParents() {
        return ResponseEntity.ok(parentService.getAllParents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get parent by ID or Login ID (e.g. PAR0001)")
    public ResponseEntity<?> getParentById(@PathVariable String id) {
        return parentService.getParentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create parent (auto-creates parent login account with password123)")
    public ResponseEntity<?> createParent(
            @RequestBody Parent parent,
            @RequestParam(required = false, defaultValue = "password123") String initialPassword
    ) {
        try {
            return ResponseEntity.ok(parentService.createParent(parent, initialPassword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update parent details")
    public ResponseEntity<?> updateParent(@PathVariable String id, @RequestBody Parent updated) {
        try {
            return ResponseEntity.ok(parentService.updateParent(id, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{parentLoginId}/link-student/{studentId}")
    @Operation(summary = "Link a student/ward to this parent for multi-child support")
    public ResponseEntity<?> linkStudentToParent(@PathVariable String parentLoginId, @PathVariable String studentId) {
        try {
            parentService.linkStudentToParent(parentLoginId, studentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Student " + studentId + " linked to Parent " + parentLoginId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete parent and their login account")
    public ResponseEntity<?> deleteParent(@PathVariable String id) {
        try {
            parentService.deleteParent(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Parent deleted: " + id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
