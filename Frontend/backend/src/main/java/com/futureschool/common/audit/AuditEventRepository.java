package com.futureschool.common.audit;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    Page<AuditEvent> findBySchoolOrderByCreatedAtDesc(School school, Pageable pageable);
    List<AuditEvent> findBySchool(School school);
    Page<AuditEvent> findBySchoolAndActionOrderByCreatedAtDesc(School school, String action, Pageable pageable);
    Optional<AuditEvent> findTopBySchoolOrderByCreatedAtDesc(School school);
    Optional<AuditEvent> findTopByOrderByCreatedAtDesc();
}
