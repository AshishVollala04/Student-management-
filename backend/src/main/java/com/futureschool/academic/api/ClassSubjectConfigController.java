package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.ClassSubjectConfigService;
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
public class ClassSubjectConfigController {

    private final ClassSubjectConfigService configService;

    public ClassSubjectConfigController(ClassSubjectConfigService configService) {
        this.configService = configService;
    }

    @PostMapping("/class-subjects")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.ClassSubjectConfigResponse>> configureSubject(
            @Valid @RequestBody AcademicDtos.CreateClassSubjectConfigRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.ClassSubjectConfigResponse response = configService.configureSubject(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Class-Subject configured successfully"));
    }

    @PutMapping("/class-subjects/{configId}")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.ClassSubjectConfigResponse>> updateConfiguration(
            @PathVariable UUID configId,
            @Valid @RequestBody AcademicDtos.UpdateClassSubjectConfigRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.ClassSubjectConfigResponse response = configService.updateConfiguration(
                principal.getSchoolId(), configId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Class-Subject configuration updated successfully"));
    }

    @GetMapping("/years/{yearId}/classes/{classId}/subjects")
    public ResponseEntity<ApiResponse<List<AcademicDtos.ClassSubjectConfigResponse>>> listConfigurations(
            @PathVariable UUID yearId,
            @PathVariable UUID classId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        List<AcademicDtos.ClassSubjectConfigResponse> list = configService.listConfigurations(principal.getSchoolId(), yearId, classId);
        return ResponseEntity.ok(ApiResponse.success(list, "Class-Subject configurations retrieved successfully"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
