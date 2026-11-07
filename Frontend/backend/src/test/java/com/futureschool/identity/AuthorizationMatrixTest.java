package com.futureschool.identity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureschool.academic.domain.Section;
import com.futureschool.academic.domain.SectionRepository;
import com.futureschool.academic.domain.Subject;
import com.futureschool.academic.domain.SubjectRepository;
import com.futureschool.common.security.MfaService;
import com.futureschool.common.security.PortalContext;
import com.futureschool.identity.api.AuthorizedOperationsController;
import com.futureschool.identity.domain.User;
import com.futureschool.identity.domain.UserRepository;
import com.futureschool.identity.dto.LoginRequest;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.student.domain.Student;
import com.futureschool.student.domain.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.futureschool.application.FutureSchoolApplication;

@SpringBootTest(classes = FutureSchoolApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthorizationMatrixTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MfaService mfaService;

    private String studentToken;
    private String parentToken;
    private String teacherToken;
    private String adminToken;
    private String platformToken;
    private String hzaStudentToken;

    private Student gvsStudent;
    private Student hzaStudent;
    private Section sec10A;
    private Subject subMath;
    private Subject subPhys;
    private School schoolGvs;
    private School schoolHza;

    @BeforeEach
    void setUp() throws Exception {
        schoolGvs = schoolRepository.findBySchoolCode("GVS").orElseThrow();
        schoolHza = schoolRepository.findBySchoolCode("HZA").orElseThrow();

        gvsStudent = studentRepository.findBySchoolAndStudentNumber(schoolGvs, "GVS-2027-0001").orElseThrow();
        hzaStudent = studentRepository.findBySchoolAndStudentNumber(schoolHza, "HZA-2027-0001").orElseThrow();

        sec10A = sectionRepository.findBySchool(schoolGvs).stream()
                .filter(s -> "A".equals(s.getName()))
                .findFirst()
                .orElseThrow();
        subMath = subjectRepository.findBySchoolAndCode(schoolGvs, "MATH-10").orElseThrow();
        subPhys = subjectRepository.findBySchoolAndCode(schoolGvs, "PHYS-10").orElseThrow();

        // Obtain tokens for various personas
        studentToken = obtainToken("GVS-2027-0001", "Password123!", PortalContext.STUDENT, "GVS");
        parentToken = obtainToken("GVS-2027-0001", "Password123!", PortalContext.PARENT, "GVS");
        teacherToken = obtainToken("TCH0001", "Password123!", PortalContext.STAFF, "GVS");
        adminToken = obtainToken("ADM0001", "Password123!", PortalContext.STAFF, "GVS");
        platformToken = obtainToken("PLA0001", "Password123!", PortalContext.PLATFORM, null);
        hzaStudentToken = obtainToken("HZA-2027-0001", "Password123!", PortalContext.STUDENT, "HZA");
    }

    private String obtainToken(String loginId, String password, PortalContext portal, String schoolCode) throws Exception {
        LoginRequest req = new LoginRequest(loginId, password, portal, schoolCode);
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();
    }

    @Test
    @DisplayName("Matrix 1: Student can access own grades -> ALLOW")
    void testStudentAccessOwnGrades() throws Exception {
        mockMvc.perform(get("/api/v1/student/" + gvsStudent.getStudentId() + "/grades")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("AUTHORIZED_ACCESS"));
    }

    @Test
    @DisplayName("Matrix 2: Student probes other student's grades -> DENY (403)")
    void testStudentCrossProbeGrades() throws Exception {
        mockMvc.perform(get("/api/v1/student/" + hzaStudent.getStudentId() + "/grades")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 3: Parent can access bound ward's grades -> ALLOW")
    void testParentAccessBoundWard() throws Exception {
        mockMvc.perform(get("/api/v1/student/" + gvsStudent.getStudentId() + "/grades")
                        .header("Authorization", "Bearer " + parentToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Matrix 4: Parent probes another student's grades -> DENY (403)")
    void testParentProbeOtherStudent() throws Exception {
        mockMvc.perform(get("/api/v1/student/" + hzaStudent.getStudentId() + "/grades")
                        .header("Authorization", "Bearer " + parentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 5: Teacher enters marks for allocated subject (Math 10-A) when window is OPEN -> ALLOW")
    void testTeacherEntersMarksForAllocatedSubject() throws Exception {
        AuthorizedOperationsController.MarksEntryRequest req =
                new AuthorizedOperationsController.MarksEntryRequest(
                        schoolGvs.getSchoolId(),
                        sec10A.getSchoolClass().getClassId(),
                        sec10A.getSectionId(),
                        subMath.getSubjectId(),
                        true
                );

        mockMvc.perform(post("/api/v1/academic/marks/entry")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("MARKS_ACCEPTED"));
    }

    @Test
    @DisplayName("Matrix 6: Teacher enters marks for unallocated subject (Physics 10-A) -> DENY (403)")
    void testTeacherEntersMarksForUnallocatedSubject() throws Exception {
        AuthorizedOperationsController.MarksEntryRequest req =
                new AuthorizedOperationsController.MarksEntryRequest(
                        schoolGvs.getSchoolId(),
                        sec10A.getSchoolClass().getClassId(),
                        sec10A.getSectionId(),
                        subPhys.getSubjectId(),
                        true
                );

        mockMvc.perform(post("/api/v1/academic/marks/entry")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 7: Teacher enters marks when window is CLOSED -> DENY (403)")
    void testTeacherEntersMarksWindowClosed() throws Exception {
        AuthorizedOperationsController.MarksEntryRequest req =
                new AuthorizedOperationsController.MarksEntryRequest(
                        schoolGvs.getSchoolId(),
                        sec10A.getSchoolClass().getClassId(),
                        sec10A.getSectionId(),
                        subMath.getSubjectId(),
                        false // window is CLOSED
                );

        mockMvc.perform(post("/api/v1/academic/marks/entry")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 8: Teacher cross-tenant probe (School GVS teacher probes School HZA) -> DENY (403)")
    void testTeacherCrossTenantProbe() throws Exception {
        AuthorizedOperationsController.MarksEntryRequest req =
                new AuthorizedOperationsController.MarksEntryRequest(
                        schoolHza.getSchoolId(), // School HZA
                        sec10A.getSchoolClass().getClassId(),
                        sec10A.getSectionId(),
                        subMath.getSubjectId(),
                        true
                );

        mockMvc.perform(post("/api/v1/academic/marks/entry")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 9: Admin attempts to enter marks directly without teaching allocation -> DENY (403)")
    void testAdminCannotEnterMarksWithoutAllocation() throws Exception {
        AuthorizedOperationsController.MarksEntryRequest req =
                new AuthorizedOperationsController.MarksEntryRequest(
                        schoolGvs.getSchoolId(),
                        sec10A.getSchoolClass().getClassId(),
                        sec10A.getSectionId(),
                        subMath.getSubjectId(),
                        true
                );

        mockMvc.perform(post("/api/v1/academic/marks/entry")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 10: School Admin attempts platform-only endpoint -> DENY (403)")
    void testSchoolAdminCannotAccessPlatformEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/platform/schools/summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 11: Platform Admin accesses platform endpoint -> ALLOW")
    void testPlatformAdminAccessesPlatformEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/platform/schools/summary")
                        .header("Authorization", "Bearer " + platformToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.systemStatus").value("HEALTHY"));
    }

    @Test
    @DisplayName("Matrix 12: Admin with PERM_RECORD_OFFLINE_PAYMENT records payment -> ALLOW")
    void testAdminRecordsPayment() throws Exception {
        mockMvc.perform(post("/api/v1/billing/record-offline-payment")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RECORDED"));
    }

    @Test
    @DisplayName("Matrix 13: Teacher without payment permission attempts to record payment -> DENY (403)")
    void testTeacherCannotRecordPayment() throws Exception {
        mockMvc.perform(post("/api/v1/billing/record-offline-payment")
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Matrix 14: Sensitive staff credential reset without step-up token -> DENY (403 STEP_UP_REQUIRED)")
    void testResetStaffCredentialWithoutStepUp() throws Exception {
        mockMvc.perform(post("/api/v1/admin/staff/reset-credential")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("STEP_UP_REQUIRED"));
    }

    @Test
    @DisplayName("Matrix 15: Sensitive staff credential reset with valid step-up token -> ALLOW")
    void testResetStaffCredentialWithStepUp() throws Exception {
        User adminUser = userRepository.findBySchool_SchoolCodeAndLoginId("GVS", "ADM0001").orElseThrow();
        String rawStepUpToken = mfaService.issueStepUpToken(adminUser, "STAFF_CREDENTIAL_RESET");

        mockMvc.perform(post("/api/v1/admin/staff/reset-credential")
                        .header("Authorization", "Bearer " + adminToken)
                        .header("X-Step-Up-Token", rawStepUpToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    @DisplayName("Matrix 16: Feature Entitlement check: GVS has AI enabled -> ALLOW (200), HZA has AI disabled -> DENY (403)")
    void testFeatureEntitlementCheck() throws Exception {
        // GVS Student -> ALLOW
        mockMvc.perform(get("/api/v1/academic/ai-insights")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.feature").value("ai"));

        // HZA Student -> DENY
        mockMvc.perform(get("/api/v1/academic/ai-insights")
                        .header("Authorization", "Bearer " + hzaStudentToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FEATURE_NOT_ENTITLED"));
    }
}
