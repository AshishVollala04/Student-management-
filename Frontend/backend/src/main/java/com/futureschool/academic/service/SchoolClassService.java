package com.futureschool.academic.service;

import com.futureschool.academic.domain.SchoolClass;
import com.futureschool.academic.domain.SchoolClassRepository;
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
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final SchoolRepository schoolRepository;
    private final AuditService auditService;

    public SchoolClassService(
            SchoolClassRepository schoolClassRepository,
            SchoolRepository schoolRepository,
            AuditService auditService) {
        this.schoolClassRepository = schoolClassRepository;
        this.schoolRepository = schoolRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.SchoolClassResponse createClass(
            UUID schoolId,
            AcademicDtos.CreateClassRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);

        int normal = request.normalCapacity() != null ? request.normalCapacity() : 35;
        int max = request.maxCapacity() != null ? request.maxCapacity() : 40;

        if (normal > max) {
            throw ApiException.unprocessable("CAPACITY_INVALID", "Normal capacity cannot exceed maximum capacity");
        }

        if (schoolClassRepository.existsBySchoolAndName(school, request.name())) {
            throw ApiException.conflict("DUPLICATE_CLASS", "Class with name '" + request.name() + "' already exists");
        }

        int order = request.displayOrder() != null ? request.displayOrder() : request.gradeLevel();

        SchoolClass schoolClass = new SchoolClass(
                school,
                request.name(),
                request.gradeLevel(),
                normal,
                max,
                order
        );

        SchoolClass saved = schoolClassRepository.save(schoolClass);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CREATE_CLASS", "ACADEMIC", "SCHOOL_CLASS",
                saved.getClassId().toString(), null, "ACTIVE (" + saved.getName() + ")"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.SchoolClassResponse updateClass(
            UUID schoolId,
            UUID classId,
            AcademicDtos.UpdateClassRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, classId)
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found"));

        int normal = request.normalCapacity() != null ? request.normalCapacity() : schoolClass.getNormalCapacity();
        int max = request.maxCapacity() != null ? request.maxCapacity() : schoolClass.getMaxCapacity();

        if (normal > max) {
            throw ApiException.unprocessable("CAPACITY_INVALID", "Normal capacity cannot exceed maximum capacity");
        }

        if (schoolClassRepository.existsBySchoolAndNameAndClassIdNot(school, request.name(), classId)) {
            throw ApiException.conflict("DUPLICATE_CLASS", "Class with name '" + request.name() + "' already exists");
        }

        String oldState = schoolClass.getName() + " [grade=" + schoolClass.getGradeLevel() + "]";

        schoolClass.setName(request.name());
        schoolClass.setGradeLevel(request.gradeLevel());
        schoolClass.setNormalCapacity(normal);
        schoolClass.setMaxCapacity(max);
        if (request.displayOrder() != null) schoolClass.setDisplayOrder(request.displayOrder());
        if (request.status() != null) schoolClass.setStatus(request.status());

        SchoolClass updated = schoolClassRepository.save(schoolClass);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "UPDATE_CLASS", "ACADEMIC", "SCHOOL_CLASS",
                updated.getClassId().toString(), oldState, updated.getName()
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.SchoolClassResponse> listClasses(UUID schoolId) {
        School school = getSchool(schoolId);
        return schoolClassRepository.findBySchoolOrderByDisplayOrderAscGradeLevelAsc(school).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AcademicDtos.SchoolClassResponse getClass(UUID schoolId, UUID classId) {
        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, classId)
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found"));
        return mapToResponse(schoolClass);
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.SchoolClassResponse mapToResponse(SchoolClass c) {
        return new AcademicDtos.SchoolClassResponse(
                c.getClassId(),
                c.getName(),
                c.getGradeLevel(),
                c.getNormalCapacity(),
                c.getMaxCapacity(),
                c.getDisplayOrder(),
                c.getStatus()
        );
    }
}
