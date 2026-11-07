package com.futureschool.common.security;

import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserSession;
import com.futureschool.identity.domain.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    private final UserSessionRepository sessionRepository;
    private final PasswordService passwordService;
    private final long refreshTokenExpirationSeconds;

    public record SessionResult(UserSession session, String rawRefreshToken) {}

    public SessionService(
            UserSessionRepository sessionRepository,
            PasswordService passwordService,
            @Value("${app.security.jwt.refresh-token-expiration-seconds:604800}") long refreshTokenExpirationSeconds) {
        this.sessionRepository = sessionRepository;
        this.passwordService = passwordService;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }

    @Transactional
    public SessionResult createSession(User user, PortalContext portal, String ipAddress, String userAgent) {
        String rawRefreshToken = passwordService.generateSecureRandomToken();
        String hash = passwordService.hashToken(rawRefreshToken);
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(refreshTokenExpirationSeconds);

        UserSession session = new UserSession(user, hash, ipAddress, userAgent, expiresAt);
        UserSession saved = sessionRepository.save(session);
        return new SessionResult(saved, rawRefreshToken);
    }

    @Transactional
    public Optional<SessionResult> rotateRefreshToken(String rawRefreshToken, String ipAddress, String userAgent) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return Optional.empty();
        }

        String presentedHash = passwordService.hashToken(rawRefreshToken);
        Optional<UserSession> sessionOpt = sessionRepository.findByRefreshTokenHash(presentedHash);

        if (sessionOpt.isEmpty()) {
            return Optional.empty();
        }

        UserSession session = sessionOpt.get();

        // Check if session is already revoked or expired
        if (session.isRevoked() || session.getExpiresAt().isBefore(Instant.now())) {
            // Suspicious reuse of revoked/expired token: revoke all user sessions as security measure
            revokeAllUserSessions(session.getUser());
            return Optional.empty();
        }

        // Rotate token
        String newRawRefreshToken = passwordService.generateSecureRandomToken();
        String newHash = passwordService.hashToken(newRawRefreshToken);
        Instant now = Instant.now();
        Instant newExpiresAt = now.plusSeconds(refreshTokenExpirationSeconds);

        session.setRefreshTokenHash(newHash);
        session.setLastUsedAt(now);
        session.setExpiresAt(newExpiresAt);
        if (ipAddress != null) session.setIpAddress(ipAddress);
        if (userAgent != null) session.setUserAgent(userAgent);

        UserSession updated = sessionRepository.save(session);
        return Optional.of(new SessionResult(updated, newRawRefreshToken));
    }

    @Transactional(readOnly = true)
    public boolean isSessionActive(UUID sessionId) {
        if (sessionId == null) return false;
        return sessionRepository.findById(sessionId)
                .map(s -> !s.isRevoked() && s.getExpiresAt().isAfter(Instant.now()))
                .orElse(false);
    }

    @Transactional
    public boolean revokeSession(UUID sessionId, User user) {
        Optional<UserSession> sessionOpt = sessionRepository.findBySessionIdAndUser(sessionId, user);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.setRevoked(true);
            session.setRevokedAt(Instant.now());
            sessionRepository.save(session);
            return true;
        }
        return false;
    }

    @Transactional
    public void revokeAllUserSessions(User user) {
        List<UserSession> sessions = sessionRepository.findByUser(user);
        Instant now = Instant.now();
        for (UserSession s : sessions) {
            if (!s.isRevoked()) {
                s.setRevoked(true);
                s.setRevokedAt(now);
            }
        }
        sessionRepository.saveAll(sessions);
    }

    @Transactional(readOnly = true)
    public List<UserSession> getActiveSessions(User user) {
        return sessionRepository.findByUserAndIsRevokedFalseOrderByLastUsedAtDesc(user);
    }
}
