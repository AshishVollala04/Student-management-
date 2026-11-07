package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
    List<Section> findBySchoolClass(SchoolClass schoolClass);
    List<Section> findBySchoolClassOrderByNameAsc(SchoolClass schoolClass);
    List<Section> findBySchool(School school);
    Optional<Section> findBySchoolClassAndName(SchoolClass schoolClass, String name);
    Optional<Section> findBySchoolAndSectionId(School school, UUID sectionId);
    boolean existsBySchoolClassAndName(SchoolClass schoolClass, String name);
    boolean existsBySchoolClassAndNameAndSectionIdNot(SchoolClass schoolClass, String name, UUID sectionId);
    Optional<Section> findBySchool_SchoolIdAndSectionId(UUID schoolId, UUID sectionId);
}
