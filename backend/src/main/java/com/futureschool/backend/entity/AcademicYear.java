package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "academic_years")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicYear {

    @Id
    @Column(name = "id", length = 64)
    private String id; // e.g. "AY-2025-2026", "AY-2026-2027"

    @Column(name = "name", nullable = false, length = 64)
    private String name; // "2026-2027"

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private boolean isCurrent = false;
}
