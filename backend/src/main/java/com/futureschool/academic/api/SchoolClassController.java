package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.SchoolClassService;
import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic/classes")
public class SchoolClassController {

    private final SchoolClassService schoolClassService;

    public SchoolClassController(SchoolClassService schoolClassService) {
        this.schoolClassService = schoolClassService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolClassResponse>> createClass(
            @Valid @RequestBody AcademicDtos.CreateClassRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolClassResponse response = schoolClassService.createClass(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Class created successfully"));
    }

    @PutMapping("/{classId}")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolClassResponse>> updateClass(
            @PathVariable UUID classId,
            @Valid @RequestBody AcademicDtos.UpdateClassRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolClassResponse response = schoolClassService.updateClass(
                principal.getSchoolId(), classId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Class updated successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicDtos.SchoolClassResponse>>> listClasses(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<AcademicDtos.SchoolClassResponse> classes = schoolClassService.listClasses(principal.getSchoolId());
        return ResponseEntity.ok(ApiResponse.success(classes, "Classes retrieved successfully"));
    }

    @GetMapping("/{classId}")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolClassResponse>> getClass(
            @PathVariable UUID classId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolClassResponse response = schoolClassService.getClass(principal.getSchoolId(), classId);
        return ResponseEntity.ok(ApiResponse.success(response, "Class retrieved successfully"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
