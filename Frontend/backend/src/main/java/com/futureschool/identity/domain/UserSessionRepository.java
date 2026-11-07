package com.futureschool.identity.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {
    Optional<UserSession> findByRefreshTokenHash(String refreshTokenHash);
    List<UserSession> findByUserAndIsRevokedFalseOrderByLastUsedAtDesc(User user);
    Optional<UserSession> findBySessionIdAndUser(UUID sessionId, User user);
    List<UserSession> findByUser(User user);
}
