package com.futureschool.student.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.student.domain.ProfileChangeStatus;
import com.futureschool.student.dto.StudentDtos;
import com.futureschool.student.service.Student360Service;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
public class Student360Controller {

    private final Student360Service student360Service;

    public Student360Controller(Student360Service student360Service) {
        this.student360Service = student360Service;
    }

    @GetMapping("/{studentId}/360")
    public ResponseEntity<ApiResponse<StudentDtos.Student360Response>> getStudent360(
            @PathVariable UUID studentId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.Student360Response response = student360Service.getStudent360(
                principal.getSchoolId(), studentId, principal);
        return ResponseEntity.ok(ApiResponse.success(response, "Student 360 profile retrieved"));
    }

    @PostMapping("/{studentId}/profile-change-requests")
    public ResponseEntity<ApiResponse<StudentDtos.ProfileChangeRequestResponse>> submitProfileChangeRequest(
            @PathVariable UUID studentId,
            @Valid @RequestBody StudentDtos.SubmitProfileChangeRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.ProfileChangeRequestResponse response = student360Service.submitProfileChangeRequest(
                principal.getSchoolId(), studentId, request, principal);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile change request submitted"));
    }

    @GetMapping("/{studentId}/profile-change-requests")
    public ResponseEntity<ApiResponse<List<StudentDtos.ProfileChangeRequestResponse>>> listStudentChangeRequests(
            @PathVariable UUID studentId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<StudentDtos.ProfileChangeRequestResponse> response = student360Service.listStudentChangeRequests(
                principal.getSchoolId(), studentId);
        return ResponseEntity.ok(ApiResponse.success(response, "Student profile change requests retrieved"));
    }

    @PostMapping("/profile-change-requests/{requestId}/review")
    @PreAuthorize("hasRole('ROLE_PRINCIPAL') or hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.ProfileChangeRequestResponse>> reviewProfileChangeRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody StudentDtos.ReviewProfileChangeRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.ProfileChangeRequestResponse response = student360Service.reviewProfileChangeRequest(
                principal.getSchoolId(), requestId, request, principal);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile change request reviewed"));
    }

    @GetMapping("/profile-change-requests")
    @PreAuthorize("hasRole('ROLE_PRINCIPAL') or hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<List<StudentDtos.ProfileChangeRequestResponse>>> listAllChangeRequests(
            @RequestParam(required = false) ProfileChangeStatus status,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<StudentDtos.ProfileChangeRequestResponse> response = student360Service.listProfileChangeRequests(
                principal.getSchoolId(), status);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile change requests retrieved"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.badRequest("SCHOOL_CONTEXT_REQUIRED", "Tenant school context is required");
        }
    }
}
