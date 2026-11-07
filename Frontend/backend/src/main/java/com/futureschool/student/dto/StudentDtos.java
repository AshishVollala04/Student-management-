package com.futureschool.student.dto;

import com.futureschool.student.domain.AdmissionStatus;
import com.futureschool.student.domain.DocumentType;
import com.futureschool.student.domain.ProfileChangeStatus;
import com.futureschool.student.domain.StudentStatus;
import com.futureschool.student.domain.VerificationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class StudentDtos {

    public record AdmissionDraftRequest(
            @NotNull(message = "Target academic year is required")
            UUID targetAcademicYearId,

            @NotNull(message = "Target class is required")
            UUID targetClassId,

            UUID targetSectionId,

            @NotBlank(message = "First name is required")
            String firstName,

            String middleName,

            @NotBlank(message = "Last name is required")
            String lastName,

            @NotNull(message = "Date of birth is required")
            LocalDate dateOfBirth,

            @NotBlank(message = "Gender is required")
            String gender,

            String bloodGroup,
            String medicalAlerts,
            String nationality,
            String religion,
            String category,
            String currentAddress,
            String permanentAddress,

            String previousSchoolName,
            String previousGrade,
            String previousTcNumber,
            BigDecimal previousAcademicPercentage,

            String fatherName,
            String fatherPhone,
            String fatherEmail,
            String fatherOccupation,

            String motherName,
            String motherPhone,
            String motherEmail,
            String motherOccupation,

            String guardianName,
            String guardianPhone,
            String guardianEmail,
            String guardianRelation,

            String primaryContact,
            String emergencyContactNumber
    ) {}

    public record AdmissionApplicationResponse(
            UUID applicationId,
            String applicationNumber,
            UUID targetAcademicYearId,
            String targetAcademicYearName,
            UUID targetClassId,
            String targetClassName,
            UUID targetSectionId,
            String targetSectionName,
            String firstName,
            String middleName,
            String lastName,
            String fullName,
            LocalDate dateOfBirth,
            String gender,
            String bloodGroup,
            String medicalAlerts,
            String nationality,
            String religion,
            String category,
            String currentAddress,
            String permanentAddress,
            String previousSchoolName,
            String previousGrade,
            String previousTcNumber,
            BigDecimal previousAcademicPercentage,
            String fatherName,
            String fatherPhone,
            String fatherEmail,
            String fatherOccupation,
            String motherName,
            String motherPhone,
            String motherEmail,
            String motherOccupation,
            String guardianName,
            String guardianPhone,
            String guardianEmail,
            String guardianRelation,
            String primaryContact,
            String emergencyContactNumber,
            AdmissionStatus status,
            String rejectionReason,
            String returnReason,
            String approvalNotes,
            String approvedByName,
            Instant approvedAt,
            String activatedStudentNumber,
            Instant activatedAt,
            Instant createdAt,
            Instant updatedAt
    ) {}

    public record ApprovalActionRequest(
            String notes
    ) {}

    public record RejectionActionRequest(
            @NotBlank(message = "Rejection reason is required")
            String reason
    ) {}

    public record ReturnActionRequest(
            @NotBlank(message = "Return reason is required")
            String reason
    ) {}

    public record ActivationRequest(
            UUID sectionId,
            String rollNumber,
            String initialPassword
    ) {}

    public record DocumentUploadRequest(
            @NotNull(message = "Document type is required")
            DocumentType documentType,

            @NotBlank(message = "File name is required")
            String fileName,

            @NotBlank(message = "File URL is required")
            String fileUrl,

            Long fileSizeBytes,
            String mimeType
    ) {}

    public record DocumentVerificationRequest(
            @NotNull(message = "Verification status is required")
            VerificationStatus status,

            String notes
    ) {}

    public record AdmissionDocumentResponse(
            UUID documentId,
            DocumentType documentType,
            String fileName,
            String fileUrl,
            Long fileSizeBytes,
            String mimeType,
            VerificationStatus verificationStatus,
            String verifiedByName,
            Instant verifiedAt,
            String verificationNotes,
            Instant createdAt
    ) {}

    public record EnrollmentSummaryDto(
            UUID enrollmentId,
            UUID academicYearId,
            String academicYearCode,
            String academicYearName,
            UUID classId,
            String className,
            UUID sectionId,
            String sectionName,
            String rollNumber,
            String status
    ) {}

    public record GuardianSummaryDto(
            UUID guardianId,
            String firstName,
            String lastName,
            String fullName,
            String phone,
            String email,
            String occupation,
            String relationshipType,
            boolean isPrimary,
            boolean canPickup
    ) {}

    public record SiblingSummaryDto(
            UUID studentId,
            String studentNumber,
            String fullName,
            String currentClassName,
            String currentSectionName,
            String linkageReason
    ) {}

    public record Student360Response(
            UUID studentId,
            String studentNumber,
            String admissionNumber,
            String firstName,
            String middleName,
            String lastName,
            String fullName,
            LocalDate dateOfBirth,
            String gender,
            String bloodGroup,
            String medicalAlerts,
            String currentAddress,
            String permanentAddress,
            String nationality,
            String religion,
            String category,
            String aadharOrNationalId,
            String profilePhotoUrl,
            String emergencyContact,
            StudentStatus status,
            EnrollmentSummaryDto currentEnrollment,
            List<EnrollmentSummaryDto> historicalEnrollments,
            List<GuardianSummaryDto> guardians,
            List<SiblingSummaryDto> siblings,
            List<AdmissionDocumentResponse> documents
    ) {}

    public record SubmitProfileChangeRequest(
            @NotBlank(message = "Field name is required")
            String fieldName,

            @NotBlank(message = "Proposed value is required")
            String proposedValue,

            @NotBlank(message = "Reason is required")
            String reason
    ) {}

    public record ReviewProfileChangeRequest(
            @NotNull(message = "Review status is required")
            ProfileChangeStatus status,

            String reviewNotes
    ) {}

    public record ProfileChangeRequestResponse(
            UUID requestId,
            UUID studentId,
            String studentNumber,
            String studentName,
            String fieldName,
            String oldValue,
            String proposedValue,
            String reason,
            ProfileChangeStatus status,
            String requestedByName,
            String reviewedByName,
            Instant reviewedAt,
            String reviewNotes,
            Instant createdAt
    ) {}
}
