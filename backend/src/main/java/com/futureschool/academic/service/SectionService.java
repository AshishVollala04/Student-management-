package com.futureschool.academic.service;

import com.futureschool.academic.domain.SchoolClass;
import com.futureschool.academic.domain.SchoolClassRepository;
import com.futureschool.academic.domain.Section;
import com.futureschool.academic.domain.SectionRepository;
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
public class SectionService {

    private final SectionRepository sectionRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SchoolRepository schoolRepository;
    private final AuditService auditService;

    public SectionService(
            SectionRepository sectionRepository,
            SchoolClassRepository schoolClassRepository,
            SchoolRepository schoolRepository,
            AuditService auditService) {
        this.sectionRepository = sectionRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.schoolRepository = schoolRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AcademicDtos.SectionResponse createSection(
            UUID schoolId,
            AcademicDtos.CreateSectionRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, request.classId())
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found in this school"));

        int normal = request.normalCapacity() != null ? request.normalCapacity() : schoolClass.getNormalCapacity();
        int max = request.maxCapacity() != null ? request.maxCapacity() : schoolClass.getMaxCapacity();

        if (normal > max) {
            throw ApiException.unprocessable("CAPACITY_INVALID", "Normal capacity cannot exceed maximum capacity");
        }

        if (sectionRepository.existsBySchoolClassAndName(schoolClass, request.name())) {
            throw ApiException.conflict("DUPLICATE_SECTION",
                    "Section with name '" + request.name() + "' already exists in " + schoolClass.getName());
        }

        Section section = new Section(school, schoolClass, request.name(), normal, max);
        Section saved = sectionRepository.save(section);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "CREATE_SECTION", "ACADEMIC", "SECTION",
                saved.getSectionId().toString(), null, schoolClass.getName() + "-" + saved.getName()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public AcademicDtos.SectionResponse updateSection(
            UUID schoolId,
            UUID sectionId,
            AcademicDtos.UpdateSectionRequest request,
            UUID actorUserId,
            String actorLoginId) {

        School school = getSchool(schoolId);
        Section section = sectionRepository.findBySchool_SchoolIdAndSectionId(schoolId, sectionId)
                .orElseThrow(() -> ApiException.notFound("SECTION_NOT_FOUND", "Section not found"));

        int normal = request.normalCapacity() != null ? request.normalCapacity() : section.getNormalCapacity();
        int max = request.maxCapacity() != null ? request.maxCapacity() : section.getMaxCapacity();

        if (normal > max) {
            throw ApiException.unprocessable("CAPACITY_INVALID", "Normal capacity cannot exceed maximum capacity");
        }

        if (sectionRepository.existsBySchoolClassAndNameAndSectionIdNot(section.getSchoolClass(), request.name(), sectionId)) {
            throw ApiException.conflict("DUPLICATE_SECTION",
                    "Section with name '" + request.name() + "' already exists in " + section.getSchoolClass().getName());
        }

        String oldState = section.getName() + " [cap=" + section.getMaxCapacity() + "]";

        section.setName(request.name());
        section.setNormalCapacity(normal);
        section.setMaxCapacity(max);
        if (request.status() != null) section.setStatus(request.status());

        Section updated = sectionRepository.save(section);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId,
                "UPDATE_SECTION", "ACADEMIC", "SECTION",
                updated.getSectionId().toString(), oldState, updated.getName()
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<AcademicDtos.SectionResponse> listSectionsByClass(UUID schoolId, UUID classId) {
        SchoolClass schoolClass = schoolClassRepository.findBySchool_SchoolIdAndClassId(schoolId, classId)
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "Class not found"));
        return sectionRepository.findBySchoolClassOrderByNameAsc(schoolClass).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AcademicDtos.SectionResponse getSection(UUID schoolId, UUID sectionId) {
        Section section = sectionRepository.findBySchool_SchoolIdAndSectionId(schoolId, sectionId)
                .orElseThrow(() -> ApiException.notFound("SECTION_NOT_FOUND", "Section not found"));
        return mapToResponse(section);
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));
    }

    private AcademicDtos.SectionResponse mapToResponse(Section s) {
        return new AcademicDtos.SectionResponse(
                s.getSectionId(),
                s.getSchoolClass().getClassId(),
                s.getSchoolClass().getName(),
                s.getName(),
                s.getNormalCapacity(),
                s.getMaxCapacity(),
                s.getStatus()
        );
    }
}
