package com.futureschool.platform.school.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "schools")
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "school_id", updatable = false, nullable = false)
    private UUID schoolId;

    @NotBlank
    @Column(name = "school_code", unique = true, nullable = false, length = 32)
    private String schoolCode;

    @NotBlank
    @Column(name = "school_name", nullable = false)
    private String schoolName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private SchoolStatus status = SchoolStatus.SETUP;

    @Column(name = "branding_logo_url", length = 512)
    private String brandingLogoUrl;

    @Column(name = "branding_primary_color", length = 16)
    private String brandingPrimaryColor = "#1e3a8a";

    @Column(name = "timezone", nullable = false, length = 64)
    private String timezone = "Asia/Kolkata";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public School() {
    }

    public School(String schoolCode, String schoolName, SchoolStatus status) {
        this.schoolCode = schoolCode;
        this.schoolName = schoolName;
        this.status = status;
    }

    public UUID getSchoolId() {
        return schoolId;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public SchoolStatus getStatus() {
        return status;
    }

    public void setStatus(SchoolStatus status) {
        this.status = status;
    }

    public String getBrandingLogoUrl() {
        return brandingLogoUrl;
    }

    public void setBrandingLogoUrl(String brandingLogoUrl) {
        this.brandingLogoUrl = brandingLogoUrl;
    }

    public String getBrandingPrimaryColor() {
        return brandingPrimaryColor;
    }

    public void setBrandingPrimaryColor(String brandingPrimaryColor) {
        this.brandingPrimaryColor = brandingPrimaryColor;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
