package com.futureschool.identity.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MfaConfigurationRepository extends JpaRepository<MfaConfiguration, UUID> {
    Optional<MfaConfiguration> findByUser(User user);
    Optional<MfaConfiguration> findByUser_UserId(UUID userId);
}
