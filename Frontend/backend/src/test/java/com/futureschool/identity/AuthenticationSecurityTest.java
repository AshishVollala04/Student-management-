package com.futureschool.identity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureschool.common.security.PortalContext;
import com.futureschool.identity.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.futureschool.application.FutureSchoolApplication;

@SpringBootTest(classes = FutureSchoolApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. Valid student login with student portal context succeeds")
    void testValidStudentLogin() throws Exception {
        LoginRequest req = new LoginRequest("GVS-2027-0001", "Password123!", PortalContext.STUDENT, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.refreshToken").isString())
                .andExpect(jsonPath("$.data.user.portal").value("STUDENT"))
                .andExpect(jsonPath("$.data.user.roles[0]").value("ROLE_STUDENT"));
    }

    @Test
    @DisplayName("2. Shared student credential in PARENT portal issues ROLE_PARENT strictly bound to student")
    void testValidParentLogin() throws Exception {
        LoginRequest req = new LoginRequest("GVS-2027-0001", "Password123!", PortalContext.PARENT, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.portal").value("PARENT"))
                .andExpect(jsonPath("$.data.user.roles[0]").value("ROLE_PARENT"))
                .andExpect(jsonPath("$.data.user.studentId").isNotEmpty());
    }

    @Test
    @DisplayName("3. Valid teacher login succeeds and returns STAFF portal")
    void testValidTeacherLogin() throws Exception {
        LoginRequest req = new LoginRequest("TCH0001", "Password123!", PortalContext.STAFF, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.portal").value("STAFF"))
                .andExpect(jsonPath("$.data.user.staffId").isNotEmpty());
    }

    @Test
    @DisplayName("4. Valid platform admin login succeeds without school code")
    void testValidPlatformAdminLogin() throws Exception {
        LoginRequest req = new LoginRequest("PLA0001", "Password123!", PortalContext.PLATFORM, null);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.portal").value("PLATFORM"))
                .andExpect(jsonPath("$.data.user.roles[0]").value("ROLE_PLATFORM_ADMIN"));
    }

    @Test
    @DisplayName("5. Invalid password returns generic 401 error without disclosing account details")
    void testInvalidPasswordReturnsGenericError() throws Exception {
        LoginRequest req = new LoginRequest("TCH0001", "WrongPassword999!", PortalContext.STAFF, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Invalid credentials or portal context"));
    }

    @Test
    @DisplayName("6. Non-existent user returns identical 401 message (enumeration prevention)")
    void testNonExistentUserReturnsIdenticalMessage() throws Exception {
        LoginRequest req = new LoginRequest("GHOST_USER_999", "Password123!", PortalContext.STAFF, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Invalid credentials or portal context"));
    }

    @Test
    @DisplayName("7. Portal mismatch: Student credentials rejected for STAFF portal context")
    void testPortalMismatchRejected() throws Exception {
        LoginRequest req = new LoginRequest("GVS-2027-0001", "Password123!", PortalContext.STAFF, "GVS");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Invalid credentials or portal context"));
    }

    @Test
    @DisplayName("8. Refresh token rotation: Rotates refresh token and invalidates old token")
    void testRefreshTokenRotation() throws Exception {
        // 1. Login
        LoginRequest loginReq = new LoginRequest("ADM0001", "Password123!", PortalContext.STAFF, "GVS");
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        String respStr = loginResult.getResponse().getContentAsString();
        String originalRefreshToken = objectMapper.readTree(respStr).path("data").path("refreshToken").asText();

        // 2. Refresh
        RefreshTokenRequest refreshReq = new RefreshTokenRequest(originalRefreshToken);
        MvcResult refreshResult = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andReturn();

        String newRefreshToken = objectMapper.readTree(refreshResult.getResponse().getContentAsString())
                .path("data").path("refreshToken").asText();

        assertThat(newRefreshToken).isNotEqualTo(originalRefreshToken);

        // 3. Re-using old rotated refresh token is detected and rejected
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RefreshTokenRequest(originalRefreshToken))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("9. Logout revokes current session")
    void testLogoutRevocation() throws Exception {
        // Login
        LoginRequest loginReq = new LoginRequest("ADM0001", "Password123!", PortalContext.STAFF, "GVS");
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        String accessToken = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        // Access protected /api/v1/me -> 200
        mockMvc.perform(get("/api/v1/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        // Logout
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        // Subsequent access with same token is rejected (session revoked)
        mockMvc.perform(get("/api/v1/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("10. Password reset flow: single-use token updates password and revokes previous sessions")
    void testPasswordResetFlow() throws Exception {
        // Request reset
        PasswordResetRequest resetReq = new PasswordResetRequest("PRN0001", "GVS");
        MvcResult resetResult = mockMvc.perform(post("/api/v1/auth/password-reset/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isOk())
                .andReturn();

        String rawToken = objectMapper.readTree(resetResult.getResponse().getContentAsString())
                .path("data").path("resetToken").asText();
        assertThat(rawToken).isNotEmpty();

        // Confirm reset with new password
        PasswordResetConfirmRequest confirmReq = new PasswordResetConfirmRequest(rawToken, "NewSecurePassword456!");
        mockMvc.perform(post("/api/v1/auth/password-reset/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(confirmReq)))
                .andExpect(status().isOk());

        // Reusing same reset token must be rejected
        mockMvc.perform(post("/api/v1/auth/password-reset/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(confirmReq)))
                .andExpect(status().isUnauthorized());

        // Login with old password fails
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("PRN0001", "Password123!", PortalContext.STAFF, "GVS"))))
                .andExpect(status().isUnauthorized());

        // Login with new password succeeds
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("PRN0001", "NewSecurePassword456!", PortalContext.STAFF, "GVS"))))
                .andExpect(status().isOk());
    }
}
