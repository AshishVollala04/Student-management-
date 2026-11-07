package com.futureschool.academic.service;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.AcademicYearRepository;
import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.common.exception.ApiException;
import com.futureschool.identity.domain.SchoolFeatureEntitlement;
import com.futureschool.identity.domain.SchoolFeatureEntitlementRepository;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SchoolContextService {

    private final SchoolRepository schoolRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolFeatureEntitlementRepository featureEntitlementRepository;

    public SchoolContextService(SchoolRepository schoolRepository,
                                AcademicYearRepository academicYearRepository,
                                SchoolFeatureEntitlementRepository featureEntitlementRepository) {
        this.schoolRepository = schoolRepository;
        this.academicYearRepository = academicYearRepository;
        this.featureEntitlementRepository = featureEntitlementRepository;
    }

    @Transactional(readOnly = true)
    public AcademicDtos.SchoolContextResponse getSchoolContext(UUID schoolId) {
        if (schoolId == null) {
            throw ApiException.badRequest("MISSING_TENANT", "School ID context is required");
        }

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School not found"));

        Optional<AcademicYear> currentYearOpt = academicYearRepository.findBySchoolAndIsCurrentTrue(school);
        if (currentYearOpt.isEmpty()) {
            currentYearOpt = academicYearRepository.findBySchoolAndStatus(school, com.futureschool.academic.domain.AcademicYearStatus.ACTIVE);
        }

        AcademicDtos.SchoolContextResponse.AcademicYearSummary currentYearSummary = currentYearOpt
                .map(y -> new AcademicDtos.SchoolContextResponse.AcademicYearSummary(
                        y.getAcademicYearId(),
                        y.getCode(),
                        y.getName(),
                        y.getStartDate(),
                        y.getEndDate(),
                        y.getStatus()
                )).orElse(null);

        List<String> enabledFeatures = featureEntitlementRepository.findBySchool(school).stream()
                .filter(SchoolFeatureEntitlement::isEnabled)
                .map(SchoolFeatureEntitlement::getFeatureCode)
                .toList();

        return new AcademicDtos.SchoolContextResponse(
                school.getSchoolCode(),
                school.getSchoolName(),
                school.getBrandingLogoUrl(),
                school.getBrandingPrimaryColor(),
                school.getTimezone(),
                List.of("en", "hi"),
                currentYearSummary,
                enabledFeatures
        );
    }
}
