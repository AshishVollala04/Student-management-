package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", indexes = {
    @Index(name = "idx_att_class_date", columnList = "class_id, attendance_date"),
    @Index(name = "idx_att_student", columnList = "student_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecord {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "roll", length = 16)
    private String roll;

    @Column(name = "status", nullable = false, length = 16)
    @Builder.Default
    private String status = "Present"; // Present, Absent, Late, Excused

    @Column(name = "remarks", length = 255)
    private String remarks;

    @Column(name = "recorded_by", length = 64)
    private String recordedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
