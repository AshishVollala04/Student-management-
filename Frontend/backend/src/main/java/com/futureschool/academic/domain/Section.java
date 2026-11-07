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
@Table(name = "sections")
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "section_id", updatable = false, nullable = false)
    private UUID sectionId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @NotBlank
    @Column(name = "name", nullable = false, length = 32)
    private String name; // e.g. "A"

    @Min(1)
    @Column(name = "normal_capacity", nullable = false)
    private int normalCapacity = 35;

    @Min(1)
    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity = 40;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "ACTIVE";

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Section() {
    }

    public Section(School school, SchoolClass schoolClass, String name, int maxCapacity) {
        this.school = school;
        this.schoolClass = schoolClass;
        this.name = name;
        this.normalCapacity = Math.min(35, maxCapacity);
        this.maxCapacity = maxCapacity;
    }

    public Section(School school, SchoolClass schoolClass, String name, int normalCapacity, int maxCapacity) {
        if (normalCapacity > maxCapacity) {
            throw new IllegalArgumentException("Normal capacity cannot exceed maximum capacity");
        }
        this.school = school;
        this.schoolClass = schoolClass;
        this.name = name;
        this.normalCapacity = normalCapacity;
        this.maxCapacity = maxCapacity;
    }

    public UUID getSectionId() {
        return sectionId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public SchoolClass getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(SchoolClass schoolClass) {
        this.schoolClass = schoolClass;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNormalCapacity() {
        return normalCapacity;
    }

    public void setNormalCapacity(int normalCapacity) {
        if (normalCapacity > this.maxCapacity) {
            throw new IllegalArgumentException("Normal capacity cannot exceed maximum capacity");
        }
        this.normalCapacity = normalCapacity;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        if (this.normalCapacity > maxCapacity) {
            throw new IllegalArgumentException("Normal capacity cannot exceed maximum capacity");
        }
        this.maxCapacity = maxCapacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
