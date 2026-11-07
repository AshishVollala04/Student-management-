package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "marks_records", indexes = {
    @Index(name = "idx_marks_class_exam", columnList = "class_id, exam, subject"),
    @Index(name = "idx_marks_student", columnList = "student_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarksRecord {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "subject", nullable = false, length = 64)
    private String subject;

    @Column(name = "exam", nullable = false, length = 64)
    private String exam; // e.g. "Term 1", "Mid Term", "Final Exam"

    @Column(name = "maximum_marks", nullable = false)
    @Builder.Default
    private Double maximumMarks = 100.0;

    @Column(name = "score", nullable = false)
    private Double score;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "grade", length = 8)
    private String grade; // A+, A, B+, B, C, D, F

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "Draft"; // Draft, Submitted, Verified, Published

    @Column(name = "entered_by_teacher_id", length = 64)
    private String enteredByTeacherId;

    @Column(name = "verified_by_user_id", length = 64)
    private String verifiedByUserId;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
