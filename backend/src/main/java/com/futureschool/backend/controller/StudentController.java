package com.futureschool.backend.controller;

import com.futureschool.backend.entity.Student;
import com.futureschool.backend.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Students", description = "Endpoints for student admissions, profiles, hall tickets, and exit records")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "Get all students with optional classId or search query")
    public ResponseEntity<List<Student>> getStudents(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String search
    ) {
        if (classId != null && !classId.isBlank()) {
            return ResponseEntity.ok(studentService.getStudentsByClassId(classId));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(studentService.searchStudents(search));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID (e.g. STU0001) or Admission Number")
    public ResponseEntity<?> getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get all students in a specific class / section")
    public ResponseEntity<List<Student>> getStudentsByClass(@PathVariable String classId) {
        return ResponseEntity.ok(studentService.getStudentsByClassId(classId));
    }

    @GetMapping("/parent/{parentAccountId}")
    @Operation(summary = "Get all wards / siblings belonging to a parent")
    public ResponseEntity<List<Student>> getStudentsByParent(@PathVariable String parentAccountId) {
        return ResponseEntity.ok(studentService.getStudentsByParentAccountId(parentAccountId));
    }

    @PostMapping("/by-ids")
    @Operation(summary = "Get list of students by array of student IDs")
    public ResponseEntity<List<Student>> getStudentsByIds(@RequestBody List<String> ids) {
        return ResponseEntity.ok(studentService.getStudentsByIds(ids));
    }

    @PostMapping
    @Operation(summary = "Create / admit a new student (auto-creates student login account)")
    public ResponseEntity<?> createStudent(
            @RequestBody Student student,
            @RequestParam(required = false, defaultValue = "password123") String initialPassword
    ) {
        try {
            return ResponseEntity.ok(studentService.createStudent(student, initialPassword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update student details")
    public ResponseEntity<?> updateStudent(@PathVariable String id, @RequestBody Student updated) {
        try {
            return ResponseEntity.ok(studentService.updateStudent(id, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete student and their login account")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Student deleted: " + id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/exit")
    @Operation(summary = "Record student transfer / exit record")
    public ResponseEntity<?> recordStudentExit(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String effectiveDate = body.getOrDefault("effectiveDate", java.time.LocalDate.now().toString());
            String reason = body.getOrDefault("reason", "Transferred");
            String destinationSchool = body.get("destinationSchool");
            return ResponseEntity.ok(studentService.recordExit(id, effectiveDate, reason, destinationSchool));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/hall-ticket")
    @Operation(summary = "Release or approve exam hall ticket for student")
    public ResponseEntity<?> updateHallTicket(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body
    ) {
        try {
            Boolean released = body.get("released");
            Boolean approved = body.get("approved");
            return ResponseEntity.ok(studentService.updateHallTicket(id, released, approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
