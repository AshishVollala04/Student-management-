package com.futureschool.backend.controller;

import com.futureschool.backend.entity.MarksRecord;
import com.futureschool.backend.service.MarksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@Tag(name = "Marks & Academics", description = "Endpoints for exam marks entry, verification, and student grade reports")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping("/entry")
    @Operation(summary = "Enter or update exam marks for students")
    public ResponseEntity<?> enterMarks(@RequestBody List<MarksRecord> records) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String teacherId = (auth != null) ? auth.getName() : "System";
            List<MarksRecord> saved = marksService.enterMarks(records, teacherId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Marks recorded for " + saved.size() + " students",
                    "records", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get marks for a class (optional filter by exam & subject)")
    public ResponseEntity<List<MarksRecord>> getClassMarks(
            @PathVariable String classId,
            @RequestParam(required = false) String exam,
            @RequestParam(required = false) String subject
    ) {
        return ResponseEntity.ok(marksService.getClassMarks(classId, exam, subject));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get report card / marks for a student (optional filter by exam)")
    public ResponseEntity<List<MarksRecord>> getStudentMarks(
            @PathVariable String studentId,
            @RequestParam(required = false) String exam
    ) {
        return ResponseEntity.ok(marksService.getStudentMarks(studentId, exam));
    }

    @PutMapping("/{id}/verify")
    @Operation(summary = "Verify an entered mark record (Principal / HOD)")
    public ResponseEntity<?> verifyMarks(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = (auth != null) ? auth.getName() : "Principal";
            return ResponseEntity.ok(marksService.verifyMarks(id, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/publish")
    @Operation(summary = "Publish verified marks to parents and students")
    public ResponseEntity<?> publishMarks(@RequestBody List<String> ids) {
        try {
            return ResponseEntity.ok(marksService.publishMarks(ids));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
