package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, UUID> {
    List<SchoolClass> findBySchoolOrderByGradeLevelAsc(School school);
    List<SchoolClass> findBySchoolOrderByDisplayOrderAscGradeLevelAsc(School school);
    Optional<SchoolClass> findBySchoolAndName(School school, String name);
    Optional<SchoolClass> findBySchoolAndClassId(School school, UUID classId);
    boolean existsBySchoolAndName(School school, String name);
    boolean existsBySchoolAndNameAndClassIdNot(School school, String name, UUID classId);
    Optional<SchoolClass> findBySchool_SchoolIdAndClassId(UUID schoolId, UUID classId);
}
