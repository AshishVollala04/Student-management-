package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.AcademicYearService;
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
@RequestMapping("/api/v1/academic/years")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.AcademicYearResponse>> createDraft(
            @Valid @RequestBody AcademicDtos.CreateAcademicYearRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.AcademicYearResponse response = academicYearService.createDraft(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Academic year draft created"));
    }

    @PutMapping("/{yearId}")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.AcademicYearResponse>> updateDraft(
            @PathVariable UUID yearId,
            @Valid @RequestBody AcademicDtos.UpdateAcademicYearRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.AcademicYearResponse response = academicYearService.updateDraft(
                principal.getSchoolId(), yearId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Academic year draft updated"));
    }

    @PostMapping("/{yearId}/activate")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.AcademicYearResponse>> activateAcademicYear(
            @PathVariable UUID yearId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.AcademicYearResponse response = academicYearService.activateAcademicYear(
                principal.getSchoolId(), yearId, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Academic year activated"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicDtos.AcademicYearResponse>>> listAcademicYears(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<AcademicDtos.AcademicYearResponse> list = academicYearService.listAcademicYears(principal.getSchoolId());
        return ResponseEntity.ok(ApiResponse.success(list, "Academic years retrieved"));
    }

    @GetMapping("/{yearId}")
    public ResponseEntity<ApiResponse<AcademicDtos.AcademicYearResponse>> getAcademicYear(
            @PathVariable UUID yearId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.AcademicYearResponse response = academicYearService.getAcademicYear(principal.getSchoolId(), yearId);
        return ResponseEntity.ok(ApiResponse.success(response, "Academic year retrieved"));
    }

    @GetMapping("/{yearId}/readiness")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.AcademicYearReadinessSummary>> getReadinessSummary(
            @PathVariable UUID yearId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.AcademicYearReadinessSummary summary = academicYearService.getReadinessSummary(principal.getSchoolId(), yearId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Readiness summary retrieved"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
