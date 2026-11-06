package com.futureschool.identity.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolFeatureEntitlementRepository extends JpaRepository<SchoolFeatureEntitlement, UUID> {
    Optional<SchoolFeatureEntitlement> findBySchoolAndFeatureCode(School school, String featureCode);
    Optional<SchoolFeatureEntitlement> findBySchool_SchoolIdAndFeatureCode(UUID schoolId, String featureCode);
    List<SchoolFeatureEntitlement> findBySchool(School school);
}
