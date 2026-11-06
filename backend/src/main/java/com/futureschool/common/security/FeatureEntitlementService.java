package com.futureschool.common.security;

import com.futureschool.identity.domain.SchoolFeatureEntitlement;
import com.futureschool.identity.domain.SchoolFeatureEntitlementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class FeatureEntitlementService {

    private final SchoolFeatureEntitlementRepository entitlementRepository;

    public FeatureEntitlementService(SchoolFeatureEntitlementRepository entitlementRepository) {
        this.entitlementRepository = entitlementRepository;
    }

    @Transactional(readOnly = true)
    public boolean isFeatureEntitled(UUID schoolId, String featureCode) {
        if (schoolId == null || featureCode == null) {
            return false;
        }

        Optional<SchoolFeatureEntitlement> entitlement =
                entitlementRepository.findBySchool_SchoolIdAndFeatureCode(schoolId, featureCode.toLowerCase());

        // If an explicit entitlement record exists, honor its enabled flag; otherwise deny or allow based on policy
        return entitlement.map(SchoolFeatureEntitlement::isEnabled).orElse(false);
    }
}
