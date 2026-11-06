package com.futureschool.identity.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "step_up_tokens")
public class StepUpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "step_up_id", updatable = false, nullable = false)
    private UUID stepUpId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @NotBlank
    @Column(name = "purpose", nullable = false, length = 64)
    private String purpose;

    @Column(name = "is_used", nullable = false)
    private boolean isUsed = false;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public StepUpToken() {
    }

    public StepUpToken(User user, String tokenHash, String purpose, Instant expiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.purpose = purpose;
        this.expiresAt = expiresAt;
    }

    public UUID getStepUpId() {
        return stepUpId;
    }

    public User getUser() {
        return user;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public String getPurpose() {
        return purpose;
    }

    public boolean isUsed() {
        return isUsed;
    }

    public void setUsed(boolean used) {
        isUsed = used;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
