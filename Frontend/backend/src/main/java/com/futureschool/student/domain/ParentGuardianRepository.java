package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentGuardianRepository extends JpaRepository<ParentGuardian, UUID> {
    Optional<ParentGuardian> findBySchoolAndGuardianId(School school, UUID guardianId);
    Optional<ParentGuardian> findBySchoolAndPhone(School school, String phone);
    boolean existsBySchoolAndPhone(School school, String phone);
}
