package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "timetable_slots", indexes = {
    @Index(name = "idx_tt_class_day", columnList = "class_id, day_of_week"),
    @Index(name = "idx_tt_teacher_day", columnList = "teacher_id, day_of_week")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableSlot {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "day_of_week", nullable = false, length = 16)
    private String dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber;

    @Column(name = "start_time", nullable = false, length = 16)
    private String startTime; // e.g. "09:00 AM"

    @Column(name = "end_time", nullable = false, length = 16)
    private String endTime; // e.g. "09:45 AM"

    @Column(name = "subject", nullable = false, length = 64)
    private String subject;

    @Column(name = "teacher_id", length = 64)
    private String teacherId;

    @Column(name = "teacher_name", length = 128)
    private String teacherName;

    @Column(name = "room_number", length = 32)
    private String roomNumber;
}
