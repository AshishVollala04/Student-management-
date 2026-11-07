package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "subject_allocations", indexes = {
    @Index(name = "idx_alloc_class", columnList = "class_id"),
    @Index(name = "idx_alloc_teacher", columnList = "teacher_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectAllocation {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "academic_year_id", length = 32)
    @Builder.Default
    private String academicYearId = "ay-2026-27";

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "subject", nullable = false, length = 64)
    private String subject;

    @Column(name = "teacher_id", nullable = false, length = 64)
    private String teacherId;

    @Column(name = "teacher_name", length = 128)
    private String teacherName;

    @Column(name = "role", length = 32)
    @Builder.Default
    private String role = "Teacher"; // Teacher, Class Teacher, Principal, HOD

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
