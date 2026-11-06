package com.futureschool.identity.dto;

import com.futureschool.common.security.PortalContext;

import java.util.List;
import java.util.UUID;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserSummary user,
        boolean mfaRequired,
        String mfaSessionToken
) {
    public record UserSummary(
            UUID userId,
            String loginId,
            String displayName,
            PortalContext portal,
            UUID schoolId,
            String schoolCode,
            UUID studentId,
            UUID staffId,
            List<String> roles,
            List<String> permissions
    ) {}

    public static LoginResponse success(String accessToken, String refreshToken, long expiresIn, UserSummary user) {
        return new LoginResponse(accessToken, refreshToken, "Bearer", expiresIn, user, false, null);
    }

    public static LoginResponse mfaChallenge(String mfaSessionToken) {
        return new LoginResponse(null, null, null, 0, null, true, mfaSessionToken);
    }
}
