package com.futureschool.identity.api;

import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.common.security.SessionService;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import com.futureschool.identity.domain.UserSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/security/sessions")
public class SecuritySessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    public SecuritySessionController(SessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActiveSessions(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        User user = userRepository.findById(principal.getUserId()).orElseThrow();
        List<UserSession> sessions = sessionService.getActiveSessions(user);

        List<Map<String, Object>> dtos = sessions.stream().map(s -> Map.<String, Object>of(
                "sessionId", s.getSessionId().toString(),
                "ipAddress", s.getIpAddress() != null ? s.getIpAddress() : "UNKNOWN",
                "userAgent", s.getUserAgent() != null ? s.getUserAgent() : "UNKNOWN",
                "createdAt", s.getCreatedAt().toString(),
                "lastUsedAt", s.getLastUsedAt().toString(),
                "isCurrent", s.getSessionId().equals(principal.getSessionId())
        )).toList();

        return ResponseEntity.ok(ApiResponse.success(dtos, "Active sessions retrieved"));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> revokeSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        User user = userRepository.findById(principal.getUserId()).orElseThrow();
        boolean revoked = sessionService.revokeSession(sessionId, user);

        if (!revoked) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", "Session not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Session revoked"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> revokeAllSessions(
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        User user = userRepository.findById(principal.getUserId()).orElseThrow();
        sessionService.revokeAllUserSessions(user);
        return ResponseEntity.ok(ApiResponse.success(null, "All sessions revoked"));
    }
}
