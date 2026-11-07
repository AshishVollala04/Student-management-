package com.futureschool.student.domain;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.SchoolClass;
import com.futureschool.academic.domain.Section;
import com.futureschool.identity.domain.User;
import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "admission_applications")
public class AdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "application_id", updatable = false, nullable = false)
    private UUID applicationId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotBlank
    @Column(name = "application_number", nullable = false, length = 64)
    private String applicationNumber;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_academic_year_id", nullable = false)
    private AcademicYear targetAcademicYear;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_class_id", nullable = false)
    private SchoolClass targetClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_section_id")
    private Section targetSection;

    @NotBlank
    @Column(name = "first_name", nullable = false, length = 128)
    private String firstName;

    @Column(name = "middle_name", length = 128)
    private String middleName;

    @NotBlank
    @Column(name = "last_name", nullable = false, length = 128)
    private String lastName;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank
    @Column(name = "gender", nullable = false, length = 16)
    private String gender;

    @Column(name = "blood_group", length = 8)
    private String bloodGroup;

    @Column(name = "medical_alerts", columnDefinition = "TEXT")
    private String medicalAlerts;

    @Column(name = "nationality", length = 64)
    private String nationality;

    @Column(name = "religion", length = 64)
    private String religion;

    @Column(name = "category", length = 32)
    private String category;

    @Column(name = "current_address", columnDefinition = "TEXT")
    private String currentAddress;

    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "previous_school_name", length = 255)
    private String previousSchoolName;

    @Column(name = "previous_grade", length = 64)
    private String previousGrade;

    @Column(name = "previous_tc_number", length = 64)
    private String previousTcNumber;

    @Column(name = "previous_academic_percentage", precision = 5, scale = 2)
    private BigDecimal previousAcademicPercentage;

    @Column(name = "father_name", length = 128)
    private String fatherName;

    @Column(name = "father_phone", length = 32)
    private String fatherPhone;

    @Column(name = "father_email", length = 255)
    private String fatherEmail;

    @Column(name = "father_occupation", length = 128)
    private String fatherOccupation;

    @Column(name = "mother_name", length = 128)
    private String motherName;

    @Column(name = "mother_phone", length = 32)
    private String motherPhone;

    @Column(name = "mother_email", length = 255)
    private String motherEmail;

    @Column(name = "mother_occupation", length = 128)
    private String motherOccupation;

    @Column(name = "guardian_name", length = 128)
    private String guardianName;

    @Column(name = "guardian_phone", length = 32)
    private String guardianPhone;

    @Column(name = "guardian_email", length = 255)
    private String guardianEmail;

    @Column(name = "guardian_relation", length = 64)
    private String guardianRelation;

    @Column(name = "primary_contact", nullable = false, length = 32)
    private String primaryContact = "FATHER";

    @Column(name = "emergency_contact_number", length = 32)
    private String emergencyContactNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private AdmissionStatus status = AdmissionStatus.DRAFT;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "return_reason", columnDefinition = "TEXT")
    private String returnReason;

    @Column(name = "approval_notes", columnDefinition = "TEXT")
    private String approvalNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activated_student_id")
    private Student activatedStudent;

    @Column(name = "activated_at")
    private Instant activatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activated_by")
    private User activatedBy;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public AdmissionApplication() {
    }

    public AdmissionApplication(School school, String applicationNumber, AcademicYear targetAcademicYear,
                                SchoolClass targetClass, String firstName, String lastName,
                                LocalDate dateOfBirth, String gender) {
        this.school = school;
        this.applicationNumber = applicationNumber;
        this.targetAcademicYear = targetAcademicYear;
        this.targetClass = targetClass;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
    }

    public UUID getApplicationId() {
        return applicationId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public AcademicYear getTargetAcademicYear() {
        return targetAcademicYear;
    }

    public void setTargetAcademicYear(AcademicYear targetAcademicYear) {
        this.targetAcademicYear = targetAcademicYear;
    }

    public SchoolClass getTargetClass() {
        return targetClass;
    }

    public void setTargetClass(SchoolClass targetClass) {
        this.targetClass = targetClass;
    }

    public Section getTargetSection() {
        return targetSection;
    }

    public void setTargetSection(Section targetSection) {
        this.targetSection = targetSection;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getMedicalAlerts() {
        return medicalAlerts;
    }

    public void setMedicalAlerts(String medicalAlerts) {
        this.medicalAlerts = medicalAlerts;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCurrentAddress() {
        return currentAddress;
    }

    public void setCurrentAddress(String currentAddress) {
        this.currentAddress = currentAddress;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getPreviousSchoolName() {
        return previousSchoolName;
    }

    public void setPreviousSchoolName(String previousSchoolName) {
        this.previousSchoolName = previousSchoolName;
    }

    public String getPreviousGrade() {
        return previousGrade;
    }

    public void setPreviousGrade(String previousGrade) {
        this.previousGrade = previousGrade;
    }

    public String getPreviousTcNumber() {
        return previousTcNumber;
    }

    public void setPreviousTcNumber(String previousTcNumber) {
        this.previousTcNumber = previousTcNumber;
    }

    public BigDecimal getPreviousAcademicPercentage() {
        return previousAcademicPercentage;
    }

    public void setPreviousAcademicPercentage(BigDecimal previousAcademicPercentage) {
        this.previousAcademicPercentage = previousAcademicPercentage;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getFatherPhone() {
        return fatherPhone;
    }

    public void setFatherPhone(String fatherPhone) {
        this.fatherPhone = fatherPhone;
    }

    public String getFatherEmail() {
        return fatherEmail;
    }

    public void setFatherEmail(String fatherEmail) {
        this.fatherEmail = fatherEmail;
    }

    public String getFatherOccupation() {
        return fatherOccupation;
    }

    public void setFatherOccupation(String fatherOccupation) {
        this.fatherOccupation = fatherOccupation;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getMotherPhone() {
        return motherPhone;
    }

    public void setMotherPhone(String motherPhone) {
        this.motherPhone = motherPhone;
    }

    public String getMotherEmail() {
        return motherEmail;
    }

    public void setMotherEmail(String motherEmail) {
        this.motherEmail = motherEmail;
    }

    public String getMotherOccupation() {
        return motherOccupation;
    }

    public void setMotherOccupation(String motherOccupation) {
        this.motherOccupation = motherOccupation;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }

    public String getGuardianEmail() {
        return guardianEmail;
    }

    public void setGuardianEmail(String guardianEmail) {
        this.guardianEmail = guardianEmail;
    }

    public String getGuardianRelation() {
        return guardianRelation;
    }

    public void setGuardianRelation(String guardianRelation) {
        this.guardianRelation = guardianRelation;
    }

    public String getPrimaryContact() {
        return primaryContact;
    }

    public void setPrimaryContact(String primaryContact) {
        this.primaryContact = primaryContact;
    }

    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    public AdmissionStatus getStatus() {
        return status;
    }

    public void setStatus(AdmissionStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getApprovalNotes() {
        return approvalNotes;
    }

    public void setApprovalNotes(String approvalNotes) {
        this.approvalNotes = approvalNotes;
    }

    public User getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }

    public Instant getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Instant approvedAt) {
        this.approvedAt = approvedAt;
    }

    public Student getActivatedStudent() {
        return activatedStudent;
    }

    public void setActivatedStudent(Student activatedStudent) {
        this.activatedStudent = activatedStudent;
    }

    public Instant getActivatedAt() {
        return activatedAt;
    }

    public void setActivatedAt(Instant activatedAt) {
        this.activatedAt = activatedAt;
    }

    public User getActivatedBy() {
        return activatedBy;
    }

    public void setActivatedBy(User activatedBy) {
        this.activatedBy = activatedBy;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
