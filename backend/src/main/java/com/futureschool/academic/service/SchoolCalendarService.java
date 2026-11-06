package com.futureschool.academic.service;

import com.futureschool.academic.domain.*;
import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.common.audit.AuditService;
import com.futureschool.common.exception.ApiException;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SchoolCalendarService {

    private final SchoolCalendarRepository calendarRepository;
    private final SchoolCalendarEntryRepository entryRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolRepository schoolRepository;
    private final AuditService auditService;

    public SchoolCalendarService(
            SchoolCalendarRepository calendarRepository,
            SchoolCalendarEntryRepository entryRepository,
            AcademicYearRepository academicYearRepository,
            SchoolRepository schoolRepository,
            AuditService auditService) {
        this.calendarRepository = calendarRepository;
        this.entryRepository = entryRepository;
        this.academicYearRepository = academicYearRepository;
        this.schoolRepository = schoolRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.SchoolCalendarResponse createCalendarDraft(
            UUID schoolId,
            AcademicDtos.CreateCalendarRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        AcademicYear academicYear = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, request.academicYearId())
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (academicYear.getStatus() == AcademicYearStatus.CLOSED) {
            throw ApiException.conflict("CLOSED_YEAR_IMMUTABLE", "Cannot create a calendar for a closed academic year");
        }

        int nextVersion = calendarRepository.findBySchoolAndAcademicYearOrderByVersionDesc(school, academicYear).stream()
                .mapToInt(SchoolCalendar::getVersion)
                .max()
                .orElse(0) + 1;

        SchoolCalendar calendar = new SchoolCalendar(school, academicYear, request.name(), nextVersion, CalendarStatus.DRAFT);
        SchoolCalendar saved = calendarRepository.save(calendar);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CREATE_CALENDAR_DRAFT", "ACADEMIC", "SCHOOL_CALENDAR",
                saved.getCalendarId().toString(), null, "DRAFT v" + saved.getVersion()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.CalendarEntryResponse addCalendarEntry(
            UUID schoolId,
            UUID calendarId,
            AcademicDtos.AddCalendarEntryRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        SchoolCalendar calendar = calendarRepository.findBySchool_SchoolIdAndCalendarId(schoolId, calendarId)
                .orElseThrow(() -> ApiException.notFound("CALENDAR_NOT_FOUND", "Calendar not found"));

        AcademicYear academicYear = calendar.getAcademicYear();

        // Validate date within academic year bounds
        if (request.entryDate().isBefore(academicYear.getStartDate()) || request.entryDate().isAfter(academicYear.getEndDate())) {
            throw ApiException.unprocessable("DATE_OUT_OF_RANGE",
                    "Entry date " + request.entryDate() + " must fall within the academic year (" +
                            academicYear.getStartDate() + " to " + academicYear.getEndDate() + ")");
        }

        // Validate conflict
        if (entryRepository.existsByCalendarAndEntryDate(calendar, request.entryDate())) {
            throw ApiException.conflict("CALENDAR_DATE_CONFLICT",
                    "An entry for date " + request.entryDate() + " already exists in this calendar");
        }

        boolean instructional = request.isInstructional() == null
                ? request.dayType() == CalendarDayType.WORKING_DAY || request.dayType() == CalendarDayType.SPECIAL_WORKING_DAY
                : request.isInstructional();

        SchoolCalendarEntry entry = new SchoolCalendarEntry(
                calendar,
                school,
                request.entryDate(),
                request.dayType(),
                request.description(),
                instructional
        );

        SchoolCalendarEntry saved = entryRepository.save(entry);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "ADD_CALENDAR_ENTRY", "ACADEMIC", "CALENDAR_ENTRY",
                saved.getEntryId().toString(), null, saved.getEntryDate() + " (" + saved.getDayType() + ")"
        );

        return new AcademicDtos.CalendarEntryResponse(
                saved.getEntryId(),
                saved.getEntryDate(),
                saved.getDayType(),
                saved.getDescription(),
                saved.isInstructional()
        );
    }

    @Transactional
    public AcademicDtos.SchoolCalendarResponse publishCalendar(
            UUID schoolId,
            UUID calendarId,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        SchoolCalendar calendar = calendarRepository.findBySchool_SchoolIdAndCalendarId(schoolId, calendarId)
                .orElseThrow(() -> ApiException.notFound("CALENDAR_NOT_FOUND", "Calendar not found"));

        String oldState = calendar.getStatus().name();
        calendar.setStatus(CalendarStatus.PUBLISHED);

        SchoolCalendar updated = calendarRepository.save(calendar);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "PUBLISH_CALENDAR", "ACADEMIC", "SCHOOL_CALENDAR",
                updated.getCalendarId().toString(), oldState, "PUBLISHED"
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public AcademicDtos.SchoolCalendarResponse getCalendar(UUID schoolId, UUID calendarId) {
        SchoolCalendar calendar = calendarRepository.findBySchool_SchoolIdAndCalendarId(schoolId, calendarId)
                .orElseThrow(() -> ApiException.notFound("CALENDAR_NOT_FOUND", "Calendar not found"));
        return mapToResponse(calendar);
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.SchoolCalendarResponse mapToResponse(SchoolCalendar c) {
        List<SchoolCalendarEntry> entries = entryRepository.findByCalendarOrderByEntryDateAsc(c);
        List<AcademicDtos.CalendarEntryResponse> entryResponses = entries.stream()
                .map(e -> new AcademicDtos.CalendarEntryResponse(
                        e.getEntryId(),
                        e.getEntryDate(),
                        e.getDayType(),
                        e.getDescription(),
                        e.isInstructional()
                )).toList();

        return new AcademicDtos.SchoolCalendarResponse(
                c.getCalendarId(),
                c.getAcademicYear().getAcademicYearId(),
                c.getAcademicYear().getName(),
                c.getName(),
                c.getVersion(),
                c.getStatus(),
                entryResponses
        );
    }
}
