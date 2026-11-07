package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_adm_no", columnList = "admission_number", unique = true),
    @Index(name = "idx_student_class_id", columnList = "class_id"),
    @Index(name = "idx_student_parent_account_id", columnList = "parent_account_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "admission_number", nullable = false, unique = true, length = 64)
    private String admissionNumber;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "dob", length = 32)
    private String dob;

    @Column(name = "gender", length = 16)
    @Builder.Default
    private String gender = "Male";

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "class_name", nullable = false, length = 64)
    private String className;

    @Column(name = "section", nullable = false, length = 16)
    private String section;

    @Column(name = "roll", nullable = false, length = 16)
    private String roll;

    @Column(name = "parent_account_id", length = 64)
    private String parentAccountId;

    @Column(name = "parent_name", length = 128)
    private String parentName;

    @Column(name = "parent_mobile", length = 32)
    private String parentMobile;

    @Column(name = "parent_email", length = 128)
    private String parentEmail;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "district", length = 64)
    private String district;

    @Column(name = "mandal", length = 64)
    private String mandal;

    @Column(name = "pincode", length = 16)
    private String pincode;

    @Column(name = "aadhaar_number", length = 20)
    private String aadhaarNumber;

    @Column(name = "apaar_id", length = 32)
    private String apaarId;

    @Column(name = "blood_group", length = 16)
    private String bloodGroup;

    @Column(name = "caste_category", length = 32)
    private String casteCategory;

    @Column(name = "sub_caste", length = 64)
    private String subCaste;

    @Column(name = "religion", length = 32)
    private String religion;

    @Column(name = "mother_tongue", length = 32)
    private String motherTongue;

    @Column(name = "father_name", length = 128)
    private String fatherName;

    @Column(name = "father_mobile", length = 32)
    private String fatherMobile;

    @Column(name = "father_occupation", length = 128)
    private String fatherOccupation;

    @Column(name = "father_aadhaar", length = 20)
    private String fatherAadhaar;

    @Column(name = "mother_name", length = 128)
    private String motherName;

    @Column(name = "mother_mobile", length = 32)
    private String motherMobile;

    @Column(name = "mother_occupation", length = 128)
    private String motherOccupation;

    @Column(name = "mother_aadhaar", length = 20)
    private String motherAadhaar;

    @Column(name = "medium_of_instruction", length = 32)
    private String mediumOfInstruction;

    @Column(name = "second_language", length = 32)
    private String secondLanguage;

    @Column(name = "previous_school", length = 255)
    private String previousSchool;

    @Column(name = "tc_number", length = 64)
    private String tcNumber;

    @Column(name = "transport_route_id", length = 64)
    private String transportRouteId;

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "Active";

    @Column(name = "fee_balance")
    @Builder.Default
    private Double feeBalance = 0.0;

    @Column(name = "hall_ticket_released")
    @Builder.Default
    private boolean hallTicketReleased = false;

    @Column(name = "hall_ticket_approved")
    @Builder.Default
    private boolean hallTicketApproved = false;

    @Column(name = "exit_date", length = 32)
    private String exitDate;

    @Column(name = "exit_reason", length = 255)
    private String exitReason;

    @Column(name = "destination_school", length = 255)
    private String destinationSchool;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
