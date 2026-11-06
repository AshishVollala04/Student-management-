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
public class ClassSubjectConfigService {

    private final ClassSubjectConfigurationRepository configRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;
    private final AuditService auditService;

    public ClassSubjectConfigService(
            ClassSubjectConfigurationRepository configRepository,
            AcademicYearRepository academicYearRepository,
            SchoolClassRepository schoolClassRepository,
            SubjectRepository subjectRepository,
            SchoolRepository schoolRepository,
            AuditService auditService) {
        this.configRepository = configRepository;
        this.academicYearRepository = academicYearRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.schoolRepository = schoolRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.ClassSubjectConfigResponse configureSubject(
            UUID schoolId,
            AcademicDtos.CreateClassSubjectConfigRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        AcademicYear academicYear = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, request.academicYearId())
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (academicYear.getStatus() == AcademicYearStatus.CLOSED) {
            throw ApiException.conflict("CLOSED_YEAR_IMMUTABLE", "Cannot configure subjects on a closed academic year");
        }

        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, request.classId())
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found in this school"));

        Subject subject = subjectRepository.findBySchool_SchoolIdAndSubjectId(schoolId, request.subjectId())
                .orElseThrow(() -> ApiException.notFound("SUBJECT_NOT_FOUND", "Subject not found in this school"));

        if (configRepository.existsByAcademicYearAndSchoolClassAndSubject(academicYear, schoolClass, subject)) {
            throw ApiException.conflict("DUPLICATE_CONFIG",
                    "Subject '" + subject.getName() + "' is already configured for " + schoolClass.getName());
        }

        boolean required = request.isRequired() == null || request.isRequired();
        boolean assessment = request.isAssessmentEnabled() == null || request.isAssessmentEnabled();

        ClassSubjectConfiguration config = new ClassSubjectConfiguration(
                school,
                academicYear,
                schoolClass,
                subject,
                required,
                request.weeklyPeriodsOverride(),
                assessment
        );

        ClassSubjectConfiguration saved = configRepository.save(config);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CONFIGURE_CLASS_SUBJECT", "ACADEMIC", "CLASS_SUBJECT_CONFIG",
                saved.getConfigId().toString(), null,
                schoolClass.getName() + " -> " + subject.getCode()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.ClassSubjectConfigResponse updateConfiguration(
            UUID schoolId,
            UUID configId,
            AcademicDtos.UpdateClassSubjectConfigRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        ClassSubjectConfiguration config = configRepository.findBySchool_SchoolIdAndConfigId(schoolId, configId)
                .orElseThrow(() -> ApiException.notFound("CONFIG_NOT_FOUND", "Configuration not found"));

        if (config.getAcademicYear().getStatus() == AcademicYearStatus.CLOSED) {
            throw ApiException.conflict("CLOSED_YEAR_IMMUTABLE", "Cannot modify configuration on a closed academic year");
        }

        String oldState = "required=" + config.isRequired() + ", override=" + config.getWeeklyPeriodsOverride();

        if (request.isRequired() != null) config.setRequired(request.isRequired());
        if (request.weeklyPeriodsOverride() != null) config.setWeeklyPeriodsOverride(request.weeklyPeriodsOverride());
        if (request.isAssessmentEnabled() != null) config.setAssessmentEnabled(request.isAssessmentEnabled());

        ClassSubjectConfiguration updated = configRepository.save(config);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "UPDATE_CLASS_SUBJECT_CONFIG", "ACADEMIC", "CLASS_SUBJECT_CONFIG",
                updated.getConfigId().toString(), oldState,
                "required=" + updated.isRequired() + ", override=" + updated.getWeeklyPeriodsOverride()
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.ClassSubjectConfigResponse> listConfigurations(
            UUID schoolId,
            UUID academicYearId,
            UUID classId) {

        AcademicYear academicYear = academicYearRepository.findBySchool_SchoolIdAndAcademicYearId(schoolId, academicYearId)
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, classId)
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found"));

        return configRepository.findByAcademicYearAndSchoolClass(academicYear, schoolClass).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.ClassSubjectConfigResponse mapToResponse(ClassSubjectConfiguration c) {
        return new AcademicDtos.ClassSubjectConfigResponse(
                c.getConfigId(),
                c.getAcademicYear().getAcademicYearId(),
                c.getAcademicYear().getName(),
                c.getSchoolClass().getClassId(),
                c.getSchoolClass().getName(),
                c.getSubject().getSubjectId(),
                c.getSubject().getName(),
                c.getSubject().getCode(),
                c.isRequired(),
                c.getWeeklyPeriodsOverride(),
                c.isAssessmentEnabled()
        );
    }
}
