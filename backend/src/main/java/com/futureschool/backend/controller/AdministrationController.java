package com.futureschool.backend.controller;

import com.futureschool.backend.entity.*;
import com.futureschool.backend.service.AdministrationService;
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
@RequestMapping("/api/admin")
@Tag(name = "Administration & Operations", description = "Endpoints for academic years, staff attendance, promotion, certificates, and settings")
public class AdministrationController {

    private final AdministrationService administrationService;

    public AdministrationController(AdministrationService administrationService) {
        this.administrationService = administrationService;
    }

    // --- Academic Years ---
    @GetMapping("/academic-years")
    @Operation(summary = "Get all academic years")
    public ResponseEntity<List<AcademicYear>> getAcademicYears() {
        return ResponseEntity.ok(administrationService.getAllAcademicYears());
    }

    @PostMapping("/academic-years")
    @Operation(summary = "Create or update an academic year")
    public ResponseEntity<AcademicYear> saveAcademicYear(@RequestBody AcademicYear ay) {
        return ResponseEntity.ok(administrationService.saveAcademicYear(ay));
    }

    // --- Staff Attendance ---
    @GetMapping("/staff-attendance")
    @Operation(summary = "Get staff attendance for a specific date (default today)")
    public ResponseEntity<List<StaffAttendanceRecord>> getStaffAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(administrationService.getStaffAttendance(queryDate));
    }

    @PostMapping("/staff-attendance")
    @Operation(summary = "Mark daily attendance for teachers & staff")
    public ResponseEntity<?> markStaffAttendance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody List<StaffAttendanceRecord> records
    ) {
        List<StaffAttendanceRecord> saved = administrationService.markStaffAttendance(date, records);
        return ResponseEntity.ok(Map.of("success", true, "count", saved.size(), "records", saved));
    }

    // --- Student Promotion ---
    @PostMapping("/students/promote")
    @Operation(summary = "Promote a batch of students to the next class")
    public ResponseEntity<?> promoteStudents(@RequestBody Map<String, Object> body) {
        try {
            String fromClassId = (String) body.get("fromClassId");
            String toClassId = (String) body.get("toClassId");
            List<String> studentIds = (List<String>) body.get("studentIds");
            int promotedCount = administrationService.promoteStudents(fromClassId, toClassId, studentIds);
            return ResponseEntity.ok(Map.of("success", true, "message", promotedCount + " students promoted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Certificates ---
    @GetMapping("/certificates")
    @Operation(summary = "Get all issued certificates (optional filter by studentId)")
    public ResponseEntity<List<CertificateRecord>> getCertificates(@RequestParam(required = false) String studentId) {
        if (studentId != null && !studentId.isBlank()) {
            return ResponseEntity.ok(administrationService.getStudentCertificates(studentId));
        }
        return ResponseEntity.ok(administrationService.getAllCertificates());
    }

    @PostMapping("/certificates")
    @Operation(summary = "Issue a Bonafide / Transfer / Character Certificate")
    public ResponseEntity<CertificateRecord> issueCertificate(@RequestBody CertificateRecord cert) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String issuer = (auth != null) ? auth.getName() : "Principal Office";
        return ResponseEntity.ok(administrationService.issueCertificate(cert, issuer));
    }

    // --- Settings ---
    @GetMapping("/settings")
    @Operation(summary = "Get official school profile & configuration settings")
    public ResponseEntity<SchoolSetting> getSettings() {
        return ResponseEntity.ok(administrationService.getSettings());
    }

    @PutMapping("/settings")
    @Operation(summary = "Update school profile settings")
    public ResponseEntity<SchoolSetting> updateSettings(@RequestBody SchoolSetting settings) {
        return ResponseEntity.ok(administrationService.updateSettings(settings));
    }
}
