package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_transactions", indexes = {
    @Index(name = "idx_fee_student", columnList = "student_id"),
    @Index(name = "idx_fee_receipt", columnList = "receipt_number", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeTransaction {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 64)
    private String receiptNumber;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "payment_method", nullable = false, length = 32)
    @Builder.Default
    private String paymentMethod = "CASH"; // CASH, UPI, CARD, NETBANKING, CHEQUE

    @Column(name = "fee_head", nullable = false, length = 64)
    @Builder.Default
    private String feeHead = "Tuition Fee"; // Tuition Fee, Transport, Lab, Exam, Admission

    @Column(name = "transaction_reference", length = 128)
    private String transactionReference;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @Column(name = "collected_by", length = 64)
    private String collectedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
