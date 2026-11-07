package com.futureschool.identity.dto;

import com.futureschool.common.security.PortalContext;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotBlank(message = "Login ID is required")
        String loginId,

        @NotBlank(message = "Password is required")
        String password,

        @NotNull(message = "Portal context is required")
        PortalContext portal,

        String schoolCode
) {}
