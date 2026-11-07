package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "subject", nullable = false, length = 64)
    private String subject;

    @Column(name = "duration_minutes", nullable = false)
    @Builder.Default
    private int durationMinutes = 30;

    @Column(name = "total_marks", nullable = false)
    @Builder.Default
    private int totalMarks = 20;

    @Column(name = "questions_data", columnDefinition = "TEXT")
    private String questionsData; // JSON array of questions with options and answers

    @Column(name = "created_by", length = 128)
    private String createdBy;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
