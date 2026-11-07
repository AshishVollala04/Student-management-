package com.futureschool.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record StepUpVerifyRequest(
        @NotBlank(message = "Verification code is required")
        String code,
        String purpose
) {}
