package com.futureschool.common.audit;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "audit_event_id", updatable = false, nullable = false)
    private UUID auditEventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @Column(name = "platform_scope", nullable = false)
    private boolean platformScope = false;

    @NotNull
    @Column(name = "actor_user_id", nullable = false)
    private UUID actorUserId;

    @NotBlank
    @Column(name = "actor_login_id", nullable = false, length = 64)
    private String actorLoginId;

    @NotBlank
    @Column(name = "actor_role", nullable = false, length = 32)
    private String actorRole;

    @NotBlank
    @Column(name = "effective_permission", nullable = false, length = 64)
    private String effectivePermission;

    @Column(name = "delegated_authority_id")
    private UUID delegatedAuthorityId;

    @NotBlank
    @Column(name = "action", nullable = false, length = 64)
    private String action;

    @NotBlank
    @Column(name = "module", nullable = false, length = 32)
    private String module;

    @NotBlank
    @Column(name = "entity_type", nullable = false, length = 64)
    private String entityType;

    @NotBlank
    @Column(name = "entity_id", nullable = false, length = 128)
    private String entityId;

    @Column(name = "parent_entity_type", length = 64)
    private String parentEntityType;

    @Column(name = "parent_entity_id", length = 128)
    private String parentEntityId;

    @Column(name = "previous_state", columnDefinition = "TEXT")
    private String previousState;

    @Column(name = "new_state", columnDefinition = "TEXT")
    private String newState;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "approval_reference", length = 128)
    private String approvalReference;

    @Column(name = "policy_version", length = 32)
    private String policyVersion;

    @Column(name = "workflow_state_before", length = 32)
    private String workflowStateBefore;

    @Column(name = "workflow_state_after", length = 32)
    private String workflowStateAfter;

    @NotBlank
    @Column(name = "request_id", nullable = false, length = 64)
    private String requestId;

    @NotBlank
    @Column(name = "correlation_id", nullable = false, length = 64)
    private String correlationId;

    @Column(name = "idempotency_key", length = 64)
    private String idempotencyKey;

    @Column(name = "source_ip", length = 45)
    private String sourceIp;

    @Column(name = "source_user_agent", length = 512)
    private String sourceUserAgent;

    @Column(name = "source_channel", nullable = false, length = 24)
    private String sourceChannel = "WEB_PORTAL";

    @Column(name = "security_classification", nullable = false, length = 24)
    private String securityClassification = "INTERNAL";

    @NotBlank
    @Column(name = "audit_category", nullable = false, length = 32)
    private String auditCategory;

    @Column(name = "severity", nullable = false, length = 16)
    private String severity = "INFO";

    @Column(name = "alert_dispatched", nullable = false)
    private boolean alertDispatched = false;

    @Column(name = "previous_event_hash", nullable = false, length = 64)
    private String previousEventHash = "GENESIS_HASH";

    @NotBlank
    @Column(name = "event_hash", nullable = false, length = 64)
    private String eventHash;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuditEvent() {
    }

    public UUID getAuditEventId() {
        return auditEventId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public boolean isPlatformScope() {
        return platformScope;
    }

    public void setPlatformScope(boolean platformScope) {
        this.platformScope = platformScope;
    }

    public UUID getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(UUID actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getActorLoginId() {
        return actorLoginId;
    }

    public void setActorLoginId(String actorLoginId) {
        this.actorLoginId = actorLoginId;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getEffectivePermission() {
        return effectivePermission;
    }

    public void setEffectivePermission(String effectivePermission) {
        this.effectivePermission = effectivePermission;
    }

    public UUID getDelegatedAuthorityId() {
        return delegatedAuthorityId;
    }

    public void setDelegatedAuthorityId(UUID delegatedAuthorityId) {
        this.delegatedAuthorityId = delegatedAuthorityId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getParentEntityType() {
        return parentEntityType;
    }

    public void setParentEntityType(String parentEntityType) {
        this.parentEntityType = parentEntityType;
    }

    public String getParentEntityId() {
        return parentEntityId;
    }

    public void setParentEntityId(String parentEntityId) {
        this.parentEntityId = parentEntityId;
    }

    public String getPreviousState() {
        return previousState;
    }

    public void setPreviousState(String previousState) {
        this.previousState = previousState;
    }

    public String getNewState() {
        return newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getApprovalReference() {
        return approvalReference;
    }

    public void setApprovalReference(String approvalReference) {
        this.approvalReference = approvalReference;
    }

    public String getPolicyVersion() {
        return policyVersion;
    }

    public void setPolicyVersion(String policyVersion) {
        this.policyVersion = policyVersion;
    }

    public String getWorkflowStateBefore() {
        return workflowStateBefore;
    }

    public void setWorkflowStateBefore(String workflowStateBefore) {
        this.workflowStateBefore = workflowStateBefore;
    }

    public String getWorkflowStateAfter() {
        return workflowStateAfter;
    }

    public void setWorkflowStateAfter(String workflowStateAfter) {
        this.workflowStateAfter = workflowStateAfter;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getSourceUserAgent() {
        return sourceUserAgent;
    }

    public void setSourceUserAgent(String sourceUserAgent) {
        this.sourceUserAgent = sourceUserAgent;
    }

    public String getSourceChannel() {
        return sourceChannel;
    }

    public void setSourceChannel(String sourceChannel) {
        this.sourceChannel = sourceChannel;
    }

    public String getSecurityClassification() {
        return securityClassification;
    }

    public void setSecurityClassification(String securityClassification) {
        this.securityClassification = securityClassification;
    }

    public String getAuditCategory() {
        return auditCategory;
    }

    public void setAuditCategory(String auditCategory) {
        this.auditCategory = auditCategory;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public boolean isAlertDispatched() {
        return alertDispatched;
    }

    public void setAlertDispatched(boolean alertDispatched) {
        this.alertDispatched = alertDispatched;
    }

    public String getPreviousEventHash() {
        return previousEventHash;
    }

    public void setPreviousEventHash(String previousEventHash) {
        this.previousEventHash = previousEventHash;
    }

    public String getEventHash() {
        return eventHash;
    }

    public void setEventHash(String eventHash) {
        this.eventHash = eventHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
