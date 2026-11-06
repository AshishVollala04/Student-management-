package com.futureschool;

import com.futureschool.application.FutureSchoolApplication;
import com.futureschool.common.audit.AuditEvent;
import com.futureschool.common.audit.AuditEventRepository;
import com.futureschool.common.audit.AuditService;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.platform.school.domain.SchoolStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = FutureSchoolApplication.class)
@ActiveProfiles("test")
@Transactional
class AuditServiceIntegrationTest {

    @Autowired
    private AuditService auditService;

    @Autowired
    private AuditEventRepository auditEventRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Test
    @DisplayName("Audit events are persisted and cryptographically hash-chained")
    void testAuditEventPersistenceAndChaining() {
        School school = schoolRepository.saveAndFlush(new School("AUD-TEST", "Audit Test School", SchoolStatus.ACTIVE));
        UUID actorId = UUID.randomUUID();

        AuditEvent event1 = auditService.recordEvent(
                school,
                actorId,
                "admin@futureschool.org",
                "ADMIN",
                "ADMISSIONS_CREATE",
                "STU_ADMISSION_CREATED",
                "STUDENT",
                "AdmissionDraft",
                "adm_001",
                null,
                "{\"status\":\"DRAFT\"}",
                "Initial admission application",
                "req_001",
                "corr_001",
                "BUSINESS_AUDIT",
                "INFO"
        );

        assertNotNull(event1.getAuditEventId());
        assertNotNull(event1.getEventHash());
        assertFalse(event1.getEventHash().isBlank());

        AuditEvent event2 = auditService.recordEvent(
                school,
                actorId,
                "admin@futureschool.org",
                "ADMIN",
                "ADMISSIONS_ACTIVATE",
                "STU_ACTIVATION_COMMITTED",
                "STUDENT",
                "Student",
                "GVS-2027-0042",
                "{\"status\":\"DRAFT\"}",
                "{\"status\":\"ACTIVE\"}",
                "Principal sanctioned admission",
                "req_002",
                "corr_001",
                "BUSINESS_AUDIT",
                "NOTICE"
        );

        assertNotNull(event2.getAuditEventId());
        // Verify cryptographic hash chaining
        assertEquals(event1.getEventHash(), event2.getPreviousEventHash(),
                "Event 2 previous_event_hash must match Event 1 event_hash");
    }
}
