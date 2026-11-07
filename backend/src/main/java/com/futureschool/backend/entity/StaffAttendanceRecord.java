package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_attendance_records", indexes = {
    @Index(name = "idx_staff_att_date", columnList = "attendance_date"),
    @Index(name = "idx_staff_att_teacher", columnList = "teacher_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAttendanceRecord {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "teacher_id", nullable = false, length = 64)
    private String teacherId;

    @Column(name = "teacher_name", nullable = false, length = 128)
    private String teacherName;

    @Column(name = "designation", length = 64)
    private String designation;

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "Present"; // Present, Absent, Half-Day, On-Leave

    @Column(name = "check_in_time", length = 16)
    private String checkInTime;

    @Column(name = "check_out_time", length = 16)
    private String checkOutTime;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
