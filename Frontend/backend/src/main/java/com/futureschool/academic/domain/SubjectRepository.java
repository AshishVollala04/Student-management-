package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    List<Subject> findBySchoolOrderByNameAsc(School school);
    List<Subject> findBySchoolAndStatusOrderByNameAsc(School school, String status);
    Optional<Subject> findBySchoolAndCode(School school, String code);
    boolean existsBySchoolAndCode(School school, String code);
    boolean existsBySchoolAndCodeAndSubjectIdNot(School school, String code, UUID subjectId);
    Optional<Subject> findBySchool_SchoolIdAndSubjectId(UUID schoolId, UUID subjectId);
}
