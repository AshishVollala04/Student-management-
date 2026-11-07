package com.futureschool.academic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureschool.academic.domain.*;
import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.application.FutureSchoolApplication;
import com.futureschool.common.audit.AuditEvent;
import com.futureschool.common.audit.AuditEventRepository;
import com.futureschool.common.security.PortalContext;
import com.futureschool.identity.dto.LoginRequest;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = FutureSchoolApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AcademicFoundationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private SchoolClassRepository schoolClassRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private AuditEventRepository auditEventRepository;

    private String adminToken;
    private String financeAdminToken;
    private String teacherToken;
    private String hzaAdminToken;

    private School schoolGvs;
    private School schoolHza;
    private AcademicYear gvsYear;
    private SchoolClass gvsClass10;
    private Section gvsSec10A;
    private Subject gvsSubMath;

    @BeforeEach
    void setUp() throws Exception {
        schoolGvs = schoolRepository.findBySchoolCode("GVS").orElseThrow();
        schoolHza = schoolRepository.findBySchoolCode("HZA").orElseThrow();

        gvsYear = academicYearRepository.findBySchoolAndCode(schoolGvs, "AY-2027").orElseThrow();
        gvsClass10 = schoolClassRepository.findBySchoolAndName(schoolGvs, "Class 10").orElseThrow();
        gvsSec10A = sectionRepository.findBySchool(schoolGvs).stream()
                .filter(s -> "A".equals(s.getName()))
                .findFirst()
                .orElseThrow();
        gvsSubMath = subjectRepository.findBySchoolAndCode(schoolGvs, "MATH-10").orElseThrow();

        adminToken = obtainToken("ADM0001", "Password123!", PortalContext.STAFF, "GVS");
        financeAdminToken = obtainToken("FIN0001", "Password123!", PortalContext.STAFF, "GVS");
        teacherToken = obtainToken("TCH0001", "Password123!", PortalContext.STAFF, "GVS");
        hzaAdminToken = obtainToken("HZA-ADM01", "Password123!", PortalContext.STAFF, "HZA");
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
    @DisplayName("1. School Context: Authenticated school user reads safe school branding and metadata")
    void testGetSchoolContext() throws Exception {
        mockMvc.perform(get("/api/v1/school/context")
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.schoolCode").value("GVS"))
                .andExpect(jsonPath("$.data.schoolName").value("Green Valley School"))
                .andExpect(jsonPath("$.data.timezone").value("Asia/Kolkata"))
                .andExpect(jsonPath("$.data.currentAcademicYear.code").value("AY-2027"));
    }

    @Test
    @DisplayName("2. School A Academic Admin creates Class -> ALLOW (200)")
    void testAcademicAdminCreatesClass() throws Exception {
        AcademicDtos.CreateClassRequest req = new AcademicDtos.CreateClassRequest(
                "Class 9", 9, 35, 40, 9
        );

        mockMvc.perform(post("/api/v1/academic/classes")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Class 9"))
                .andExpect(jsonPath("$.data.gradeLevel").value(9));
    }

    @Test
    @DisplayName("3. School B Admin reads School A Class -> DENY (404 Not Found in tenant)")
    void testCrossTenantClassReadDenied() throws Exception {
        mockMvc.perform(get("/api/v1/academic/classes/" + gvsClass10.getClassId())
                        .header("Authorization", "Bearer " + hzaAdminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CLASS_NOT_FOUND"));
    }

    @Test
    @DisplayName("4. Teacher lists current Classes and Subjects -> ALLOW read only")
    void testTeacherListsClassesAndSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/academic/classes")
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());

        mockMvc.perform(get("/api/v1/academic/subjects")
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("5. Teacher creates Class -> DENY (403 Forbidden)")
    void testTeacherCannotCreateClass() throws Exception {
        AcademicDtos.CreateClassRequest req = new AcademicDtos.CreateClassRequest(
                "Class 8", 8, 35, 40, 8
        );

        mockMvc.perform(post("/api/v1/academic/classes")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("6. Finance-only Admin creates Subject -> DENY (403 Forbidden)")
    void testFinanceAdminCannotCreateSubject() throws Exception {
        AcademicDtos.CreateSubjectRequest req = new AcademicDtos.CreateSubjectRequest(
                "CHEM-10", "Chemistry", "Science", SubjectType.CORE, 5
        );

        mockMvc.perform(post("/api/v1/academic/subjects")
                        .header("Authorization", "Bearer " + financeAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. Duplicate Section in same class -> CONFLICT (409)")
    void testDuplicateSectionConflict() throws Exception {
        AcademicDtos.CreateSectionRequest req = new AcademicDtos.CreateSectionRequest(
                gvsClass10.getClassId(), "A", 35, 40 // Section A already exists in Class 10
        );

        mockMvc.perform(post("/api/v1/academic/sections")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DUPLICATE_SECTION"));
    }

    @Test
    @DisplayName("8. Normal Capacity greater than Maximum -> VALIDATION FAILURE (422)")
    void testCapacityValidationFailure() throws Exception {
        AcademicDtos.CreateClassRequest req = new AcademicDtos.CreateClassRequest(
                "Class 11", 11, 45, 40, 11 // normalCapacity 45 > maxCapacity 40
        );

        mockMvc.perform(post("/api/v1/academic/classes")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value("CAPACITY_INVALID"));
    }

    @Test
    @DisplayName("9. CLOSED Academic Year edit -> DENY/CONFLICT (409)")
    void testClosedAcademicYearEditBlocked() throws Exception {
        // Create a draft year and close it
        AcademicYear closedYear = new AcademicYear(
                schoolGvs, "AY-2025", "2024-2025", LocalDate.of(2024, 6, 1),
                LocalDate.of(2025, 4, 30), AcademicYearStatus.CLOSED
        );
        closedYear = academicYearRepository.save(closedYear);

        AcademicDtos.UpdateAcademicYearRequest updateReq = new AcademicDtos.UpdateAcademicYearRequest(
                "2024-2025 Revised", LocalDate.of(2024, 6, 1), LocalDate.of(2025, 5, 15)
        );

        mockMvc.perform(put("/api/v1/academic/years/" + closedYear.getAcademicYearId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CLOSED_YEAR_IMMUTABLE"));
    }

    @Test
    @DisplayName("10. Two Active Academic Years -> BLOCKED (409)")
    void testTwoActiveAcademicYearsBlocked() throws Exception {
        // AY-2027 is already ACTIVE in GVS.
        // Create AY-2028 as DRAFT, then try to activate it without closing AY-2027.
        AcademicYear draftYear = new AcademicYear(
                schoolGvs, "AY-2028", "2027-2028", LocalDate.of(2027, 6, 1),
                LocalDate.of(2028, 4, 30), AcademicYearStatus.DRAFT
        );
        draftYear = academicYearRepository.save(draftYear);

        mockMvc.perform(post("/api/v1/academic/years/" + draftYear.getAcademicYearId() + "/activate")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("ACTIVE_YEAR_EXISTS"));
    }

    @Test
    @DisplayName("11. Calendar date conflict (duplicate date in same calendar) -> CONFLICT (409)")
    void testCalendarConflict() throws Exception {
        // Create Calendar Draft
        AcademicDtos.CreateCalendarRequest calReq = new AcademicDtos.CreateCalendarRequest(
                gvsYear.getAcademicYearId(), "2026-2027 Working Calendar"
        );

        MvcResult calResult = mockMvc.perform(post("/api/v1/academic/calendars")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(calReq)))
                .andExpect(status().isOk())
                .andReturn();

        String calIdStr = objectMapper.readTree(calResult.getResponse().getContentAsString())
                .path("data").path("calendarId").asText();
        UUID calId = UUID.fromString(calIdStr);

        // Add Entry on 2026-08-15 (Independence Day)
        AcademicDtos.AddCalendarEntryRequest entry1 = new AcademicDtos.AddCalendarEntryRequest(
                LocalDate.of(2026, 8, 15), CalendarDayType.HOLIDAY, "Independence Day", false
        );

        mockMvc.perform(post("/api/v1/academic/calendars/" + calId + "/entries")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(entry1)))
                .andExpect(status().isOk());

        // Duplicate entry on 2026-08-15 -> CONFLICT
        mockMvc.perform(post("/api/v1/academic/calendars/" + calId + "/entries")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(entry1)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CALENDAR_DATE_CONFLICT"));
    }

    @Test
    @DisplayName("12. Audit event created after material academic change -> PASS")
    void testAuditEventCreated() throws Exception {
        long countBefore = auditEventRepository.count();

        AcademicDtos.CreateSubjectRequest req = new AcademicDtos.CreateSubjectRequest(
                "BIO-10", "Biology", "Science", SubjectType.CORE, 4
        );

        mockMvc.perform(post("/api/v1/academic/subjects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        long countAfter = auditEventRepository.count();
        assertThat(countAfter).isGreaterThan(countBefore);

        List<AuditEvent> events = auditEventRepository.findBySchool(schoolGvs);
        boolean found = events.stream().anyMatch(e -> "CREATE_SUBJECT".equals(e.getAction()));
        assertThat(found).isTrue();
    }
}
