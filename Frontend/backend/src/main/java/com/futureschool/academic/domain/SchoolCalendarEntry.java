package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "school_calendar_entries")
public class SchoolCalendarEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "entry_id", updatable = false, nullable = false)
    private UUID entryId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calendar_id", nullable = false)
    private SchoolCalendar calendar;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "day_type", nullable = false, length = 32)
    private CalendarDayType dayType;

    @Column(name = "description")
    private String description;

    @Column(name = "is_instructional", nullable = false)
    private boolean isInstructional = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public SchoolCalendarEntry() {
    }

    public SchoolCalendarEntry(SchoolCalendar calendar,
                               School school,
                               LocalDate entryDate,
                               CalendarDayType dayType,
                               String description,
                               boolean isInstructional) {
        this.calendar = calendar;
        this.school = school;
        this.entryDate = entryDate;
        this.dayType = dayType;
        this.description = description;
        this.isInstructional = isInstructional;
    }

    public UUID getEntryId() {
        return entryId;
    }

    public SchoolCalendar getCalendar() {
        return calendar;
    }

    public void setCalendar(SchoolCalendar calendar) {
        this.calendar = calendar;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public CalendarDayType getDayType() {
        return dayType;
    }

    public void setDayType(CalendarDayType dayType) {
        this.dayType = dayType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isInstructional() {
        return isInstructional;
    }

    public void setInstructional(boolean instructional) {
        isInstructional = instructional;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
