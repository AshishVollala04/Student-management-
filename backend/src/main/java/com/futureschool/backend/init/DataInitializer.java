package com.futureschool.backend.init;

import com.futureschool.backend.entity.*;
import com.futureschool.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final SchoolClassRepository classRepository;
    private final UserAccountRepository userAccountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            SchoolClassRepository classRepository,
            UserAccountRepository userAccountRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ParentRepository parentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.classRepository = classRepository;
        this.userAccountRepository = userAccountRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.parentRepository = parentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Initialize Master Classes if not present
        if (classRepository.count() == 0) {
            log.info("Initializing school classes (8-A, 8-B, 9-A, 9-B, 10-A, 10-B)...");
            seedMasterClasses();
        }

        String defaultPasswordHash = passwordEncoder.encode("password123");

        // 2. Initialize Administrator and Principal
        seedAdminAndPrincipal(defaultPasswordHash);

        // 3. Initialize Teacher (Sarah Jenkins - TCH0001)
        seedTeacher(defaultPasswordHash);

        // 4. Initialize Parent (Dr. Rajesh Sharma - PAR0001)
        seedParent(defaultPasswordHash);

        // 5. Initialize Student Profile (Aarav Sharma - GVS-2027-0001)
        seedStudents(defaultPasswordHash);

        log.info("System initialized cleanly with 0 dummy transactions/marks/attendance. Production ready!");
    }

    private void seedAdminAndPrincipal(String passwordHash) {
        if (!userAccountRepository.existsByLoginIdIgnoreCase("ADM0001")) {
            UserAccount admin = UserAccount.builder()
                    .id("USR-ADM-001")
                    .loginId("ADM0001")
                    .password(passwordHash)
                    .name("System Administrator")
                    .email("admin@futureschool.edu")
                    .role(UserRole.ADMIN)
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(admin);
            log.info("Seeded Admin: ADM0001");
        }

        if (!userAccountRepository.existsByLoginIdIgnoreCase("PRN0001")) {
            UserAccount principal = UserAccount.builder()
                    .id("USR-PRN-001")
                    .loginId("PRN0001")
                    .password(passwordHash)
                    .name("Principal Office")
                    .email("principal@futureschool.edu")
                    .role(UserRole.PRINCIPAL)
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(principal);
            log.info("Seeded Principal: PRN0001");
        }
    }

    private void seedTeacher(String passwordHash) {
        if (!userAccountRepository.existsByLoginIdIgnoreCase("TCH0001")) {
            UserAccount teacherAcc = UserAccount.builder()
                    .id("USR-TCH-001")
                    .loginId("TCH0001")
                    .password(passwordHash)
                    .name("Mrs. Sarah Jenkins")
                    .email("sarah.jenkins@futureschool.edu")
                    .role(UserRole.TEACHER)
                    .teacherId("TCH0001")
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(teacherAcc);
        }

        if (teacherRepository.findByTeacherIdIgnoreCase("TCH0001").isEmpty()) {
            Teacher teacher = Teacher.builder()
                    .id("TCH0001")
                    .teacherId("TCH0001")
                    .name("Mrs. Sarah Jenkins")
                    .email("sarah.jenkins@futureschool.edu")
                    .phone("+91 98450 12345")
                    .designation("Class 10-A Mentor & Science Lead")
                    .primarySubject("Physical Science")
                    .qualification("M.Sc. (Physics), B.Ed.")
                    .active(true)
                    .build();
            teacherRepository.save(teacher);
            log.info("Seeded Teacher: Mrs. Sarah Jenkins (TCH0001)");
        }
    }

    private void seedParent(String passwordHash) {
        if (!userAccountRepository.existsByLoginIdIgnoreCase("PAR0001")) {
            UserAccount parentAcc = UserAccount.builder()
                    .id("USR-PAR-001")
                    .loginId("PAR0001")
                    .password(passwordHash)
                    .name("Dr. Rajesh Sharma")
                    .email("rajesh.sharma@gmail.com")
                    .role(UserRole.PARENT)
                    .linkedStudentIds(List.of("GVS-2027-0001"))
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(parentAcc);
        }

        if (parentRepository.findByLoginIdIgnoreCase("PAR0001").isEmpty()) {
            Parent parent = Parent.builder()
                    .id("PAR-0001")
                    .loginId("PAR0001")
                    .name("Dr. Rajesh Sharma")
                    .mobile("9876543210")
                    .email("rajesh.sharma@gmail.com")
                    .occupation("Medical Practitioner")
                    .address("#42, 4th Cross, Malleshwaram, Bengaluru - 560003")
                    .build();
            parentRepository.save(parent);
            log.info("Seeded Parent: Dr. Rajesh Sharma (PAR0001)");
        }
    }

    private void seedStudents(String passwordHash) {
        if (studentRepository.findByAdmissionNumber("GVS-2027-0001").isEmpty()) {
            Student aarav = Student.builder()
                    .id("GVS-2027-0001")
                    .admissionNumber("GVS-2027-0001")
                    .name("Aarav Sharma")
                    .dob("2010-05-14")
                    .gender("Male")
                    .classId("class-10-a")
                    .className("Class 10")
                    .section("A")
                    .roll("18")
                    .parentAccountId("PAR0001")
                    .parentName("Dr. Rajesh Sharma")
                    .parentMobile("9876543210")
                    .parentEmail("rajesh.sharma@gmail.com")
                    .address("#42, 4th Cross, Malleshwaram, Bengaluru - 560003")
                    .district("Bengaluru Urban")
                    .mandal("Malleshwaram")
                    .pincode("560003")
                    .aadhaarNumber("9182 3746 5512")
                    .apaarId("APAAR-KA-2026-991204")
                    .bloodGroup("O+")
                    .casteCategory("General")
                    .mediumOfInstruction("English")
                    .secondLanguage("Kannada")
                    .feeBalance(0.0)
                    .hallTicketReleased(true)
                    .hallTicketApproved(true)
                    .status("Active")
                    .build();
            studentRepository.save(aarav);

            if (!userAccountRepository.existsByLoginIdIgnoreCase("GVS-2027-0001")) {
                UserAccount stuAcc = UserAccount.builder()
                        .id("USR-STU-001")
                        .loginId("GVS-2027-0001")
                        .password(passwordHash)
                        .name("Aarav Sharma")
                        .email("aarav.sharma@futureschool.edu")
                        .role(UserRole.STUDENT)
                        .studentId("GVS-2027-0001")
                        .status("Active")
                        .active(true)
                        .build();
                userAccountRepository.save(stuAcc);
            }
            log.info("Seeded Student: Aarav Sharma (GVS-2027-0001, Class 10-A, Roll 18)");
        }
    }

    private void seedMasterClasses() {
        String[][] classes = {
                {"class-10-a", "Class 10", "A", "10"},
                {"class-10-b", "Class 10", "B", "10"},
                {"class-9-a",  "Class 9",  "A", "9"},
                {"class-9-b",  "Class 9",  "B", "9"},
                {"class-8-a",  "Class 8",  "A", "8"},
                {"class-8-b",  "Class 8",  "B", "8"}
        };

        for (String[] cd : classes) {
            SchoolClass sc = SchoolClass.builder()
                    .id(cd[0])
                    .name(cd[1])
                    .section(cd[2])
                    .gradeNumber(Integer.parseInt(cd[3]))
                    .schoolLevel("Senior")
                    .active(true)
                    .build();
            classRepository.save(sc);
        }
    }
}
