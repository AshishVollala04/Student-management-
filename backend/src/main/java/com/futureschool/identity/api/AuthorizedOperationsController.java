package com.futureschool.identity.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.security.FeatureEntitlementService;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.common.security.MfaService;
import com.futureschool.common.security.RelationshipAuthorizationService;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AuthorizedOperationsController {

    private final RelationshipAuthorizationService relationshipAuthService;
    private final FeatureEntitlementService featureEntitlementService;
    private final MfaService mfaService;
    private final UserRepository userRepository;

    public AuthorizedOperationsController(
            RelationshipAuthorizationService relationshipAuthService,
            FeatureEntitlementService featureEntitlementService,
            MfaService mfaService,
            UserRepository userRepository) {
        this.relationshipAuthService = relationshipAuthService;
        this.featureEntitlementService = featureEntitlementService;
        this.mfaService = mfaService;
        this.userRepository = userRepository;
    }

    @GetMapping("/student/me")
    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOwnStudentProfile(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "studentId", principal.getStudentId() != null ? principal.getStudentId().toString() : "UNBOUND",
                "loginId", principal.getLoginId(),
                "portal", principal.getPortal().name()
        ), "Student profile retrieved"));
    }

    @GetMapping("/student/{studentId}/grades")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentGrades(
            @PathVariable UUID studentId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (!relationshipAuthService.canAccessStudent(principal, studentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("FORBIDDEN", "Access denied: Unauthorized relationship or cross-tenant access"));
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "studentId", studentId.toString(),
                "status", "AUTHORIZED_ACCESS"
        ), "Student grades retrieved"));
    }

    public record MarksEntryRequest(
            UUID schoolId,
            UUID classId,
            UUID sectionId,
            UUID subjectId,
            boolean windowOpen
    ) {}

    @PostMapping("/academic/marks/entry")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enterMarks(
            @RequestBody MarksEntryRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        boolean allowed = relationshipAuthService.canEnterMarks(
                principal,
                request.schoolId(),
                request.classId(),
                request.sectionId(),
                request.subjectId(),
                request.windowOpen()
        );

        if (!allowed) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("FORBIDDEN", "Access denied: Window locked, unassigned subject, or missing allocation"));
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "status", "MARKS_ACCEPTED",
                "subjectId", request.subjectId().toString()
        ), "Marks entered successfully"));
    }

    @GetMapping("/admin/me/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminPermissions(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "adminId", principal.getLoginId(),
                "schoolId", principal.getSchoolId().toString()
        ), "Admin permissions verified"));
    }

    @GetMapping("/platform/schools/summary")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformSummary(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "platformAdmin", principal.getLoginId(),
                "systemStatus", "HEALTHY"
        ), "Platform summary retrieved"));
    }

    @PostMapping("/billing/record-offline-payment")
    @PreAuthorize("hasAuthority('PERM_RECORD_OFFLINE_PAYMENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recordOfflinePayment(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "paymentId", UUID.randomUUID().toString(),
                "status", "RECORDED"
        ), "Offline payment recorded"));
    }

    @PostMapping("/admin/staff/reset-credential")
    @PreAuthorize("hasAuthority('PERM_RESET_STAFF_CREDENTIAL')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetStaffCredential(
            @RequestHeader(value = "X-Step-Up-Token", required = false) String stepUpToken,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (stepUpToken == null || stepUpToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("STEP_UP_REQUIRED", "Step-up authentication token is required for sensitive staff credential reset"));
        }

        User user = userRepository.findById(principal.getUserId()).orElseThrow();
        boolean validStepUp = mfaService.consumeStepUpToken(user, stepUpToken, "STAFF_CREDENTIAL_RESET");

        if (!validStepUp) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("STEP_UP_INVALID", "Invalid or expired step-up authentication token"));
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "action", "STAFF_CREDENTIAL_RESET",
                "status", "COMPLETED"
        ), "Staff credential reset completed successfully"));
    }

    @GetMapping("/academic/ai-insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiInsights(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (principal.getSchoolId() == null || !featureEntitlementService.isFeatureEntitled(principal.getSchoolId(), "ai")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("FEATURE_NOT_ENTITLED", "AI features are not enabled for this school"));
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "feature", "ai",
                "insights", "STUDENT_RETENTION_HIGH"
        ), "AI insights retrieved"));
    }
}
