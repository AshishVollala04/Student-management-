package com.futureschool.backend.controller;

import com.futureschool.backend.entity.AttendanceRecord;
import com.futureschool.backend.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@Tag(name = "Attendance", description = "Endpoints for daily student attendance marking and reports")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark")
    @Operation(summary = "Mark daily attendance for a class")
    public ResponseEntity<?> markAttendance(
            @RequestParam String classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody List<AttendanceRecord> records
    ) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String recordedBy = (auth != null) ? auth.getName() : "System";
            List<AttendanceRecord> saved = attendanceService.markAttendance(classId, date, records, recordedBy);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Attendance saved for " + saved.size() + " students",
                    "records", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get attendance for a class on a specific date (default today)")
    public ResponseEntity<List<AttendanceRecord>> getClassAttendance(
            @PathVariable String classId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(attendanceService.getClassAttendance(classId, queryDate));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get complete attendance history for a student")
    public ResponseEntity<List<AttendanceRecord>> getStudentAttendanceHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceHistory(studentId));
    }

    @GetMapping("/summary/{studentId}")
    @Operation(summary = "Get attendance metrics and percentage for a student")
    public ResponseEntity<?> getStudentAttendanceSummary(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceSummary(studentId));
    }
}
