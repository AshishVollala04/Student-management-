package com.futureschool.identity.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "session_id", updatable = false, nullable = false)
    private UUID sessionId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @NotBlank
    @Column(name = "refresh_token_hash", nullable = false, unique = true, length = 64)
    private String refreshTokenHash;

    @Column(name = "portal_context", length = 32)
    private String portalContext = "DEFAULT";

    @Column(name = "device_info")
    private String deviceInfo;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "is_revoked", nullable = false)
    private boolean isRevoked = false;

    @Column(name = "revoked_reason", length = 128)
    private String revokedReason;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "last_used_at", nullable = false)
    private Instant lastUsedAt = Instant.now();

    public UserSession() {
    }

    public UserSession(User user, School school, String refreshTokenHash, String portalContext, String deviceInfo, String ipAddress, Instant expiresAt) {
        this.user = user;
        this.school = school;
        this.refreshTokenHash = refreshTokenHash;
        this.portalContext = portalContext != null ? portalContext : "DEFAULT";
        this.deviceInfo = deviceInfo;
        this.ipAddress = ipAddress;
        this.expiresAt = expiresAt;
    }

    public UserSession(User user, String refreshTokenHash, String ipAddress, String userAgent, Instant expiresAt) {
        this.user = user;
        this.school = user != null ? user.getSchool() : null;
        this.refreshTokenHash = refreshTokenHash;
        this.portalContext = "DEFAULT";
        this.deviceInfo = userAgent;
        this.ipAddress = ipAddress;
        this.expiresAt = expiresAt;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public User getUser() {
        return user;
    }

    public School getSchool() {
        return school;
    }

    public String getRefreshTokenHash() {
        return refreshTokenHash;
    }

    public void setRefreshTokenHash(String refreshTokenHash) {
        this.refreshTokenHash = refreshTokenHash;
    }

    public String getPortalContext() {
        return portalContext;
    }

    public void setPortalContext(String portalContext) {
        this.portalContext = portalContext;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getUserAgent() {
        return deviceInfo;
    }

    public void setUserAgent(String userAgent) {
        this.deviceInfo = userAgent;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public boolean isRevoked() {
        return isRevoked;
    }

    public void setRevoked(boolean revoked) {
        isRevoked = revoked;
    }

    public String getRevokedReason() {
        return revokedReason;
    }

    public void setRevokedReason(String revokedReason) {
        this.revokedReason = revokedReason;
    }

    public Instant getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(Instant revokedAt) {
        this.revokedAt = revokedAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(Instant lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
}
