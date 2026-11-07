package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "calendar_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "event_type", nullable = false, length = 32)
    @Builder.Default
    private String eventType = "ACADEMIC"; // HOLIDAY, EXAM, MEETING, SPORTS, CULTURAL, ACADEMIC

    @Column(name = "audience", length = 32)
    @Builder.Default
    private String audience = "ALL"; // ALL, STUDENTS, TEACHERS, PARENTS
}
