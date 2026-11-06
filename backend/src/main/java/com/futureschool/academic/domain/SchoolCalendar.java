package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "school_calendars")
public class SchoolCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "calendar_id", updatable = false, nullable = false)
    private UUID calendarId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @NotBlank
    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "version", nullable = false)
    private int version = 1;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private CalendarStatus status = CalendarStatus.DRAFT;

    @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SchoolCalendarEntry> entries = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public SchoolCalendar() {
    }

    public SchoolCalendar(School school, AcademicYear academicYear, String name, int version, CalendarStatus status) {
        this.school = school;
        this.academicYear = academicYear;
        this.name = name;
        this.version = version;
        this.status = status;
    }

    public UUID getCalendarId() {
        return calendarId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public CalendarStatus getStatus() {
        return status;
    }

    public void setStatus(CalendarStatus status) {
        this.status = status;
    }

    public List<SchoolCalendarEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<SchoolCalendarEntry> entries) {
        this.entries = entries;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
