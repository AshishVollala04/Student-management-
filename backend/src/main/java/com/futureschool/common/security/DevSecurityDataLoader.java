package com.futureschool.common.security;

import com.futureschool.academic.domain.*;
import com.futureschool.allocation.domain.ClassTeacherAssignment;
import com.futureschool.allocation.domain.ClassTeacherAssignmentRepository;
import com.futureschool.allocation.domain.TeacherSubjectAllocation;
import com.futureschool.allocation.domain.TeacherSubjectAllocationRepository;
import com.futureschool.identity.domain.*;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.platform.school.domain.SchoolStatus;
import com.futureschool.staff.domain.Staff;
import com.futureschool.staff.domain.StaffRepository;
import com.futureschool.staff.domain.StaffStatus;
import com.futureschool.student.domain.Student;
import com.futureschool.student.domain.StudentEnrollment;
import com.futureschool.student.domain.StudentEnrollmentRepository;
import com.futureschool.student.domain.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DevSecurityDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevSecurityDataLoader.class);

    private final SchoolRepository schoolRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherSubjectAllocationRepository teacherAllocationRepository;
    private final ClassTeacherAssignmentRepository classTeacherRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final SchoolFeatureEntitlementRepository featureEntitlementRepository;
    private final PasswordService passwordService;

    public DevSecurityDataLoader(
            SchoolRepository schoolRepository,
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            UserRepository userRepository,
            StudentRepository studentRepository,
            StaffRepository staffRepository,
            AcademicYearRepository academicYearRepository,
            SchoolClassRepository schoolClassRepository,
            SectionRepository sectionRepository,
            SubjectRepository subjectRepository,
            TeacherSubjectAllocationRepository teacherAllocationRepository,
            ClassTeacherAssignmentRepository classTeacherRepository,
            StudentEnrollmentRepository studentEnrollmentRepository,
            SchoolFeatureEntitlementRepository featureEntitlementRepository,
            PasswordService passwordService) {
        this.schoolRepository = schoolRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.academicYearRepository = academicYearRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.sectionRepository = sectionRepository;
        this.subjectRepository = subjectRepository;
        this.teacherAllocationRepository = teacherAllocationRepository;
        this.classTeacherRepository = classTeacherRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.featureEntitlementRepository = featureEntitlementRepository;
        this.passwordService = passwordService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Security data already initialized, skipping seed.");
            return;
        }

        log.info("Initializing Phase 16 foundational security and authorization seed data...");

        // 1. Permissions
        Permission pViewOwn = createPermissionIfAbsent("PERM_VIEW_OWN_STUDENT", "IDENTITY", "View own student record");
        Permission pMarksEntry = createPermissionIfAbsent("PERM_MARKS_ENTRY", "ACADEMIC", "Enter and submit marks");
        Permission pAdmissions = createPermissionIfAbsent("PERM_ADMISSIONS", "STUDENT", "Manage student admissions");
        Permission pFinance = createPermissionIfAbsent("PERM_FINANCE", "BILLING", "Finance and fee management");
        Permission pOfflinePay = createPermissionIfAbsent("PERM_RECORD_OFFLINE_PAYMENT", "BILLING", "Record offline cash or bank payments");
        Permission pVerifyPay = createPermissionIfAbsent("PERM_VERIFY_OFFLINE_PAYMENT", "BILLING", "Verify offline payments");
        Permission pRefund = createPermissionIfAbsent("PERM_PROCESS_APPROVED_REFUND", "BILLING", "Process approved refunds");
        Permission pFeeStructure = createPermissionIfAbsent("PERM_MANAGE_FEE_STRUCTURE", "BILLING", "Configure fee structure");
        Permission pResetStudent = createPermissionIfAbsent("PERM_RESET_STUDENT_CREDENTIAL", "IDENTITY", "Reset student credentials");
        Permission pResetStaff = createPermissionIfAbsent("PERM_RESET_STAFF_CREDENTIAL", "IDENTITY", "Reset staff credentials");
        Permission pPlatformManage = createPermissionIfAbsent("PERM_PLATFORM_MANAGE_SCHOOLS", "PLATFORM", "Platform school administration");
        Permission pAcademicOps = createPermissionIfAbsent("PERM_ACADEMIC_OPERATIONS", "ACADEMIC", "Academic operations and curriculum configuration");

        // 2. Roles
        Role rStudent = createRoleIfAbsent("ROLE_STUDENT", "Student portal role", Set.of(pViewOwn));
        Role rParent = createRoleIfAbsent("ROLE_PARENT", "Parent portal role", Set.of(pViewOwn));
        Role rTeacher = createRoleIfAbsent("ROLE_TEACHER", "Teacher role", Set.of(pMarksEntry));
        Role rPrincipal = createRoleIfAbsent("ROLE_PRINCIPAL", "Principal academic leadership role",
                Set.of(pViewOwn, pMarksEntry, pAdmissions, pResetStudent, pAcademicOps));
        Role rAdmin = createRoleIfAbsent("ROLE_ADMIN", "School operations admin role",
                Set.of(pAdmissions, pFinance, pOfflinePay, pVerifyPay, pRefund, pFeeStructure, pResetStudent, pResetStaff, pAcademicOps));
        Role rFinanceOnly = createRoleIfAbsent("ROLE_FINANCE_ADMIN", "Finance only role without academic operations",
                Set.of(pFinance, pOfflinePay, pVerifyPay, pRefund));
        Role rPlatformAdmin = createRoleIfAbsent("ROLE_PLATFORM_ADMIN", "Platform super administrator role",
                Set.of(pPlatformManage));

        // 3. Schools
        School schoolGvs = new School("GVS", "Green Valley School", SchoolStatus.ACTIVE);
        schoolGvs = schoolRepository.save(schoolGvs);

        School schoolHza = new School("HZA", "Horizon Academy", SchoolStatus.ACTIVE);
        schoolHza = schoolRepository.save(schoolHza);

        // 4. Feature Entitlements
        featureEntitlementRepository.save(new SchoolFeatureEntitlement(schoolGvs, "ai", true));
        featureEntitlementRepository.save(new SchoolFeatureEntitlement(schoolGvs, "fleet_transport", true));
        featureEntitlementRepository.save(new SchoolFeatureEntitlement(schoolHza, "ai", false));

        // Standard hash for Password123!
        String standardPasswordHash = passwordService.hashPassword("Password123!");

        // 5. Users
        // Student / Parent User for GVS
        User uStudent = new User(schoolGvs, "GVS-2027-0001", "John Doe", standardPasswordHash, AccountStatus.ACTIVE);
        uStudent.setRoles(new HashSet<>(Set.of(rStudent, rParent)));
        uStudent = userRepository.save(uStudent);

        // Teacher User for GVS
        User uTeacher = new User(schoolGvs, "TCH0001", "Sarah Jenkins", standardPasswordHash, AccountStatus.ACTIVE);
        uTeacher.setRoles(new HashSet<>(Set.of(rTeacher)));
        uTeacher = userRepository.save(uTeacher);

        // Principal User for GVS
        User uPrincipal = new User(schoolGvs, "PRN0001", "Dr. Robert Smith", standardPasswordHash, AccountStatus.ACTIVE);
        uPrincipal.setRoles(new HashSet<>(Set.of(rPrincipal)));
        uPrincipal = userRepository.save(uPrincipal);

        // Admin User for GVS (has PERM_ACADEMIC_OPERATIONS)
        User uAdmin = new User(schoolGvs, "ADM0001", "Alice Admin", standardPasswordHash, AccountStatus.ACTIVE);
        uAdmin.setRoles(new HashSet<>(Set.of(rAdmin)));
        uAdmin = userRepository.save(uAdmin);

        // Finance-only Admin User for GVS (DOES NOT have PERM_ACADEMIC_OPERATIONS)
        User uFinance = new User(schoolGvs, "FIN0001", "Fiona Finance", standardPasswordHash, AccountStatus.ACTIVE);
        uFinance.setRoles(new HashSet<>(Set.of(rFinanceOnly)));
        uFinance = userRepository.save(uFinance);

        // Platform Admin User (school is NULL)
        User uPlatform = new User(null, "PLA0001", "Root Platform Manager", standardPasswordHash, AccountStatus.ACTIVE);
        uPlatform.setRoles(new HashSet<>(Set.of(rPlatformAdmin)));
        uPlatform = userRepository.save(uPlatform);

        // Horizon Academy Student, Teacher, and Admin
        User uHzaStudent = new User(schoolHza, "HZA-2027-0001", "Emily Clark", standardPasswordHash, AccountStatus.ACTIVE);
        uHzaStudent.setRoles(new HashSet<>(Set.of(rStudent)));
        uHzaStudent = userRepository.save(uHzaStudent);

        User uHzaTeacher = new User(schoolHza, "HZA-TCH01", "Mark Horizon", standardPasswordHash, AccountStatus.ACTIVE);
        uHzaTeacher.setRoles(new HashSet<>(Set.of(rTeacher)));
        uHzaTeacher = userRepository.save(uHzaTeacher);

        User uHzaAdmin = new User(schoolHza, "HZA-ADM01", "Henry Horizon Admin", standardPasswordHash, AccountStatus.ACTIVE);
        uHzaAdmin.setRoles(new HashSet<>(Set.of(rAdmin)));
        uHzaAdmin = userRepository.save(uHzaAdmin);

        // 6. Domain Records (Staff, Student, Classes, Allocations)
        Staff staffTeacher = new Staff(schoolGvs, "TCH0001", "Sarah", "Jenkins", "Teacher", "sarah@gvs.edu", StaffStatus.ACTIVE);
        staffTeacher = staffRepository.save(staffTeacher);

        Staff staffPrincipal = new Staff(schoolGvs, "PRN0001", "Robert", "Smith", "Principal", "robert@gvs.edu", StaffStatus.ACTIVE);
        staffPrincipal = staffRepository.save(staffPrincipal);

        Staff staffHza = new Staff(schoolHza, "HZA-TCH01", "Mark", "Horizon", "Teacher", "mark@hza.edu", StaffStatus.ACTIVE);
        staffHza = staffRepository.save(staffHza);

        Student studentGvs = new Student(schoolGvs, "GVS-2027-0001", "ADM-GVS-0001", "John", "Doe",
                LocalDate.of(2010, 5, 15), "MALE");
        studentGvs = studentRepository.save(studentGvs);

        Student studentHza = new Student(schoolHza, "HZA-2027-0001", "ADM-HZA-0001", "Emily", "Clark",
                LocalDate.of(2010, 8, 20), "FEMALE");
        studentHza = studentRepository.save(studentHza);

        // Academic Structure
        AcademicYear ay2027 = new AcademicYear(schoolGvs, "AY-2027", "2026-2027", LocalDate.of(2026, 6, 1),
                LocalDate.of(2027, 4, 30), AcademicYearStatus.ACTIVE);
        ay2027.setCurrent(true);
        ay2027 = academicYearRepository.save(ay2027);

        SchoolClass class10 = new SchoolClass(schoolGvs, "Class 10", 10);
        class10 = schoolClassRepository.save(class10);

        Section sec10A = new Section(schoolGvs, class10, "A", 35);
        sec10A = sectionRepository.save(sec10A);

        Section sec10B = new Section(schoolGvs, class10, "B", 35);
        sec10B = sectionRepository.save(sec10B);

        Subject subMath = new Subject(schoolGvs, "MATH-10", "Mathematics", "Science");
        subMath = subjectRepository.save(subMath);

        Subject subPhys = new Subject(schoolGvs, "PHYS-10", "Physics", "Science");
        subPhys = subjectRepository.save(subPhys);

        // Student Enrollment
        StudentEnrollment enrollment = new StudentEnrollment(schoolGvs, studentGvs, ay2027, class10, sec10A, "10-A-01");
        studentEnrollmentRepository.save(enrollment);

        // Teacher Allocations:
        // Sarah Jenkins -> Class 10 Section A -> Mathematics
        TeacherSubjectAllocation allocMath = new TeacherSubjectAllocation(schoolGvs, ay2027, staffTeacher, sec10A, subMath, LocalDate.of(2026, 6, 1));
        teacherAllocationRepository.save(allocMath);

        // Class Teacher Assignment: Sarah Jenkins -> Class 10 Section A
        ClassTeacherAssignment ctAssignment = new ClassTeacherAssignment(schoolGvs, ay2027, sec10A, staffTeacher, LocalDate.of(2026, 6, 1));
        classTeacherRepository.save(ctAssignment);

        log.info("Phase 16 security seed data successfully loaded.");
    }

    private Permission createPermissionIfAbsent(String code, String module, String description) {
        return permissionRepository.findByPermissionCode(code)
                .orElseGet(() -> permissionRepository.save(new Permission(code, module, description)));
    }

    private Role createRoleIfAbsent(String name, String description, Set<Permission> permissions) {
        return roleRepository.findByRoleName(name)
                .orElseGet(() -> {
            Role role = new Role(name, description);
            role.setPermissions(new HashSet<>(permissions));
            return roleRepository.save(role);
        });
    }
}
