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
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;
    private final SchoolRepository schoolRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSubjectConfigurationRepository classSubjectConfigRepository;
    private final SchoolCalendarRepository schoolCalendarRepository;
    private final AuditService auditService;

    public AcademicYearService(
            AcademicYearRepository academicYearRepository,
            SchoolRepository schoolRepository,
            SchoolClassRepository schoolClassRepository,
            SectionRepository sectionRepository,
            SubjectRepository subjectRepository,
            ClassSubjectConfigurationRepository classSubjectConfigRepository,
            SchoolCalendarRepository schoolCalendarRepository,
            AuditService auditService) {
        this.academicYearRepository = academicYearRepository;
        this.schoolRepository = schoolRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.sectionRepository = sectionRepository;
        this.subjectRepository = subjectRepository;
        this.classSubjectConfigRepository = classSubjectConfigRepository;
        this.schoolCalendarRepository = schoolCalendarRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.AcademicYearResponse createDraft(
            UUID schoolId,
            AcademicDtos.CreateAcademicYearRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);

        if (!request.startDate().isBefore(request.endDate())) {
            throw ApiException.unprocessable("INVALID_DATES", "Academic year start date must precede end date");
        }

        if (academicYearRepository.existsBySchoolAndCode(school, request.code())) {
            throw ApiException.conflict("DUPLICATE_CODE", "Academic year with code '" + request.code() + "' already exists");
        }

        AcademicYear year = new AcademicYear(
                school,
                request.code(),
                request.name(),
                request.startDate(),
                request.endDate(),
                AcademicYearStatus.DRAFT
        );

        AcademicYear saved = academicYearRepository.save(year);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CREATE_ACADEMIC_YEAR", "ACADEMIC", "ACADEMIC_YEAR",
                saved.getAcademicYearId().toString(), null, "DRAFT"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.AcademicYearResponse updateDraft(
            UUID schoolId,
            UUID academicYearId,
            AcademicDtos.UpdateAcademicYearRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        AcademicYear year = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, academicYearId)
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (year.getStatus() == AcademicYearStatus.CLOSED) {
            throw ApiException.conflict("CLOSED_YEAR_IMMUTABLE", "Cannot edit a closed academic year");
        }

        if (!request.startDate().isBefore(request.endDate())) {
            throw ApiException.unprocessable("INVALID_DATES", "Academic year start date must precede end date");
        }

        String oldState = year.getStatus().name() + " (" + year.getName() + ")";

        year.setName(request.name());
        year.setStartDate(request.startDate());
        year.setEndDate(request.endDate());

        AcademicYear updated = academicYearRepository.save(year);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "UPDATE_ACADEMIC_YEAR", "ACADEMIC", "ACADEMIC_YEAR",
                updated.getAcademicYearId().toString(), oldState, updated.getStatus().name()
        );

        return mapToResponse(updated);
    }

    @Transactional
    public AcademicDtos.AcademicYearResponse activateAcademicYear(
            UUID schoolId,
            UUID academicYearId,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        AcademicYear year = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, academicYearId)
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (year.getStatus() == AcademicYearStatus.CLOSED) {
            throw ApiException.conflict("CLOSED_YEAR_IMMUTABLE", "Cannot activate a closed academic year");
        }

        // Rule: Only one active Academic Year per school
        boolean otherActiveExists = academicYearRepository
                .existsBySchoolAndStatusAndAcademicYearIdNot(school, AcademicYearStatus.ACTIVE, academicYearId);

        if (otherActiveExists) {
            throw ApiException.conflict("ACTIVE_YEAR_EXISTS",
                    "Only one active academic year is permitted per school. Close or deactivate the current active year first.");
        }

        String oldState = year.getStatus().name();
        year.setStatus(AcademicYearStatus.ACTIVE);
        year.setCurrent(true);

        AcademicYear saved = academicYearRepository.save(year);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "ACTIVATE_ACADEMIC_YEAR", "ACADEMIC", "ACADEMIC_YEAR",
                saved.getAcademicYearId().toString(), oldState, "ACTIVE"
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public AcademicDtos.AcademicYearResponse getAcademicYear(UUID schoolId, UUID academicYearId) {
        AcademicYear year = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, academicYearId)
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));
        return mapToResponse(year);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.AcademicYearResponse> listAcademicYears(UUID schoolId) {
        School school = getSchool(schoolId);
        return academicYearRepository.findBySchoolOrderByStartDateDesc(school).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AcademicDtos.AcademicYearReadinessSummary getReadinessSummary(UUID schoolId, UUID academicYearId) {
        School school = getSchool(schoolId);
        AcademicYear year = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, academicYearId)
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        int totalClasses = schoolClassRepository.findBySchoolOrderByGradeLevelAsc(school).size();
        int totalSections = sectionRepository.findBySchool(school).size();
        int totalSubjects = subjectRepository.findBySchoolOrderByNameAsc(school).size();
        int configuredSubjects = classSubjectConfigRepository.findByAcademicYear(year).size();
        boolean hasCalendar = schoolCalendarRepository.findBySchoolAndAcademicYearOrderByVersionDesc(school, year).size() > 0;

        boolean isReady = totalClasses > 0 && totalSections > 0 && configuredSubjects > 0;

        return new AcademicDtos.AcademicYearReadinessSummary(
                year.getAcademicYearId(),
                year.getCode(),
                year.getStatus().name(),
                totalClasses,
                totalSections,
                totalSubjects,
                configuredSubjects,
                hasCalendar,
                isReady
        );
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.AcademicYearResponse mapToResponse(AcademicYear year) {
        return new AcademicDtos.AcademicYearResponse(
                year.getAcademicYearId(),
                year.getCode(),
                year.getName(),
                year.getStartDate(),
                year.getEndDate(),
                year.getStatus(),
                year.isCurrent()
        );
    }
}
