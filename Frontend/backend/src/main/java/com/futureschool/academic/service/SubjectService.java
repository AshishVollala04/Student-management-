package com.futureschool.academic.service;

import com.futureschool.academic.domain.Subject;
import com.futureschool.academic.domain.SubjectRepository;
import com.futureschool.academic.domain.SubjectType;
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
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;
    private final AuditService auditService;

    public SubjectService(
            SubjectRepository subjectRepository,
            SchoolRepository schoolRepository,
            AuditService auditService) {
        this.subjectRepository = subjectRepository;
        this.schoolRepository = schoolRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.SubjectResponse createSubject(
            UUID schoolId,
            AcademicDtos.CreateSubjectRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);

        if (subjectRepository.existsBySchoolAndCode(school, request.code())) {
            throw ApiException.conflict("DUPLICATE_SUBJECT",
                    "Subject code '" + request.code() + "' already exists in this school");
        }

        SubjectType type = request.subjectType() != null ? request.subjectType() : SubjectType.CORE;
        int periods = request.weeklyPeriodRequirement() != null ? request.weeklyPeriodRequirement() : 5;

        Subject subject = new Subject(school, request.code(), request.name(), request.department(), type, periods);
        Subject saved = subjectRepository.save(subject);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CREATE_SUBJECT", "ACADEMIC", "SUBJECT",
                saved.getSubjectId().toString(), null, saved.getCode() + " (" + saved.getName() + ")"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.SubjectResponse updateSubject(
            UUID schoolId,
            UUID subjectId,
            AcademicDtos.UpdateSubjectRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        Subject subject = subjectRepository.findBySchool_SchoolIdAndSubjectId(schoolId, subjectId)
                .orElseThrow(() -> ApiException.notFound("SUBJECT_NOT_FOUND", "Subject not found"));

        String oldState = subject.getCode() + " [" + subject.getName() + "]";

        subject.setName(request.name());
        if (request.department() != null) subject.setDepartment(request.department());
        if (request.subjectType() != null) subject.setSubjectType(request.subjectType());
        if (request.weeklyPeriodRequirement() != null) subject.setWeeklyPeriodRequirement(request.weeklyPeriodRequirement());
        if (request.status() != null) subject.setStatus(request.status());

        Subject updated = subjectRepository.save(subject);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "UPDATE_SUBJECT", "ACADEMIC", "SUBJECT",
                updated.getSubjectId().toString(), oldState, updated.getName()
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.SubjectResponse> listSubjects(UUID schoolId) {
        School school = getSchool(schoolId);
        return subjectRepository.findBySchoolOrderByNameAsc(school).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AcademicDtos.SubjectResponse getSubject(UUID schoolId, UUID subjectId) {
        Subject subject = subjectRepository.findBySchool_SchoolIdAndSubjectId(schoolId, subjectId)
                .orElseThrow(() -> ApiException.notFound("SUBJECT_NOT_FOUND", "Subject not found"));
        return mapToResponse(subject);
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.SubjectResponse mapToResponse(Subject s) {
        return new AcademicDtos.SubjectResponse(
                s.getSubjectId(),
                s.getCode(),
                s.getName(),
                s.getDepartment(),
                s.getSubjectType(),
                s.getStatus(),
                s.getWeeklyPeriodRequirement()
        );
    }
}
