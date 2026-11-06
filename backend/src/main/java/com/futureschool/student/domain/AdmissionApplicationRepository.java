package com.futureschool.student.domain;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, UUID> {
    Optional<AdmissionApplication> findBySchoolAndApplicationId(School school, UUID applicationId);
    Optional<AdmissionApplication> findBySchoolAndApplicationNumber(School school, String applicationNumber);
    List<AdmissionApplication> findBySchoolAndStatusOrderByCreatedAtDesc(School school, AdmissionStatus status);
    List<AdmissionApplication> findBySchoolOrderByCreatedAtDesc(School school);
    long countBySchoolAndTargetAcademicYear(School school, AcademicYear targetAcademicYear);
    boolean existsBySchoolAndApplicationNumber(School school, String applicationNumber);
}
