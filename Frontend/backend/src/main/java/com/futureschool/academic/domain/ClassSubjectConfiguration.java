package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "class_subject_configurations")
public class ClassSubjectConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "config_id", updatable = false, nullable = false)
    private UUID configId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "is_required", nullable = false)
    private boolean isRequired = true;

    @Column(name = "weekly_periods_override")
    private Integer weeklyPeriodsOverride;

    @Column(name = "is_assessment_enabled", nullable = false)
    private boolean isAssessmentEnabled = true;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ClassSubjectConfiguration() {
    }

    public ClassSubjectConfiguration(School school,
                                     AcademicYear academicYear,
                                     SchoolClass schoolClass,
                                     Subject subject,
                                     boolean isRequired,
                                     Integer weeklyPeriodsOverride,
                                     boolean isAssessmentEnabled) {
        this.school = school;
        this.academicYear = academicYear;
        this.schoolClass = schoolClass;
        this.subject = subject;
        this.isRequired = isRequired;
        this.weeklyPeriodsOverride = weeklyPeriodsOverride;
        this.isAssessmentEnabled = isAssessmentEnabled;
    }

    public UUID getConfigId() {
        return configId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public SchoolClass getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(SchoolClass schoolClass) {
        this.schoolClass = schoolClass;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public boolean isRequired() {
        return isRequired;
    }

    public void setRequired(boolean required) {
        isRequired = required;
    }

    public Integer getWeeklyPeriodsOverride() {
        return weeklyPeriodsOverride;
    }

    public void setWeeklyPeriodsOverride(Integer weeklyPeriodsOverride) {
        this.weeklyPeriodsOverride = weeklyPeriodsOverride;
    }

    public boolean isAssessmentEnabled() {
        return isAssessmentEnabled;
    }

    public void setAssessmentEnabled(boolean assessmentEnabled) {
        isAssessmentEnabled = assessmentEnabled;
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
