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
@Table(name = "school_classes")
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "class_id", updatable = false, nullable = false)
    private UUID classId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotBlank
    @Column(name = "name", nullable = false, length = 64)
    private String name; // e.g. "Class 10"

    @Column(name = "grade_level", nullable = false)
    private int gradeLevel;

    @Min(1)
    @Column(name = "normal_capacity", nullable = false)
    private int normalCapacity = 35;

    @Min(1)
    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity = 40;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

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

    public SchoolClass() {
    }

    public SchoolClass(School school, String name, int gradeLevel) {
        this.school = school;
        this.name = name;
        this.gradeLevel = gradeLevel;
    }

    public SchoolClass(School school, String name, int gradeLevel, int normalCapacity, int maxCapacity, int displayOrder) {
        if (normalCapacity > maxCapacity) {
            throw new IllegalArgumentException("Normal capacity cannot exceed maximum capacity");
        }
        this.school = school;
        this.name = name;
        this.gradeLevel = gradeLevel;
        this.normalCapacity = normalCapacity;
        this.maxCapacity = maxCapacity;
        this.displayOrder = displayOrder;
    }

    public UUID getClassId() {
        return classId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getGradeLevel() {
        return gradeLevel;
    }

    public void setGradeLevel(int gradeLevel) {
        this.gradeLevel = gradeLevel;
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

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
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
