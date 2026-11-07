package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificate_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateRecord {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 64)
    private String certificateNumber; // e.g. "CERT-2026-001"

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "class_name", length = 64)
    private String className;

    @Column(name = "certificate_type", nullable = false, length = 64)
    private String certificateType; // BONAFIDE, TRANSFER_CERTIFICATE, CHARACTER, STUDY

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "issued_by", length = 128)
    private String issuedBy;

    @Column(name = "purpose", length = 255)
    private String purpose;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
