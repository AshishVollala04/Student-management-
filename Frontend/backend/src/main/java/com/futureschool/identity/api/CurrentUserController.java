package com.futureschool.identity.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.security.FutureSchoolPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/me")
public class CurrentUserController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("UNAUTHORIZED", "Not authenticated"));
        }

        Map<String, Object> details = Map.of(
                "userId", principal.getUserId(),
                "loginId", principal.getLoginId(),
                "displayName", principal.getDisplayName(),
                "portal", principal.getPortal().name(),
                "schoolId", principal.getSchoolId() != null ? principal.getSchoolId().toString() : "PLATFORM",
                "schoolCode", principal.getSchoolCode() != null ? principal.getSchoolCode() : "PLATFORM",
                "studentId", principal.getStudentId() != null ? principal.getStudentId().toString() : "",
                "staffId", principal.getStaffId() != null ? principal.getStaffId().toString() : "",
                "authorities", principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList()
        );

        return ResponseEntity.ok(ApiResponse.success(details, "Current authenticated context retrieved"));
    }
}
