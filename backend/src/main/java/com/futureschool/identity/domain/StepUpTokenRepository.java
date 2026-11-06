package com.futureschool.identity.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StepUpTokenRepository extends JpaRepository<StepUpToken, UUID> {
    Optional<StepUpToken> findByTokenHash(String tokenHash);
}
