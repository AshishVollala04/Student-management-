package com.futureschool.academic.dto;

import com.futureschool.academic.domain.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class AcademicDtos {

    // 1. School Context
    public record SchoolContextResponse(
            String schoolCode,
            String schoolName,
            String logoUrl,
            String brandingPrimaryColor,
            String timezone,
            List<String> supportedLanguages,
            AcademicYearSummary currentAcademicYear,
            List<String> enabledFeatures
    ) {
        public record AcademicYearSummary(
                UUID academicYearId,
                String code,
                String name,
                LocalDate startDate,
                LocalDate endDate,
                AcademicYearStatus status
        ) {}
    }

    // 2. Academic Year
    public record CreateAcademicYearRequest(
            @NotBlank(message = "Code is required")
            @Size(max = 32)
            String code,

            @NotBlank(message = "Name is required")
            @Size(max = 128)
            String name,

            @NotNull(message = "Start date is required")
            LocalDate startDate,

            @NotNull(message = "End date is required")
            LocalDate endDate
    ) {}

    public record UpdateAcademicYearRequest(
            @NotBlank(message = "Name is required")
            @Size(max = 128)
            String name,

            @NotNull(message = "Start date is required")
            LocalDate startDate,

            @NotNull(message = "End date is required")
            LocalDate endDate
    ) {}

    public record AcademicYearResponse(
            UUID academicYearId,
            String code,
            String name,
            LocalDate startDate,
            LocalDate endDate,
            AcademicYearStatus status,
            boolean isCurrent
    ) {}

    public record AcademicYearReadinessSummary(
            UUID academicYearId,
            String code,
            String status,
            int totalClasses,
            int totalSections,
            int totalSubjects,
            int totalConfiguredSubjects,
            boolean hasCalendar,
            boolean isReadyForActivation
    ) {}

    // 3. School Class
    public record CreateClassRequest(
            @NotBlank(message = "Class name is required")
            @Size(max = 64)
            String name,

            @NotNull(message = "Grade level is required")
            @Min(0) @Max(15)
            Integer gradeLevel,

            @Min(1)
            Integer normalCapacity,

            @Min(1)
            Integer maxCapacity,

            Integer displayOrder
    ) {}

    public record UpdateClassRequest(
            @NotBlank(message = "Class name is required")
            @Size(max = 64)
            String name,

            @NotNull(message = "Grade level is required")
            @Min(0) @Max(15)
            Integer gradeLevel,

            @Min(1)
            Integer normalCapacity,

            @Min(1)
            Integer maxCapacity,

            Integer displayOrder,

            String status
    ) {}

    public record SchoolClassResponse(
            UUID classId,
            String name,
            int gradeLevel,
            int normalCapacity,
            int maxCapacity,
            int displayOrder,
            String status
    ) {}

    // 4. Section
    public record CreateSectionRequest(
            @NotNull(message = "Class ID is required")
            UUID classId,

            @NotBlank(message = "Section name is required")
            @Size(max = 32)
            String name,

            @Min(1)
            Integer normalCapacity,

            @Min(1)
            Integer maxCapacity
    ) {}

    public record UpdateSectionRequest(
            @NotBlank(message = "Section name is required")
            @Size(max = 32)
            String name,

            @Min(1)
            Integer normalCapacity,

            @Min(1)
            Integer maxCapacity,

            String status
    ) {}

    public record SectionResponse(
            UUID sectionId,
            UUID classId,
            String className,
            String name,
            int normalCapacity,
            int maxCapacity,
            String status
    ) {}

    // 5. Subject
    public record CreateSubjectRequest(
            @NotBlank(message = "Subject code is required")
            @Size(max = 32)
            String code,

            @NotBlank(message = "Subject name is required")
            @Size(max = 128)
            String name,

            String department,

            SubjectType subjectType,

            @Min(1) @Max(20)
            Integer weeklyPeriodRequirement
    ) {}

    public record UpdateSubjectRequest(
            @NotBlank(message = "Subject name is required")
            @Size(max = 128)
            String name,

            String department,

            SubjectType subjectType,

            @Min(1) @Max(20)
            Integer weeklyPeriodRequirement,

            String status
    ) {}

    public record SubjectResponse(
            UUID subjectId,
            String code,
            String name,
            String department,
            SubjectType subjectType,
            String status,
            int weeklyPeriodRequirement
    ) {}

    // 6. Class-Subject Configuration
    public record CreateClassSubjectConfigRequest(
            @NotNull(message = "Academic year ID is required")
            UUID academicYearId,

            @NotNull(message = "Class ID is required")
            UUID classId,

            @NotNull(message = "Subject ID is required")
            UUID subjectId,

            Boolean isRequired,

            @Min(1) @Max(20)
            Integer weeklyPeriodsOverride,

            Boolean isAssessmentEnabled
    ) {}

    public record UpdateClassSubjectConfigRequest(
            Boolean isRequired,

            @Min(1) @Max(20)
            Integer weeklyPeriodsOverride,

            Boolean isAssessmentEnabled
    ) {}

    public record ClassSubjectConfigResponse(
            UUID configId,
            UUID academicYearId,
            String academicYearName,
            UUID classId,
            String className,
            UUID subjectId,
            String subjectName,
            String subjectCode,
            boolean isRequired,
            Integer weeklyPeriodsOverride,
            boolean isAssessmentEnabled
    ) {}

    // 7. School Calendar
    public record CreateCalendarRequest(
            @NotNull(message = "Academic year ID is required")
            UUID academicYearId,

            @NotBlank(message = "Calendar name is required")
            String name
    ) {}

    public record AddCalendarEntryRequest(
            @NotNull(message = "Entry date is required")
            LocalDate entryDate,

            @NotNull(message = "Day type is required")
            CalendarDayType dayType,

            String description,

            Boolean isInstructional
    ) {}

    public record CalendarEntryResponse(
            UUID entryId,
            LocalDate entryDate,
            CalendarDayType dayType,
            String description,
            boolean isInstructional
    ) {}

    public record SchoolCalendarResponse(
            UUID calendarId,
            UUID academicYearId,
            String academicYearName,
            String name,
            int version,
            CalendarStatus status,
            List<CalendarEntryResponse> entries
    ) {}
}
