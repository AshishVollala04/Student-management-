package com.futureschool.student.service;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.AcademicYearRepository;
import com.futureschool.academic.domain.AcademicYearStatus;
import com.futureschool.allocation.domain.ClassTeacherAssignmentRepository;
import com.futureschool.allocation.domain.TeacherSubjectAllocationRepository;
import com.futureschool.common.audit.AuditService;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.staff.domain.Staff;
import com.futureschool.staff.domain.StaffRepository;
import com.futureschool.student.domain.*;
import com.futureschool.student.dto.StudentDtos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Service
public class Student360Service {

    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final FamilyRelationshipRepository familyRelationshipRepository;
    private final AdmissionDocumentRepository documentRepository;
    private final StudentProfileChangeRequestRepository profileChangeRepository;
    private final SchoolRepository schoolRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final TeacherSubjectAllocationRepository teacherAllocationRepository;
    private final ClassTeacherAssignmentRepository classTeacherRepository;
    private final AuditService auditService;

    public Student360Service(
            StudentRepository studentRepository,
            StudentEnrollmentRepository studentEnrollmentRepository,
            FamilyRelationshipRepository familyRelationshipRepository,
            AdmissionDocumentRepository documentRepository,
            StudentProfileChangeRequestRepository profileChangeRepository,
            SchoolRepository schoolRepository,
            AcademicYearRepository academicYearRepository,
            UserRepository userRepository,
            StaffRepository staffRepository,
            TeacherSubjectAllocationRepository teacherAllocationRepository,
            ClassTeacherAssignmentRepository classTeacherRepository,
            AuditService auditService) {
        this.studentRepository = studentRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.familyRelationshipRepository = familyRelationshipRepository;
        this.documentRepository = documentRepository;
        this.profileChangeRepository = profileChangeRepository;
        this.schoolRepository = schoolRepository;
        this.academicYearRepository = academicYearRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.teacherAllocationRepository = teacherAllocationRepository;
        this.classTeacherRepository = classTeacherRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public StudentDtos.Student360Response getStudent360(UUID schoolId, UUID studentId, FutureSchoolPrincipal principal) {
        School school = getSchool(schoolId);
        Student student = studentRepository.findBySchoolAndStudentId(school, studentId)
                .orElseThrow(() -> ApiException.notFound("STUDENT_NOT_FOUND", "Student not found in school"));

        // Enforce Access Control Matrix
        assertCanViewStudent(school, student, principal);

        // 1. Enrollments
        List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByStudent(student);
        AcademicYear currentAy = getCurrentAcademicYear(school).orElse(null);

        StudentDtos.EnrollmentSummaryDto currentEnrollment = null;
        List<StudentDtos.EnrollmentSummaryDto> historicalEnrollments = new ArrayList<>();

        for (StudentEnrollment se : enrollments) {
            StudentDtos.EnrollmentSummaryDto dto = new StudentDtos.EnrollmentSummaryDto(
                    se.getEnrollmentId(),
                    se.getAcademicYear().getAcademicYearId(),
                    se.getAcademicYear().getCode(),
                    se.getAcademicYear().getName(),
                    se.getSchoolClass().getClassId(),
                    se.getSchoolClass().getName(),
                    se.getSection().getSectionId(),
                    se.getSection().getName(),
                    se.getRollNumber(),
                    se.getStatus()
            );

            if (currentAy != null && se.getAcademicYear().getAcademicYearId().equals(currentAy.getAcademicYearId()) && "ACTIVE".equalsIgnoreCase(se.getStatus())) {
                currentEnrollment = dto;
            } else {
                historicalEnrollments.add(dto);
            }
        }

        // If no explicit current AY match found, pick the most recent enrollment as current
        if (currentEnrollment == null && !enrollments.isEmpty()) {
            StudentEnrollment latest = enrollments.get(enrollments.size() - 1);
            currentEnrollment = new StudentDtos.EnrollmentSummaryDto(
                    latest.getEnrollmentId(),
                    latest.getAcademicYear().getAcademicYearId(),
                    latest.getAcademicYear().getCode(),
                    latest.getAcademicYear().getName(),
                    latest.getSchoolClass().getClassId(),
                    latest.getSchoolClass().getName(),
                    latest.getSection().getSectionId(),
                    latest.getSection().getName(),
                    latest.getRollNumber(),
                    latest.getStatus()
            );
        }

        // 2. Guardians
        List<FamilyRelationship> relationships = familyRelationshipRepository.findByStudent(student);
        List<StudentDtos.GuardianSummaryDto> guardians = new ArrayList<>();
        Set<UUID> guardianIds = new HashSet<>();

        for (FamilyRelationship fr : relationships) {
            ParentGuardian g = fr.getGuardian();
            guardianIds.add(g.getGuardianId());
            guardians.add(new StudentDtos.GuardianSummaryDto(
                    g.getGuardianId(),
                    g.getFirstName(),
                    g.getLastName(),
                    g.getFirstName() + " " + g.getLastName(),
                    g.getPhone(),
                    g.getEmail(),
                    g.getOccupation(),
                    fr.getRelationshipType().name(),
                    fr.isPrimary(),
                    fr.isCanPickup()
            ));
        }

        // 3. Siblings (Students sharing any guardian of this student)
        List<StudentDtos.SiblingSummaryDto> siblings = new ArrayList<>();
        Set<UUID> seenSiblingIds = new HashSet<>();
        seenSiblingIds.add(student.getStudentId());

        for (FamilyRelationship fr : relationships) {
            List<FamilyRelationship> otherRelations = familyRelationshipRepository.findByGuardian(fr.getGuardian());
            for (FamilyRelationship ofr : otherRelations) {
                Student otherStudent = ofr.getStudent();
                if (!seenSiblingIds.contains(otherStudent.getStudentId())) {
                    seenSiblingIds.add(otherStudent.getStudentId());

                    // Look up other student's active enrollment
                    String sClassName = "N/A";
                    String sSectionName = "N/A";
                    List<StudentEnrollment> sEnrollments = studentEnrollmentRepository.findByStudent(otherStudent);
                    if (!sEnrollments.isEmpty()) {
                        StudentEnrollment latest = sEnrollments.get(sEnrollments.size() - 1);
                        sClassName = latest.getSchoolClass().getName();
                        sSectionName = latest.getSection().getName();
                    }

                    siblings.add(new StudentDtos.SiblingSummaryDto(
                            otherStudent.getStudentId(),
                            otherStudent.getStudentNumber(),
                            otherStudent.getFirstName() + " " + otherStudent.getLastName(),
                            sClassName,
                            sSectionName,
                            "Shares guardian " + fr.getGuardian().getFirstName() + " " + fr.getGuardian().getLastName()
                    ));
                }
            }
        }

        // 4. Documents
        List<AdmissionDocument> docs = documentRepository.findByStudentOrderByCreatedAtAsc(student);
        List<StudentDtos.AdmissionDocumentResponse> documentDtos = docs.stream().map(d ->
                new StudentDtos.AdmissionDocumentResponse(
                        d.getDocumentId(),
                        d.getDocumentType(),
                        d.getFileName(),
                        d.getFileUrl(),
                        d.getFileSizeBytes(),
                        d.getMimeType(),
                        d.getVerificationStatus(),
                        d.getVerifiedBy() != null ? d.getVerifiedBy().getDisplayName() : null,
                        d.getVerifiedAt(),
                        d.getVerificationNotes(),
                        d.getCreatedAt()
                )
        ).toList();

        String fullName = student.getFirstName()
                + (student.getMiddleName() != null ? " " + student.getMiddleName() : "")
                + " " + student.getLastName();

        return new StudentDtos.Student360Response(
                student.getStudentId(),
                student.getStudentNumber(),
                student.getAdmissionNumber(),
                student.getFirstName(),
                student.getMiddleName(),
                student.getLastName(),
                fullName,
                student.getDateOfBirth(),
                student.getGender(),
                student.getBloodGroup(),
                student.getMedicalAlerts(),
                student.getCurrentAddress(),
                student.getPermanentAddress(),
                student.getNationality(),
                student.getReligion(),
                student.getCategory(),
                student.getAadharOrNationalId(),
                student.getProfilePhotoUrl(),
                student.getEmergencyContact(),
                student.getStatus(),
                currentEnrollment,
                historicalEnrollments,
                guardians,
                siblings,
                documentDtos
        );
    }

    @Transactional
    public StudentDtos.ProfileChangeRequestResponse submitProfileChangeRequest(
            UUID schoolId, UUID studentId, StudentDtos.SubmitProfileChangeRequest req, FutureSchoolPrincipal principal) {
        School school = getSchool(schoolId);
        Student student = studentRepository.findBySchoolAndStudentId(school, studentId)
                .orElseThrow(() -> ApiException.notFound("STUDENT_NOT_FOUND", "Student not found in school"));

        // Only Admin, Principal, or the student/parent itself can submit
        assertCanModifyProfile(student, principal);

        User requester = getUser(principal.getUserId());
        String currentValue = getCurrentFieldValue(student, req.fieldName());

        StudentProfileChangeRequest changeReq = new StudentProfileChangeRequest(
                school, student, req.fieldName(), currentValue, req.proposedValue(), req.reason(), requester);
        changeReq = profileChangeRepository.save(changeReq);

        auditService.recordSimpleEvent(
                school, principal.getUserId(), principal.getLoginId(), "PROFILE_CHANGE_REQUESTED", "STUDENT_360",
                "PROFILE_CHANGE_REQUEST", changeReq.getRequestId().toString(), currentValue, req.proposedValue());

        return toChangeResponse(changeReq);
    }

    @Transactional
    public StudentDtos.ProfileChangeRequestResponse reviewProfileChangeRequest(
            UUID schoolId, UUID requestId, StudentDtos.ReviewProfileChangeRequest req, FutureSchoolPrincipal principal) {
        School school = getSchool(schoolId);
        StudentProfileChangeRequest changeReq = profileChangeRepository.findBySchoolAndRequestId(school, requestId)
                .orElseThrow(() -> ApiException.notFound("REQUEST_NOT_FOUND", "Profile change request not found"));

        if (changeReq.getStatus() != ProfileChangeStatus.PENDING) {
            throw ApiException.conflict("ALREADY_REVIEWED", "Change request has already been processed");
        }

        User reviewer = getUser(principal.getUserId());
        String prev = changeReq.getStatus().name();

        changeReq.setStatus(req.status());
        changeReq.setReviewedBy(reviewer);
        changeReq.setReviewedAt(Instant.now());
        changeReq.setReviewNotes(req.reviewNotes());

        if (req.status() == ProfileChangeStatus.APPROVED) {
            applyProfileChange(changeReq.getStudent(), changeReq.getFieldName(), changeReq.getProposedValue());
            studentRepository.save(changeReq.getStudent());
        }

        changeReq = profileChangeRepository.save(changeReq);

        auditService.recordSimpleEvent(
                school, principal.getUserId(), principal.getLoginId(), "PROFILE_CHANGE_REVIEWED", "STUDENT_360",
                "PROFILE_CHANGE_REQUEST", changeReq.getRequestId().toString(), prev, req.status().name());

        return toChangeResponse(changeReq);
    }

    @Transactional(readOnly = true)
    public List<StudentDtos.ProfileChangeRequestResponse> listProfileChangeRequests(UUID schoolId, ProfileChangeStatus status) {
        School school = getSchool(schoolId);
        List<StudentProfileChangeRequest> list;
        if (status != null) {
            list = profileChangeRepository.findBySchoolAndStatusOrderByCreatedAtDesc(school, status);
        } else {
            list = profileChangeRepository.findAll();
        }
        return list.stream().map(this::toChangeResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<StudentDtos.ProfileChangeRequestResponse> listStudentChangeRequests(UUID schoolId, UUID studentId) {
        School school = getSchool(schoolId);
        Student student = studentRepository.findBySchoolAndStudentId(school, studentId)
                .orElseThrow(() -> ApiException.notFound("STUDENT_NOT_FOUND", "Student not found in school"));
        return profileChangeRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::toChangeResponse).toList();
    }

    private void assertCanViewStudent(School school, Student student, FutureSchoolPrincipal principal) {
        if (principal.hasRole("ROLE_PLATFORM_ADMIN")) {
            return;
        }

        // Must match school tenant
        if (!school.getSchoolId().equals(principal.getSchoolId())) {
            throw ApiException.forbidden("CROSS_TENANT_ACCESS", "Cannot access student records from another school");
        }

        if (principal.hasRole("ROLE_PRINCIPAL") || principal.hasPermission("PERM_ADMISSIONS") || principal.hasPermission("PERM_ACADEMIC_OPERATIONS")) {
            return;
        }

        // Student portal: only own record
        if (principal.hasRole("ROLE_STUDENT")) {
            if (!principal.getLoginId().equalsIgnoreCase(student.getStudentNumber())) {
                throw ApiException.forbidden("ACCESS_DENIED", "Students can only access their own profile");
            }
            return;
        }

        // Parent portal: only own linked child
        if (principal.hasRole("ROLE_PARENT")) {
            if (principal.getLoginId().equalsIgnoreCase(student.getStudentNumber())) {
                return;
            }
            // Check family relationship
            List<FamilyRelationship> relations = familyRelationshipRepository.findByStudent(student);
            boolean matched = relations.stream().anyMatch(fr ->
                    (fr.getGuardian().getPhone() != null && fr.getGuardian().getPhone().equalsIgnoreCase(principal.getLoginId())) ||
                    (fr.getGuardian().getEmail() != null && fr.getGuardian().getEmail().equalsIgnoreCase(principal.getLoginId()))
            );
            if (!matched) {
                throw ApiException.forbidden("ACCESS_DENIED", "Parents can only view their own child's record");
            }
            return;
        }

        // Teacher: only students in classes/sections assigned to this teacher
        if (principal.hasRole("ROLE_TEACHER")) {
            Staff staff = staffRepository.findBySchoolAndStaffCode(school, principal.getLoginId())
                    .orElseThrow(() -> ApiException.forbidden("TEACHER_PROFILE_NOT_FOUND", "Teacher staff record not found"));

            AcademicYear currentAy = getCurrentAcademicYear(school).orElse(null);
            if (currentAy == null) {
                throw ApiException.forbidden("NO_ACTIVE_ACADEMIC_YEAR", "No active academic year found");
            }

            Optional<StudentEnrollment> seOpt = studentEnrollmentRepository.findByStudentAndAcademicYear(student, currentAy);
            if (seOpt.isEmpty()) {
                throw ApiException.forbidden("ACCESS_DENIED", "Student is not enrolled in the current academic year");
            }

            StudentEnrollment se = seOpt.get();
            boolean isClassTeacher = classTeacherRepository.existsByStaff_StaffIdAndSection_SectionId(
                    staff.getStaffId(), se.getSection().getSectionId());
            boolean isSubjectTeacher = teacherAllocationRepository.findBySectionAndAcademicYear(se.getSection(), currentAy)
                    .stream().anyMatch(a -> a.getStaff().getStaffId().equals(staff.getStaffId()));

            if (!isClassTeacher && !isSubjectTeacher) {
                throw ApiException.forbidden("ACCESS_DENIED", "Teacher is not allocated to this student's class or section");
            }
            return;
        }

        throw ApiException.forbidden("ACCESS_DENIED", "Insufficient permissions to access Student 360 profile");
    }

    private void assertCanModifyProfile(Student student, FutureSchoolPrincipal principal) {
        if (principal.hasRole("ROLE_PLATFORM_ADMIN") || principal.hasRole("ROLE_PRINCIPAL") || principal.hasPermission("PERM_ADMISSIONS")) {
            return;
        }

        if (principal.hasRole("ROLE_STUDENT") || principal.hasRole("ROLE_PARENT")) {
            if (principal.getLoginId().equalsIgnoreCase(student.getStudentNumber())) {
                return;
            }
        }

        throw ApiException.forbidden("ACCESS_DENIED", "Not authorized to request profile changes for this student");
    }

    private String getCurrentFieldValue(Student student, String fieldName) {
        return switch (fieldName.toLowerCase()) {
            case "dateofbirth" -> student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : null;
            case "bloodgroup" -> student.getBloodGroup();
            case "medicalalerts" -> student.getMedicalAlerts();
            case "emergencycontact" -> student.getEmergencyContact();
            case "currentaddress" -> student.getCurrentAddress();
            case "permanentaddress" -> student.getPermanentAddress();
            case "nationality" -> student.getNationality();
            case "religion" -> student.getReligion();
            default -> null;
        };
    }

    private void applyProfileChange(Student student, String fieldName, String proposedValue) {
        switch (fieldName.toLowerCase()) {
            case "dateofbirth" -> student.setDateOfBirth(LocalDate.parse(proposedValue));
            case "bloodgroup" -> student.setBloodGroup(proposedValue);
            case "medicalalerts" -> student.setMedicalAlerts(proposedValue);
            case "emergencycontact" -> student.setEmergencyContact(proposedValue);
            case "currentaddress" -> student.setCurrentAddress(proposedValue);
            case "permanentaddress" -> student.setPermanentAddress(proposedValue);
            case "nationality" -> student.setNationality(proposedValue);
            case "religion" -> student.setReligion(proposedValue);
            default -> throw ApiException.badRequest("UNSUPPORTED_FIELD", "Unsupported profile field: " + fieldName);
        }
    }

    private Optional<AcademicYear> getCurrentAcademicYear(School school) {
        return academicYearRepository.findBySchoolAndIsCurrentTrue(school)
                .or(() -> academicYearRepository.findBySchoolAndStatus(school, AcademicYearStatus.ACTIVE));
    }

    private School getSchool(UUID schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> ApiException.notFound("SCHOOL_NOT_FOUND", "School tenant not found"));
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User not found"));
    }

    private StudentDtos.ProfileChangeRequestResponse toChangeResponse(StudentProfileChangeRequest req) {
        return new StudentDtos.ProfileChangeRequestResponse(
                req.getRequestId(),
                req.getStudent().getStudentId(),
                req.getStudent().getStudentNumber(),
                req.getStudent().getFirstName() + " " + req.getStudent().getLastName(),
                req.getFieldName(),
                req.getOldValue(),
                req.getProposedValue(),
                req.getReason(),
                req.getStatus(),
                req.getRequestedBy().getDisplayName(),
                req.getReviewedBy() != null ? req.getReviewedBy().getDisplayName() : null,
                req.getReviewedAt(),
                req.getReviewNotes(),
                req.getCreatedAt()
        );
    }
}
