package com.futureschool.common.security;

import com.futureschool.allocation.domain.ClassTeacherAssignmentRepository;
import com.futureschool.allocation.domain.TeacherSubjectAllocationRepository;
import com.futureschool.student.domain.Student;
import com.futureschool.student.domain.StudentEnrollment;
import com.futureschool.student.domain.StudentEnrollmentRepository;
import com.futureschool.student.domain.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RelationshipAuthorizationService {

    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final TeacherSubjectAllocationRepository teacherAllocationRepository;
    private final ClassTeacherAssignmentRepository classTeacherRepository;

    public RelationshipAuthorizationService(
            StudentRepository studentRepository,
            StudentEnrollmentRepository studentEnrollmentRepository,
            TeacherSubjectAllocationRepository teacherAllocationRepository,
            ClassTeacherAssignmentRepository classTeacherRepository) {
        this.studentRepository = studentRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.teacherAllocationRepository = teacherAllocationRepository;
        this.classTeacherRepository = classTeacherRepository;
    }

    /**
     * Determines whether the principal can access the targeted student's record.
     */
    @Transactional(readOnly = true)
    public boolean canAccessStudent(FutureSchoolPrincipal principal, UUID targetStudentId) {
        if (principal == null || targetStudentId == null) {
            return false;
        }

        // Platform Admin cannot directly access/probe school student records without specific tenant delegation
        if (principal.hasRole("ROLE_PLATFORM_ADMIN")) {
            return false;
        }

        Optional<Student> studentOpt = studentRepository.findById(targetStudentId);
        if (studentOpt.isEmpty()) {
            return false;
        }
        Student student = studentOpt.get();

        // Enforce tenant boundary
        if (!student.getSchool().getSchoolId().equals(principal.getSchoolId())) {
            return false;
        }

        // Student portal: strictly own student identity
        if (principal.hasRole("ROLE_STUDENT") || principal.getPortal() == PortalContext.STUDENT) {
            return targetStudentId.equals(principal.getStudentId());
        }

        // Parent portal: strictly own bound ward
        if (principal.hasRole("ROLE_PARENT") || principal.getPortal() == PortalContext.PARENT) {
            return targetStudentId.equals(principal.getStudentId());
        }

        // School Admin & Principal: allowed across own school
        if (principal.hasRole("ROLE_ADMIN") || principal.hasRole("ROLE_PRINCIPAL")) {
            return true;
        }

        // Teacher: must be assigned to student's class/section
        if (principal.hasRole("ROLE_TEACHER")) {
            if (principal.getStaffId() == null) {
                return false;
            }
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByStudent(student);
            for (StudentEnrollment enrollment : enrollments) {
                UUID sectionId = enrollment.getSection().getSectionId();
                UUID classId = enrollment.getSection().getSchoolClass().getClassId();

                if (classTeacherRepository.existsByStaff_StaffIdAndSection_SectionId(principal.getStaffId(), sectionId) ||
                    classTeacherRepository.existsByStaff_StaffIdAndSection_SchoolClass_ClassId(principal.getStaffId(), classId) ||
                    teacherAllocationRepository.existsByStaff_StaffIdAndSection_SchoolClass_ClassId(principal.getStaffId(), classId)) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    /**
     * Determines whether the principal can enter marks for a given class, section, and subject.
     */
    @Transactional(readOnly = true)
    public boolean canEnterMarks(FutureSchoolPrincipal principal,
                                 UUID targetSchoolId,
                                 UUID classId,
                                 UUID sectionId,
                                 UUID subjectId,
                                 boolean isWindowOpen) {
        if (principal == null || targetSchoolId == null || sectionId == null || subjectId == null) {
            return false;
        }

        // Workflow state check: window must be open
        if (!isWindowOpen) {
            return false;
        }

        // Must have permission
        if (!principal.hasPermission("PERM_MARKS_ENTRY")) {
            return false;
        }

        // Tenant boundary
        if (!targetSchoolId.equals(principal.getSchoolId())) {
            return false;
        }

        // Role & Relationship validation:
        // Teacher or Principal with active allocation:
        if (principal.hasRole("ROLE_TEACHER") || principal.hasRole("ROLE_PRINCIPAL")) {
            if (principal.getStaffId() == null) {
                return false;
            }
            return teacherAllocationRepository.existsByStaff_StaffIdAndSection_SectionIdAndSubject_SubjectId(
                    principal.getStaffId(), sectionId, subjectId);
        }

        // Admins and Platform Admins do not directly enter marks without an assigned teacher allocation
        return false;
    }

    /**
     * Determines whether the teacher is the designated Class Teacher for a given section.
     */
    @Transactional(readOnly = true)
    public boolean isClassTeacherForSection(FutureSchoolPrincipal principal, UUID sectionId) {
        if (principal == null || sectionId == null || principal.getStaffId() == null) {
            return false;
        }
        return classTeacherRepository.existsByStaff_StaffIdAndSection_SectionId(principal.getStaffId(), sectionId);
    }
}
