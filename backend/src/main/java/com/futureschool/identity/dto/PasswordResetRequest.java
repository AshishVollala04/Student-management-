package com.futureschool.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetRequest(
        @NotBlank(message = "Login ID or email is required")
        String loginId,
        String schoolCode
) {}
