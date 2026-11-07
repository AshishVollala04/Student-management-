package com.futureschool.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long accessTokenExpirationSeconds;
    private final String issuer;

    public JwtTokenService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.access-token-expiration-seconds:900}") long accessTokenExpirationSeconds,
            @Value("${app.security.jwt.issuer:futureschool-auth}") String issuer) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.issuer = issuer;
    }

    public String generateAccessToken(FutureSchoolPrincipal principal) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(accessTokenExpirationSeconds);

        List<String> authorities = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        var builder = Jwts.builder()
                .issuer(issuer)
                .subject(principal.getUserId().toString())
                .claim("loginId", principal.getLoginId())
                .claim("displayName", principal.getDisplayName())
                .claim("portal", principal.getPortal().name())
                .claim("sessionId", principal.getSessionId().toString())
                .claim("authorities", authorities)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry));

        if (principal.getSchoolId() != null) {
            builder.claim("schoolId", principal.getSchoolId().toString());
        }
        if (principal.getSchoolCode() != null) {
            builder.claim("schoolCode", principal.getSchoolCode());
        }
        if (principal.getStudentId() != null) {
            builder.claim("studentId", principal.getStudentId().toString());
        }
        if (principal.getStaffId() != null) {
            builder.claim("staffId", principal.getStaffId().toString());
        }

        return builder.signWith(signingKey).compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public FutureSchoolPrincipal parseToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        UUID userId = UUID.fromString(claims.getSubject());
        String loginId = claims.get("loginId", String.class);
        String displayName = claims.get("displayName", String.class);
        String portalStr = claims.get("portal", String.class);
        PortalContext portal = PortalContext.valueOf(portalStr);
        String sessionIdStr = claims.get("sessionId", String.class);
        UUID sessionId = sessionIdStr != null ? UUID.fromString(sessionIdStr) : null;

        String schoolIdStr = claims.get("schoolId", String.class);
        UUID schoolId = schoolIdStr != null ? UUID.fromString(schoolIdStr) : null;
        String schoolCode = claims.get("schoolCode", String.class);

        String studentIdStr = claims.get("studentId", String.class);
        UUID studentId = studentIdStr != null ? UUID.fromString(studentIdStr) : null;

        String staffIdStr = claims.get("staffId", String.class);
        UUID staffId = staffIdStr != null ? UUID.fromString(staffIdStr) : null;

        List<String> authorityStrings = claims.get("authorities", List.class);
        Set<GrantedAuthority> authorities = authorityStrings != null
                ? authorityStrings.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet())
                : Set.of();

        return new FutureSchoolPrincipal(
                userId,
                schoolId,
                schoolCode,
                loginId,
                displayName,
                portal,
                studentId,
                staffId,
                sessionId,
                authorities,
                true,
                true
        );
    }

    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationSeconds;
    }
}
