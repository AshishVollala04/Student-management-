package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "subject_id", updatable = false, nullable = false)
    private UUID subjectId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotBlank
    @Column(name = "code", nullable = false, length = 32)
    private String code; // e.g. "MATH-10"

    @NotBlank
    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "department", length = 64)
    private String department;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false, length = 32)
    private SubjectType subjectType = SubjectType.CORE;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "ACTIVE";

    @Min(1)
    @Column(name = "weekly_period_requirement", nullable = false)
    private int weeklyPeriodRequirement = 5;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Subject() {
    }

    public Subject(School school, String code, String name, String department) {
        this.school = school;
        this.code = code;
        this.name = name;
        this.department = department;
    }

    public Subject(School school, String code, String name, String department, SubjectType subjectType, int weeklyPeriodRequirement) {
        this.school = school;
        this.code = code;
        this.name = name;
        this.department = department;
        this.subjectType = subjectType != null ? subjectType : SubjectType.CORE;
        this.weeklyPeriodRequirement = weeklyPeriodRequirement > 0 ? weeklyPeriodRequirement : 5;
    }

    public UUID getSubjectId() {
        return subjectId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public SubjectType getSubjectType() {
        return subjectType;
    }

    public void setSubjectType(SubjectType subjectType) {
        this.subjectType = subjectType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getWeeklyPeriodRequirement() {
        return weeklyPeriodRequirement;
    }

    public void setWeeklyPeriodRequirement(int weeklyPeriodRequirement) {
        this.weeklyPeriodRequirement = weeklyPeriodRequirement;
    }

    public Long getVersion() {
        return version;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
