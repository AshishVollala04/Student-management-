package com.futureschool.common.audit;

import com.futureschool.platform.school.domain.School;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditServiceImpl(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Override
    @Transactional
    public AuditEvent recordEvent(
            School school,
            UUID actorUserId,
            String actorLoginId,
            String actorRole,
            String effectivePermission,
            String action,
            String module,
            String entityType,
            String entityId,
            String previousState,
            String newState,
            String reason,
            String requestId,
            String correlationId,
            String auditCategory,
            String severity
    ) {
        String previousHash = auditEventRepository.findTopByOrderByCreatedAtDesc()
                .map(AuditEvent::getEventHash)
                .orElse("0000000000000000000000000000000000000000000000000000000000000000");

        Instant now = Instant.now();
        String currentHash = calculateSha256(previousHash + "|" + action + "|" + actorLoginId + "|" + entityId + "|" + now.toString());

        AuditEvent event = new AuditEvent();
        event.setSchool(school);
        event.setPlatformScope(school == null);
        event.setActorUserId(actorUserId);
        event.setActorLoginId(actorLoginId);
        event.setActorRole(actorRole);
        event.setEffectivePermission(effectivePermission);
        event.setAction(action);
        event.setModule(module);
        event.setEntityType(entityType);
        event.setEntityId(entityId);
        event.setPreviousState(previousState);
        event.setNewState(newState);
        event.setReason(reason);
        event.setRequestId(requestId);
        event.setCorrelationId(correlationId);
        event.setAuditCategory(auditCategory);
        event.setSeverity(severity);
        event.setPreviousEventHash(previousHash);
        event.setEventHash(currentHash);

        return auditEventRepository.save(event);
    }

    private String calculateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 message digest not available in JVM", e);
        }
    }
}
