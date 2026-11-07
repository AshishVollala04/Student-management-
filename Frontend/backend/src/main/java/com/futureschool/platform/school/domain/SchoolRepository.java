package com.futureschool.platform.school.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {
    Optional<School> findBySchoolCode(String schoolCode);
    boolean existsBySchoolCode(String schoolCode);
}
