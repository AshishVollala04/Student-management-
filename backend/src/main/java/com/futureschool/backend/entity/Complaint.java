package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 64)
    private String ticketNumber; // e.g. "TKT-2026-0001"

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 64)
    @Builder.Default
    private String category = "ACADEMIC"; // ACADEMIC, FEE, TRANSPORT, FACILITIES, OTHER

    @Column(name = "submitted_by_id", nullable = false, length = 64)
    private String submittedById;

    @Column(name = "submitted_by_name", length = 128)
    private String submittedByName;

    @Column(name = "submitted_by_role", length = 32)
    private String submittedByRole; // PARENT, STUDENT, TEACHER

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "priority", length = 16)
    @Builder.Default
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW

    @Column(name = "resolution", columnDefinition = "TEXT")
    private String resolution;

    @Column(name = "assigned_to", length = 128)
    private String assignedTo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
