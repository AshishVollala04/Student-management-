package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.SubjectService;
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
@RequestMapping("/api/v1/academic/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SubjectResponse>> createSubject(
            @Valid @RequestBody AcademicDtos.CreateSubjectRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SubjectResponse response = subjectService.createSubject(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Subject created successfully"));
    }

    @PutMapping("/{subjectId}")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SubjectResponse>> updateSubject(
            @PathVariable UUID subjectId,
            @Valid @RequestBody AcademicDtos.UpdateSubjectRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SubjectResponse response = subjectService.updateSubject(
                principal.getSchoolId(), subjectId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Subject updated successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicDtos.SubjectResponse>>> listSubjects(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<AcademicDtos.SubjectResponse> list = subjectService.listSubjects(principal.getSchoolId());
        return ResponseEntity.ok(ApiResponse.success(list, "Subjects retrieved successfully"));
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<AcademicDtos.SubjectResponse>> getSubject(
            @PathVariable UUID subjectId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SubjectResponse response = subjectService.getSubject(principal.getSchoolId(), subjectId);
        return ResponseEntity.ok(ApiResponse.success(response, "Subject retrieved successfully"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
