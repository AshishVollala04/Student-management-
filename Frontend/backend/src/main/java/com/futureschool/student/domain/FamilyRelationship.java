package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "family_relationships")
public class FamilyRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "relationship_id", updatable = false, nullable = false)
    private UUID relationshipId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id", nullable = false)
    private ParentGuardian guardian;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false, length = 32)
    private RelationshipType relationshipType;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary = false;

    @Column(name = "can_pickup", nullable = false)
    private boolean canPickup = true;

    @Column(name = "receives_billing_notifications", nullable = false)
    private boolean receivesBillingNotifications = true;

    @Column(name = "receives_academic_notifications", nullable = false)
    private boolean receivesAcademicNotifications = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public FamilyRelationship() {
    }

    public FamilyRelationship(School school, Student student, ParentGuardian guardian, RelationshipType relationshipType, boolean isPrimary) {
        this.school = school;
        this.student = student;
        this.guardian = guardian;
        this.relationshipType = relationshipType;
        this.isPrimary = isPrimary;
    }

    public UUID getRelationshipId() {
        return relationshipId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public ParentGuardian getGuardian() {
        return guardian;
    }

    public void setGuardian(ParentGuardian guardian) {
        this.guardian = guardian;
    }

    public RelationshipType getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(RelationshipType relationshipType) {
        this.relationshipType = relationshipType;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public boolean isCanPickup() {
        return canPickup;
    }

    public void setCanPickup(boolean canPickup) {
        this.canPickup = canPickup;
    }

    public boolean isReceivesBillingNotifications() {
        return receivesBillingNotifications;
    }

    public void setReceivesBillingNotifications(boolean receivesBillingNotifications) {
        this.receivesBillingNotifications = receivesBillingNotifications;
    }

    public boolean isReceivesAcademicNotifications() {
        return receivesAcademicNotifications;
    }

    public void setReceivesAcademicNotifications(boolean receivesAcademicNotifications) {
        this.receivesAcademicNotifications = receivesAcademicNotifications;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
