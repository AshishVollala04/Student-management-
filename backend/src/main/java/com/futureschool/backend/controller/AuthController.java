package com.futureschool.backend.controller;

import com.futureschool.backend.dto.AccountDTO;
import com.futureschool.backend.dto.LoginRequest;
import com.futureschool.backend.dto.LoginResponse;
import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication & Users", description = "Endpoints for login, current profile, and user account management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", e.getMessage() != null ? e.getMessage() : "Invalid credentials"
            ));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String loginId = authentication.getName();
        AccountDTO userDTO = authService.getCurrentUser(loginId);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/users")
    @Operation(summary = "List all user accounts (optional filter by role: ADMIN, PRINCIPAL, TEACHER, PARENT, STUDENT)")
    public ResponseEntity<List<AccountDTO>> getAllUsers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(authService.getAllUsers(role));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> body) {
        try {
            UserAccount account = new UserAccount();
            account.setLoginId((String) body.get("loginId"));
            account.setName((String) body.get("name"));
            account.setEmail((String) body.get("email"));
            String roleStr = (String) body.get("role");
            account.setRole(com.futureschool.backend.entity.UserRole.valueOf(roleStr.toUpperCase()));
            account.setStudentId((String) body.get("studentId"));
            account.setTeacherId((String) body.get("teacherId"));
            String password = (String) body.get("password");

            AccountDTO saved = authService.registerUser(account, password);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change password for the current user")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String loginId = authentication.getName();
            String oldPwd = body.get("oldPassword");
            String newPwd = body.get("newPassword");

            authService.changePassword(loginId, oldPwd, newPwd);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{loginId}")
    @Operation(summary = "Delete user account by loginId")
    public ResponseEntity<?> deleteUser(@PathVariable String loginId) {
        try {
            authService.deleteUser(loginId);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted: " + loginId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{loginId}/toggle-status")
    @Operation(summary = "Toggle user active / inactive status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String loginId) {
        try {
            AccountDTO updated = authService.toggleUserStatus(loginId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/users/{loginId}/reset-password")
    @Operation(summary = "Admin reset password for a user account")
    public ResponseEntity<?> resetPassword(
            @PathVariable String loginId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        try {
            String customPwd = body != null ? body.get("newPassword") : null;
            String tempPassword = authService.adminResetPassword(loginId, customPwd);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "loginId", loginId,
                    "temporaryPassword", tempPassword,
                    "message", "Password successfully reset to: " + tempPassword
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
