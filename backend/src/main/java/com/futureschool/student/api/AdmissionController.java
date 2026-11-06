package com.futureschool.student.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.student.domain.AdmissionStatus;
import com.futureschool.student.dto.StudentDtos;
import com.futureschool.student.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    @PostMapping("/drafts")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> createDraft(
            @Valid @RequestBody StudentDtos.AdmissionDraftRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.createDraft(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Admission draft created successfully"));
    }

    @PutMapping("/drafts/{applicationId}")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> updateDraft(
            @PathVariable UUID applicationId,
            @Valid @RequestBody StudentDtos.AdmissionDraftRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.updateDraft(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Admission draft updated successfully"));
    }

    @PostMapping("/{applicationId}/submit")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> submitApplication(
            @PathVariable UUID applicationId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.submitApplication(
                principal.getSchoolId(), applicationId, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Application submitted for approval"));
    }

    @PostMapping("/{applicationId}/approve")
    @PreAuthorize("hasRole('ROLE_PRINCIPAL') or hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> approveApplication(
            @PathVariable UUID applicationId,
            @RequestBody(required = false) StudentDtos.ApprovalActionRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.approveApplication(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Application approved successfully"));
    }

    @PostMapping("/{applicationId}/return")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> returnApplication(
            @PathVariable UUID applicationId,
            @Valid @RequestBody StudentDtos.ReturnActionRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.returnApplication(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Application returned for corrections"));
    }

    @PostMapping("/{applicationId}/reject")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> rejectApplication(
            @PathVariable UUID applicationId,
            @Valid @RequestBody StudentDtos.RejectionActionRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.rejectApplication(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Application rejected"));
    }

    @PostMapping("/{applicationId}/activate")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> activateApplication(
            @PathVariable UUID applicationId,
            @RequestBody(required = false) StudentDtos.ActivationRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.activateApplication(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Student admitted and enrolled successfully"));
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionApplicationResponse>> getApplication(
            @PathVariable UUID applicationId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionApplicationResponse response = admissionService.getApplication(
                principal.getSchoolId(), applicationId);
        return ResponseEntity.ok(ApiResponse.success(response, "Application details retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<List<StudentDtos.AdmissionApplicationResponse>>> listApplications(
            @RequestParam(required = false) AdmissionStatus status,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<StudentDtos.AdmissionApplicationResponse> response = admissionService.listApplications(
                principal.getSchoolId(), status);
        return ResponseEntity.ok(ApiResponse.success(response, "Applications retrieved"));
    }

    @PostMapping("/{applicationId}/documents")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionDocumentResponse>> uploadDocument(
            @PathVariable UUID applicationId,
            @Valid @RequestBody StudentDtos.DocumentUploadRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionDocumentResponse response = admissionService.uploadDocument(
                principal.getSchoolId(), applicationId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Document uploaded successfully"));
    }

    @GetMapping("/{applicationId}/documents")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<List<StudentDtos.AdmissionDocumentResponse>>> getApplicationDocuments(
            @PathVariable UUID applicationId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<StudentDtos.AdmissionDocumentResponse> response = admissionService.getApplicationDocuments(
                principal.getSchoolId(), applicationId);
        return ResponseEntity.ok(ApiResponse.success(response, "Documents retrieved"));
    }

    @PostMapping("/documents/{documentId}/verify")
    @PreAuthorize("hasAuthority('PERM_ADMISSIONS')")
    public ResponseEntity<ApiResponse<StudentDtos.AdmissionDocumentResponse>> verifyDocument(
            @PathVariable UUID documentId,
            @Valid @RequestBody StudentDtos.DocumentVerificationRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        StudentDtos.AdmissionDocumentResponse response = admissionService.verifyDocument(
                principal.getSchoolId(), documentId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Document verification status updated"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.badRequest("SCHOOL_CONTEXT_REQUIRED", "Tenant school context is required");
        }
    }
}
