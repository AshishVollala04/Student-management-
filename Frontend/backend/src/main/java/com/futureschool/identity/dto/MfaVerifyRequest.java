package com.futureschool.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record MfaVerifyRequest(
        @NotBlank(message = "MFA session token is required")
        String mfaSessionToken,

        @NotBlank(message = "Verification code is required")
        String code
) {}
