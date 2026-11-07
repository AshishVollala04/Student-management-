package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassSubjectConfigurationRepository extends JpaRepository<ClassSubjectConfiguration, UUID> {
    List<ClassSubjectConfiguration> findByAcademicYearAndSchoolClass(AcademicYear academicYear, SchoolClass schoolClass);
    List<ClassSubjectConfiguration> findByAcademicYear(AcademicYear academicYear);
    Optional<ClassSubjectConfiguration> findByAcademicYearAndSchoolClassAndSubject(AcademicYear academicYear, SchoolClass schoolClass, Subject subject);
    boolean existsByAcademicYearAndSchoolClassAndSubject(AcademicYear academicYear, SchoolClass schoolClass, Subject subject);
    boolean existsByAcademicYearAndSchoolClassAndSubjectAndConfigIdNot(AcademicYear academicYear, SchoolClass schoolClass, Subject subject, UUID configId);
    Optional<ClassSubjectConfiguration> findBySchool_SchoolIdAndConfigId(UUID schoolId, UUID configId);
    boolean existsBySubject(Subject subject);
    boolean existsBySchoolClass(SchoolClass schoolClass);
}
