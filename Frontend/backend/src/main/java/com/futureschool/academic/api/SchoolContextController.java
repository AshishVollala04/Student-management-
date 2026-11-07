package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.SchoolContextService;
import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/school/context")
public class SchoolContextController {

    private final SchoolContextService schoolContextService;

    public SchoolContextController(SchoolContextService schoolContextService) {
        this.schoolContextService = schoolContextService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolContextResponse>> getSchoolContext(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Only authenticated school users can access school context");
        }

        AcademicDtos.SchoolContextResponse context = schoolContextService.getSchoolContext(principal.getSchoolId());
        return ResponseEntity.ok(ApiResponse.success(context, "School context retrieved successfully"));
    }
}
