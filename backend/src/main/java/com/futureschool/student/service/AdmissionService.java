package com.futureschool.student.service;

import com.futureschool.academic.domain.*;
import com.futureschool.common.audit.AuditService;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.PasswordService;
import com.futureschool.identity.domain.AccountStatus;
import com.futureschool.identity.domain.Role;
import com.futureschool.identity.domain.RoleRepository;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.student.domain.*;
import com.futureschool.student.dto.StudentDtos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class AdmissionService {

    private final AdmissionApplicationRepository applicationRepository;
    private final AdmissionDocumentRepository documentRepository;
    private final ParentGuardianRepository guardianRepository;
    private final FamilyRelationshipRepository familyRelationshipRepository;
    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final SchoolRepository schoolRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordService passwordService;
    private final AuditService auditService;

    public AdmissionService(
            AdmissionApplicationRepository applicationRepository,
            AdmissionDocumentRepository documentRepository,
            ParentGuardianRepository guardianRepository,
            FamilyRelationshipRepository familyRelationshipRepository,
            StudentRepository studentRepository,
            StudentEnrollmentRepository studentEnrollmentRepository,
            SchoolRepository schoolRepository,
            AcademicYearRepository academicYearRepository,
            SchoolClassRepository schoolClassRepository,
            SectionRepository sectionRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordService passwordService,
            AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.guardianRepository = guardianRepository;
        this.familyRelationshipRepository = familyRelationshipRepository;
        this.studentRepository = studentRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.schoolRepository = schoolRepository;
        this.academicYearRepository = academicYearRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.sectionRepository = sectionRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordService = passwordService;
        this.auditService = auditService;
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse createDraft(
            UUID schoolId, StudentDtos.AdmissionDraftRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        User actor = getUser(actorUserId);

        AcademicYear academicYear = academicYearRepository.findBySchoolAndAcademicYearId(school, req.targetAcademicYearId())
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (academicYear.getStatus() == AcademicYearStatus.CLOSED || academicYear.getStatus() == AcademicYearStatus.ARCHIVED) {
            throw ApiException.conflict("ACADEMIC_YEAR_CLOSED", "Cannot admit students into a closed or archived academic year");
        }

        SchoolClass schoolClass = schoolClassRepository.findBySchoolAndClassId(school, req.targetClassId())
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "School class not found"));

        Section section = null;
        if (req.targetSectionId() != null) {
            section = sectionRepository.findBySchoolAndSectionId(school, req.targetSectionId())
                    .orElseThrow(() -> ApiException.notFound("SECTION_NOT_FOUND", "Section not found"));
            if (!section.getSchoolClass().getClassId().equals(schoolClass.getClassId())) {
                throw ApiException.badRequest("SECTION_CLASS_MISMATCH", "Section does not belong to specified class");
            }
        }

        String appNumber = generateUniqueApplicationNumber(school, academicYear);

        AdmissionApplication app = new AdmissionApplication(
                school, appNumber, academicYear, schoolClass, req.firstName(), req.lastName(), req.dateOfBirth(), req.gender());
        app.setMiddleName(req.middleName());
        app.setTargetSection(section);
        app.setBloodGroup(req.bloodGroup());
        app.setMedicalAlerts(req.medicalAlerts());
        app.setNationality(req.nationality());
        app.setReligion(req.religion());
        app.setCategory(req.category());
        app.setCurrentAddress(req.currentAddress());
        app.setPermanentAddress(req.permanentAddress());
        app.setPreviousSchoolName(req.previousSchoolName());
        app.setPreviousGrade(req.previousGrade());
        app.setPreviousTcNumber(req.previousTcNumber());
        app.setPreviousAcademicPercentage(req.previousAcademicPercentage());

        app.setFatherName(req.fatherName());
        app.setFatherPhone(req.fatherPhone());
        app.setFatherEmail(req.fatherEmail());
        app.setFatherOccupation(req.fatherOccupation());

        app.setMotherName(req.motherName());
        app.setMotherPhone(req.motherPhone());
        app.setMotherEmail(req.motherEmail());
        app.setMotherOccupation(req.motherOccupation());

        app.setGuardianName(req.guardianName());
        app.setGuardianPhone(req.guardianPhone());
        app.setGuardianEmail(req.guardianEmail());
        app.setGuardianRelation(req.guardianRelation());

        app.setPrimaryContact(req.primaryContact() != null ? req.primaryContact() : "FATHER");
        app.setEmergencyContactNumber(req.emergencyContactNumber());
        app.setStatus(AdmissionStatus.DRAFT);

        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_DRAFT_CREATED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), null, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse updateDraft(
            UUID schoolId, UUID applicationId, StudentDtos.AdmissionDraftRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() != AdmissionStatus.DRAFT && app.getStatus() != AdmissionStatus.RETURNED) {
            throw ApiException.conflict("INVALID_APPLICATION_STATUS", "Only DRAFT or RETURNED applications can be modified");
        }

        AcademicYear academicYear = academicYearRepository.findBySchoolAndAcademicYearId(school, req.targetAcademicYearId())
                .orElseThrow(() -> ApiException.notFound("ACADEMIC_YEAR_NOT_FOUND", "Academic year not found"));

        if (academicYear.getStatus() == AcademicYearStatus.CLOSED || academicYear.getStatus() == AcademicYearStatus.ARCHIVED) {
            throw ApiException.conflict("ACADEMIC_YEAR_CLOSED", "Target academic year is closed or archived");
        }

        SchoolClass schoolClass = schoolClassRepository.findBySchoolAndClassId(school, req.targetClassId())
                .orElseThrow(() -> ApiException.notFound("CLASS_NOT_FOUND", "School class not found"));

        Section section = null;
        if (req.targetSectionId() != null) {
            section = sectionRepository.findBySchoolAndSectionId(school, req.targetSectionId())
                    .orElseThrow(() -> ApiException.notFound("SECTION_NOT_FOUND", "Section not found"));
            if (!section.getSchoolClass().getClassId().equals(schoolClass.getClassId())) {
                throw ApiException.badRequest("SECTION_CLASS_MISMATCH", "Section does not belong to specified class");
            }
        }

        String prevState = app.getStatus().name();

        app.setTargetAcademicYear(academicYear);
        app.setTargetClass(schoolClass);
        app.setTargetSection(section);
        app.setFirstName(req.firstName());
        app.setMiddleName(req.middleName());
        app.setLastName(req.lastName());
        app.setDateOfBirth(req.dateOfBirth());
        app.setGender(req.gender());
        app.setBloodGroup(req.bloodGroup());
        app.setMedicalAlerts(req.medicalAlerts());
        app.setNationality(req.nationality());
        app.setReligion(req.religion());
        app.setCategory(req.category());
        app.setCurrentAddress(req.currentAddress());
        app.setPermanentAddress(req.permanentAddress());
        app.setPreviousSchoolName(req.previousSchoolName());
        app.setPreviousGrade(req.previousGrade());
        app.setPreviousTcNumber(req.previousTcNumber());
        app.setPreviousAcademicPercentage(req.previousAcademicPercentage());

        app.setFatherName(req.fatherName());
        app.setFatherPhone(req.fatherPhone());
        app.setFatherEmail(req.fatherEmail());
        app.setFatherOccupation(req.fatherOccupation());

        app.setMotherName(req.motherName());
        app.setMotherPhone(req.motherPhone());
        app.setMotherEmail(req.motherEmail());
        app.setMotherOccupation(req.motherOccupation());

        app.setGuardianName(req.guardianName());
        app.setGuardianPhone(req.guardianPhone());
        app.setGuardianEmail(req.guardianEmail());
        app.setGuardianRelation(req.guardianRelation());

        if (req.primaryContact() != null) {
            app.setPrimaryContact(req.primaryContact());
        }
        app.setEmergencyContactNumber(req.emergencyContactNumber());

        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_DRAFT_UPDATED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse submitApplication(
            UUID schoolId, UUID applicationId, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() != AdmissionStatus.DRAFT && app.getStatus() != AdmissionStatus.RETURNED) {
            throw ApiException.conflict("INVALID_APPLICATION_STATUS", "Application cannot be submitted from status " + app.getStatus());
        }

        String prevState = app.getStatus().name();
        app.setStatus(AdmissionStatus.AWAITING_APPROVAL);
        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_SUBMITTED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse approveApplication(
            UUID schoolId, UUID applicationId, StudentDtos.ApprovalActionRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() != AdmissionStatus.AWAITING_APPROVAL && app.getStatus() != AdmissionStatus.SUBMITTED) {
            throw ApiException.conflict("INVALID_APPLICATION_STATUS", "Only submitted/awaiting approval applications can be approved");
        }

        User approver = getUser(actorUserId);
        String prevState = app.getStatus().name();

        app.setStatus(AdmissionStatus.APPROVED);
        app.setApprovedBy(approver);
        app.setApprovedAt(Instant.now());
        if (req != null && req.notes() != null) {
            app.setApprovalNotes(req.notes());
        }

        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_APPROVED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse returnApplication(
            UUID schoolId, UUID applicationId, StudentDtos.ReturnActionRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() == AdmissionStatus.ACTIVE || app.getStatus() == AdmissionStatus.REJECTED) {
            throw ApiException.conflict("INVALID_APPLICATION_STATUS", "Cannot return an active or rejected application");
        }

        String prevState = app.getStatus().name();
        app.setStatus(AdmissionStatus.RETURNED);
        app.setReturnReason(req.reason());
        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_RETURNED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse rejectApplication(
            UUID schoolId, UUID applicationId, StudentDtos.RejectionActionRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() == AdmissionStatus.ACTIVE) {
            throw ApiException.conflict("INVALID_APPLICATION_STATUS", "Cannot reject an already active/enrolled student application");
        }

        String prevState = app.getStatus().name();
        app.setStatus(AdmissionStatus.REJECTED);
        app.setRejectionReason(req.reason());
        app = applicationRepository.save(app);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_REJECTED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionApplicationResponse activateApplication(
            UUID schoolId, UUID applicationId, StudentDtos.ActivationRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        if (app.getStatus() == AdmissionStatus.ACTIVE) {
            throw ApiException.conflict("APPLICATION_ALREADY_ACTIVE", "This admission application has already been activated");
        }

        if (app.getStatus() != AdmissionStatus.APPROVED && app.getStatus() != AdmissionStatus.READY_FOR_ACTIVATION) {
            throw ApiException.badRequest("APPLICATION_NOT_APPROVED",
                    "Application must be approved prior to activation (current status: " + app.getStatus() + ")");
        }

        AcademicYear academicYear = app.getTargetAcademicYear();
        if (academicYear.getStatus() == AcademicYearStatus.CLOSED || academicYear.getStatus() == AcademicYearStatus.ARCHIVED) {
            throw ApiException.conflict("ACADEMIC_YEAR_CLOSED", "Target academic year is closed or archived");
        }

        SchoolClass schoolClass = app.getTargetClass();

        // Determine Section
        Section section = null;
        if (req != null && req.sectionId() != null) {
            section = sectionRepository.findBySchoolAndSectionId(school, req.sectionId())
                    .orElseThrow(() -> ApiException.notFound("SECTION_NOT_FOUND", "Designated section not found"));
        } else if (app.getTargetSection() != null) {
            section = app.getTargetSection();
        } else {
            // Pick first active section of class
            List<Section> sections = sectionRepository.findBySchoolClassAndStatusOrderByDisplayOrderAscNameAsc(schoolClass, SectionStatus.ACTIVE);
            if (sections.isEmpty()) {
                throw ApiException.badRequest("NO_ACTIVE_SECTION", "Class has no active sections available for enrollment");
            }
            section = sections.get(0);
        }

        if (!section.getSchoolClass().getClassId().equals(schoolClass.getClassId())) {
            throw ApiException.badRequest("SECTION_CLASS_MISMATCH", "Section does not belong to target class");
        }

        // Section Capacity Check
        long currentEnrolled = studentEnrollmentRepository.countBySectionAndAcademicYearAndStatus(section, academicYear, "ACTIVE");
        if (currentEnrolled >= section.getMaxCapacity()) {
            throw ApiException.conflict("CAPACITY_EXCEEDED",
                    "Section " + section.getName() + " has reached maximum capacity of " + section.getMaxCapacity());
        }

        User activator = getUser(actorUserId);
        String prevState = app.getStatus().name();

        // 1. Generate unique Student Number and Admission Number
        String studentNumber = generateUniqueStudentNumber(school, academicYear);
        String admissionNumber = generateUniqueAdmissionNumber(school, academicYear);

        // 2. Create Student Entity
        Student student = new Student(
                school, studentNumber, admissionNumber, app.getFirstName(), app.getLastName(),
                app.getDateOfBirth(), app.getGender());
        student.setMiddleName(app.getMiddleName());
        student.setBloodGroup(app.getBloodGroup());
        student.setMedicalAlerts(app.getMedicalAlerts());
        student.setCurrentAddress(app.getCurrentAddress());
        student.setPermanentAddress(app.getPermanentAddress());
        student.setNationality(app.getNationality());
        student.setReligion(app.getReligion());
        student.setCategory(app.getCategory());
        student.setEmergencyContact(app.getEmergencyContactNumber() != null ? app.getEmergencyContactNumber() :
                (app.getFatherPhone() != null ? app.getFatherPhone() : app.getMotherPhone()));
        student.setStatus(StudentStatus.ACTIVE);

        student = studentRepository.save(student);

        // 3. Create Student Enrollment
        String rollNumber = (req != null && req.rollNumber() != null && !req.rollNumber().isBlank())
                ? req.rollNumber()
                : String.valueOf(currentEnrolled + 1);

        StudentEnrollment enrollment = new StudentEnrollment(
                school, student, academicYear, schoolClass, section, rollNumber);
        studentEnrollmentRepository.save(enrollment);

        // 4. Create Guardians & Family Relationships
        createGuardiansAndRelationships(school, student, app);

        // 5. Re-link application documents to the student
        List<AdmissionDocument> docs = documentRepository.findByApplicationOrderByCreatedAtAsc(app);
        for (AdmissionDocument doc : docs) {
            doc.setStudent(student);
            documentRepository.save(doc);
        }

        // 6. Create Portal User Account for Student & Parent Login
        if (userRepository.findBySchoolAndLoginId(school, studentNumber).isEmpty()) {
            String initialPwd = (req != null && req.initialPassword() != null && !req.initialPassword().isBlank())
                    ? req.initialPassword() : "Student123!";
            String pwdHash = passwordService.hashPassword(initialPwd);

            User studentUser = new User(school, studentNumber, student.getFirstName() + " " + student.getLastName(),
                    pwdHash, AccountStatus.ACTIVE);

            Role studentRole = roleRepository.findByRoleName("ROLE_STUDENT").orElse(null);
            Role parentRole = roleRepository.findByRoleName("ROLE_PARENT").orElse(null);

            Set<Role> roles = new HashSet<>();
            if (studentRole != null) roles.add(studentRole);
            if (parentRole != null) roles.add(parentRole);
            studentUser.setRoles(roles);

            userRepository.save(studentUser);
        }

        // 7. Update Application
        app.setStatus(AdmissionStatus.ACTIVE);
        app.setActivatedStudent(student);
        app.setActivatedAt(Instant.now());
        app.setActivatedBy(activator);
        app.setTargetSection(section);
        app = applicationRepository.save(app);

        // 8. Audit event
        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "ADMISSION_ACTIVATED", "ADMISSIONS",
                "ADMISSION_APPLICATION", app.getApplicationId().toString(), prevState, app.getStatus().name());

        return toResponse(app);
    }

    @Transactional
    public StudentDtos.AdmissionDocumentResponse uploadDocument(
            UUID schoolId, UUID applicationId, StudentDtos.DocumentUploadRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));

        AdmissionDocument doc = new AdmissionDocument(school, req.documentType(), req.fileName(), req.fileUrl());
        doc.setApplication(app);
        doc.setStudent(app.getActivatedStudent());
        doc.setFileSizeBytes(req.fileSizeBytes());
        doc.setMimeType(req.mimeType());
        doc.setVerificationStatus(VerificationStatus.PENDING);

        doc = documentRepository.save(doc);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "DOCUMENT_UPLOADED", "ADMISSIONS",
                "ADMISSION_DOCUMENT", doc.getDocumentId().toString(), null, doc.getDocumentType().name());

        return toDocResponse(doc);
    }

    @Transactional
    public StudentDtos.AdmissionDocumentResponse verifyDocument(
            UUID schoolId, UUID documentId, StudentDtos.DocumentVerificationRequest req, UUID actorUserId, String actorLoginId) {
        School school = getSchool(schoolId);
        AdmissionDocument doc = documentRepository.findBySchoolAndDocumentId(school, documentId)
                .orElseThrow(() -> ApiException.notFound("DOCUMENT_NOT_FOUND", "Document not found"));

        User actor = getUser(actorUserId);
        String prev = doc.getVerificationStatus().name();

        doc.setVerificationStatus(req.status());
        doc.setVerifiedBy(actor);
        doc.setVerifiedAt(Instant.now());
        doc.setVerificationNotes(req.notes());

        doc = documentRepository.save(doc);

        auditService.recordSimpleEvent(
                school, actorUserId, actorLoginId, "DOCUMENT_VERIFIED", "ADMISSIONS",
                "ADMISSION_DOCUMENT", doc.getDocumentId().toString(), prev, doc.getVerificationStatus().name());

        return toDocResponse(doc);
    }

    @Transactional(readOnly = true)
    public StudentDtos.AdmissionApplicationResponse getApplication(UUID schoolId, UUID applicationId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));
        return toResponse(app);
    }

    @Transactional(readOnly = true)
    public List<StudentDtos.AdmissionApplicationResponse> listApplications(UUID schoolId, AdmissionStatus status) {
        School school = getSchool(schoolId);
        List<AdmissionApplication> list;
        if (status != null) {
            list = applicationRepository.findBySchoolAndStatusOrderByCreatedAtDesc(school, status);
        } else {
            list = applicationRepository.findBySchoolOrderByCreatedAtDesc(school);
        }
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<StudentDtos.AdmissionDocumentResponse> getApplicationDocuments(UUID schoolId, UUID applicationId) {
        School school = getSchool(schoolId);
        AdmissionApplication app = applicationRepository.findBySchoolAndApplicationId(school, applicationId)
                .orElseThrow(() -> ApiException.notFound("APPLICATION_NOT_FOUND", "Admission application not found"));
        return documentRepository.findByApplicationOrderByCreatedAtAsc(app).stream()
                .map(this::toDocResponse).toList();
    }

    private void createGuardiansAndRelationships(School school, Student student, AdmissionApplication app) {
        boolean fatherIsPrimary = "FATHER".equalsIgnoreCase(app.getPrimaryContact());
        boolean motherIsPrimary = "MOTHER".equalsIgnoreCase(app.getPrimaryContact());
        boolean guardianIsPrimary = "GUARDIAN".equalsIgnoreCase(app.getPrimaryContact());

        if (app.getFatherName() != null && !app.getFatherName().isBlank()) {
            String phone = (app.getFatherPhone() != null && !app.getFatherPhone().isBlank())
                    ? app.getFatherPhone() : "N/A-" + student.getStudentNumber();
            ParentGuardian father = guardianRepository.findBySchoolAndPhone(school, phone)
                    .orElseGet(() -> {
                        ParentGuardian g = new ParentGuardian(school, app.getFatherName(), "", phone);
                        g.setEmail(app.getFatherEmail());
                        g.setOccupation(app.getFatherOccupation());
                        g.setAddress(app.getCurrentAddress());
                        return guardianRepository.save(g);
                    });

            familyRelationshipRepository.save(new FamilyRelationship(
                    school, student, father, RelationshipType.FATHER, fatherIsPrimary));
        }

        if (app.getMotherName() != null && !app.getMotherName().isBlank()) {
            String phone = (app.getMotherPhone() != null && !app.getMotherPhone().isBlank())
                    ? app.getMotherPhone() : "N/A-M-" + student.getStudentNumber();
            ParentGuardian mother = guardianRepository.findBySchoolAndPhone(school, phone)
                    .orElseGet(() -> {
                        ParentGuardian g = new ParentGuardian(school, app.getMotherName(), "", phone);
                        g.setEmail(app.getMotherEmail());
                        g.setOccupation(app.getMotherOccupation());
                        g.setAddress(app.getCurrentAddress());
                        return guardianRepository.save(g);
                    });

            familyRelationshipRepository.save(new FamilyRelationship(
                    school, student, mother, RelationshipType.MOTHER, motherIsPrimary));
        }

        if (app.getGuardianName() != null && !app.getGuardianName().isBlank()) {
            String phone = (app.getGuardianPhone() != null && !app.getGuardianPhone().isBlank())
                    ? app.getGuardianPhone() : "N/A-G-" + student.getStudentNumber();
            ParentGuardian guardian = guardianRepository.findBySchoolAndPhone(school, phone)
                    .orElseGet(() -> {
                        ParentGuardian g = new ParentGuardian(school, app.getGuardianName(), "", phone);
                        g.setEmail(app.getGuardianEmail());
                        g.setAddress(app.getCurrentAddress());
                        return guardianRepository.save(g);
                    });

            familyRelationshipRepository.save(new FamilyRelationship(
                    school, student, guardian, RelationshipType.GUARDIAN, guardianIsPrimary));
        }
    }

    private String generateUniqueApplicationNumber(School school, AcademicYear ay) {
        String yearPrefix = cleanCode(ay.getCode());
        long count = applicationRepository.countBySchoolAndTargetAcademicYear(school, ay) + 1;
        while (true) {
            String candidate = String.format("APP-%s-%s-%04d", school.getSchoolCode(), yearPrefix, count);
            if (!applicationRepository.existsBySchoolAndApplicationNumber(school, candidate)) {
                return candidate;
            }
            count++;
        }
    }

    private String generateUniqueStudentNumber(School school, AcademicYear ay) {
        String yearPrefix = cleanCode(ay.getCode());
        long count = studentRepository.countBySchool(school) + 1;
        while (true) {
            String candidate = String.format("%s-%s-%04d", school.getSchoolCode(), yearPrefix, count);
            if (!studentRepository.existsBySchoolAndStudentNumber(school, candidate)) {
                return candidate;
            }
            count++;
        }
    }

    private String generateUniqueAdmissionNumber(School school, AcademicYear ay) {
        String yearPrefix = cleanCode(ay.getCode());
        long count = studentRepository.countBySchool(school) + 1;
        while (true) {
            String candidate = String.format("ADM-%s-%s-%04d", school.getSchoolCode(), yearPrefix, count);
            if (!studentRepository.existsBySchoolAndAdmissionNumber(school, candidate)) {
                return candidate;
            }
            count++;
        }
    }

    private String cleanCode(String code) {
        if (code == null) return "2027";
        return code.replaceAll("[^0-9]", "");
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School tenant not found"));
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User not found"));
    }

    private StudentDtos.AdmissionApplicationResponse toResponse(AdmissionApplication app) {
        String fullName = app.getFirstName() + (app.getMiddleName() != null ? " " + app.getMiddleName() : "") + " " + app.getLastName();
        return new StudentDtos.AdmissionApplicationResponse(
                app.getApplicationId(),
                app.getApplicationNumber(),
                app.getTargetAcademicYear().getAcademicYearId(),
                app.getTargetAcademicYear().getName(),
                app.getTargetClass().getClassId(),
                app.getTargetClass().getName(),
                app.getTargetSection() != null ? app.getTargetSection().getSectionId() : null,
                app.getTargetSection() != null ? app.getTargetSection().getName() : null,
                app.getFirstName(),
                app.getMiddleName(),
                app.getLastName(),
                fullName,
                app.getDateOfBirth(),
                app.getGender(),
                app.getBloodGroup(),
                app.getMedicalAlerts(),
                app.getNationality(),
                app.getReligion(),
                app.getCategory(),
                app.getCurrentAddress(),
                app.getPermanentAddress(),
                app.getPreviousSchoolName(),
                app.getPreviousGrade(),
                app.getPreviousTcNumber(),
                app.getPreviousAcademicPercentage(),
                app.getFatherName(),
                app.getFatherPhone(),
                app.getFatherEmail(),
                app.getFatherOccupation(),
                app.getMotherName(),
                app.getMotherPhone(),
                app.getMotherEmail(),
                app.getMotherOccupation(),
                app.getGuardianName(),
                app.getGuardianPhone(),
                app.getGuardianEmail(),
                app.getGuardianRelation(),
                app.getPrimaryContact(),
                app.getEmergencyContactNumber(),
                app.getStatus(),
                app.getRejectionReason(),
                app.getReturnReason(),
                app.getApprovalNotes(),
                app.getApprovedBy() != null ? app.getApprovedBy().getDisplayName() : null,
                app.getApprovedAt(),
                app.getActivatedStudent() != null ? app.getActivatedStudent().getStudentNumber() : null,
                app.getActivatedAt(),
                app.getCreatedAt(),
                app.getUpdatedAt()
        );
    }

    private StudentDtos.AdmissionDocumentResponse toDocResponse(AdmissionDocument doc) {
        return new StudentDtos.AdmissionDocumentResponse(
                doc.getDocumentId(),
                doc.getDocumentType(),
                doc.getFileName(),
                doc.getFileUrl(),
                doc.getFileSizeBytes(),
                doc.getMimeType(),
                doc.getVerificationStatus(),
                doc.getVerifiedBy() != null ? doc.getVerifiedBy().getDisplayName() : null,
                doc.getVerifiedAt(),
                doc.getVerificationNotes(),
                doc.getCreatedAt()
        );
    }
}
