package com.futureschool.backend.controller;

import com.futureschool.backend.entity.Teacher;
import com.futureschool.backend.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
@Tag(name = "Teachers & Faculty", description = "Endpoints for managing teachers and faculty profiles")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    @Operation(summary = "Get all teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get teacher by ID or TeacherId (e.g. TCH0001)")
    public ResponseEntity<?> getTeacherById(@PathVariable String id) {
        return teacherService.getTeacherById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create teacher (auto-creates teacher login account with password123)")
    public ResponseEntity<?> createTeacher(
            @RequestBody Teacher teacher,
            @RequestParam(required = false, defaultValue = "password123") String initialPassword
    ) {
        try {
            return ResponseEntity.ok(teacherService.createTeacher(teacher, initialPassword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update teacher details")
    public ResponseEntity<?> updateTeacher(@PathVariable String id, @RequestBody Teacher updated) {
        try {
            return ResponseEntity.ok(teacherService.updateTeacher(id, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete teacher and their login account")
    public ResponseEntity<?> deleteTeacher(@PathVariable String id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Teacher deleted: " + id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
