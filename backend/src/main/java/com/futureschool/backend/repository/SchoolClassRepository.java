package com.futureschool.backend.repository;

import com.futureschool.backend.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, String> {
    Optional<SchoolClass> findByNameAndSection(String name, String section);
    List<SchoolClass> findByActiveTrueOrderByGradeNumberAscSectionAsc();
}
