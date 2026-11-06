package com.futureschool.identity.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.common.security.SessionService;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import com.futureschool.identity.dto.*;
import com.futureschool.identity.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authService;
    private final SessionService sessionService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationService authService,
                          SessionService sessionService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");

        LoginResponse response = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response, "Authentication successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");

        LoginResponse response = authService.refresh(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refresh successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        if (principal != null && principal.getSessionId() != null) {
            userRepository.findById(principal.getUserId()).ifPresent(user ->
                    sessionService.revokeSession(principal.getSessionId(), user));
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Session successfully revoked"));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {
        String resetToken = authService.requestPasswordReset(request);
        // In local/test mode, return token so tests can verify flow; in prod email is dispatched
        Map<String, String> data = resetToken != null
                ? Map.of("message", "Password reset instructions dispatched", "resetToken", resetToken)
                : Map.of("message", "Password reset instructions dispatched");
        return ResponseEntity.ok(ApiResponse.success(data, "Password reset instructions processed"));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirmRequest request) {
        authService.confirmPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password successfully updated"));
    }
}
