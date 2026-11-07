package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.SectionService;
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
@RequestMapping("/api/v1/academic")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @PostMapping("/sections")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SectionResponse>> createSection(
            @Valid @RequestBody AcademicDtos.CreateSectionRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SectionResponse response = sectionService.createSection(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Section created successfully"));
    }

    @PutMapping("/sections/{sectionId}")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SectionResponse>> updateSection(
            @PathVariable UUID sectionId,
            @Valid @RequestBody AcademicDtos.UpdateSectionRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SectionResponse response = sectionService.updateSection(
                principal.getSchoolId(), sectionId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Section updated successfully"));
    }

    @GetMapping("/classes/{classId}/sections")
    public ResponseEntity<ApiResponse<List<AcademicDtos.SectionResponse>>> listSections(
            @PathVariable UUID classId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<AcademicDtos.SectionResponse> list = sectionService.listSectionsByClass(principal.getSchoolId(), classId);
        return ResponseEntity.ok(ApiResponse.success(list, "Sections retrieved successfully"));
    }

    @GetMapping("/sections/{sectionId}")
    public ResponseEntity<ApiResponse<AcademicDtos.SectionResponse>> getSection(
            @PathVariable UUID sectionId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SectionResponse response = sectionService.getSection(principal.getSchoolId(), sectionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Section retrieved successfully"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
