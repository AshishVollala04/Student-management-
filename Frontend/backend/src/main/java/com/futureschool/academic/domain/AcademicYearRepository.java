package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, UUID> {
    List<AcademicYear> findBySchoolOrderByStartDateDesc(School school);
    List<AcademicYear> findBySchool(School school);
    Optional<AcademicYear> findBySchoolAndCode(School school, String code);
    Optional<AcademicYear> findBySchoolAndAcademicYearId(School school, UUID academicYearId);
    Optional<AcademicYear> findBySchoolAndIsCurrentTrue(School school);
    Optional<AcademicYear> findBySchoolAndStatus(School school, AcademicYearStatus status);
    boolean existsBySchoolAndStatus(School school, AcademicYearStatus status);
    boolean existsBySchoolAndStatusAndAcademicYearIdNot(School school, AcademicYearStatus status, UUID academicYearId);
    boolean existsBySchoolAndCode(School school, String code);
    boolean existsBySchoolAndCodeAndAcademicYearIdNot(School school, String code, UUID academicYearId);
    Optional<AcademicYear> findBySchool_SchoolIdAndAcademicYearId(UUID schoolId, UUID academicYearId);
}
