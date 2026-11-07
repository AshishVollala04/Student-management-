package com.futureschool.identity.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "school_feature_entitlements")
public class SchoolFeatureEntitlement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "entitlement_id", updatable = false, nullable = false)
    private UUID entitlementId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotBlank
    @Column(name = "feature_code", nullable = false, length = 64)
    private String featureCode; // e.g. 'ai', 'fleet_transport', 'advanced_reports'

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public SchoolFeatureEntitlement() {
    }

    public SchoolFeatureEntitlement(School school, String featureCode, boolean isEnabled) {
        this.school = school;
        this.featureCode = featureCode;
        this.isEnabled = isEnabled;
    }

    public UUID getEntitlementId() {
        return entitlementId;
    }

    public School getSchool() {
        return school;
    }

    public String getFeatureCode() {
        return featureCode;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
