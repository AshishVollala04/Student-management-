package com.futureschool.common.audit;

import com.futureschool.platform.school.domain.School;

import java.util.UUID;

/**
 * Audit service interface for publishing immutable audit events.
 */
public interface AuditService {

    AuditEvent recordEvent(
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
    );

    default AuditEvent recordSimpleEvent(
            School school,
            UUID actorUserId,
            String actorLoginId,
            String action,
            String module,
            String entityType,
            String entityId,
            String previousState,
            String newState
    ) {
        return recordEvent(
                school,
                actorUserId,
                actorLoginId,
                "ADMIN",
                "PERM_ACADEMIC_OPERATIONS",
                action,
                module,
                entityType,
                entityId,
                previousState,
                newState,
                null,
                java.util.UUID.randomUUID().toString(),
                java.util.UUID.randomUUID().toString(),
                "OPERATIONAL",
                "INFO"
        );
    }
}
