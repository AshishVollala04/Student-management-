package com.futureschool;

import com.futureschool.application.FutureSchoolApplication;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.platform.school.domain.SchoolStatus;
import com.futureschool.student.domain.Student;
import com.futureschool.student.domain.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = FutureSchoolApplication.class)
@ActiveProfiles("test")
@Transactional
class TenantIsolationRepositoryTest {

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private StudentRepository studentRepository;

    private School schoolA;
    private School schoolB;
    private Student studentA;

    @BeforeEach
    void setUp() {
        schoolA = schoolRepository.save(new School("GVS-TEST", "Greenwood Valley Test", SchoolStatus.ACTIVE));
        schoolB = schoolRepository.save(new School("OAK-TEST", "Oakridge Test", SchoolStatus.ACTIVE));

        studentA = studentRepository.save(new Student(
                schoolA,
                "GVS-2027-0001",
                "ADM-1001",
                "Aarav",
                "Sharma",
                LocalDate.of(2011, 4, 15),
                "MALE"
        ));
    }

    @Test
    @DisplayName("Student is retrieved when queried within correct School A tenant scope")
    void testStudentFoundInCorrectTenant() {
        Optional<Student> found = studentRepository.findBySchoolAndStudentNumber(schoolA, "GVS-2027-0001");
        assertTrue(found.isPresent());
        assertEquals("Aarav", found.get().getFirstName());
        assertEquals(schoolA.getSchoolId(), found.get().getSchool().getSchoolId());
    }

    @Test
    @DisplayName("Wrong-Tenant Access Test: School B queries School A's student number and receives Empty")
    void testWrongTenantAccessReturnsEmpty() {
        Optional<Student> wrongTenantLookup = studentRepository.findBySchoolAndStudentNumber(schoolB, "GVS-2027-0001");
        assertFalse(wrongTenantLookup.isPresent(), "School B MUST NOT be able to view School A's student");
    }
}
