package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "parent_teacher_meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @Column(name = "meeting_time", nullable = false, length = 16)
    private String meetingTime; // e.g. "10:30 AM"

    @Column(name = "teacher_id", nullable = false, length = 64)
    private String teacherId;

    @Column(name = "teacher_name", length = 128)
    private String teacherName;

    @Column(name = "parent_id", nullable = false, length = 64)
    private String parentId;

    @Column(name = "parent_name", length = 128)
    private String parentName;

    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(name = "student_name", length = 128)
    private String studentName;

    @Column(name = "mode", length = 32)
    @Builder.Default
    private String mode = "IN_PERSON"; // IN_PERSON, ONLINE

    @Column(name = "meeting_link", length = 255)
    private String meetingLink;

    @Column(name = "status", length = 32)
    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED

    @Column(name = "agenda", columnDefinition = "TEXT")
    private String agenda;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
