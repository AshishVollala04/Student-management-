package com.futureschool.backend.repository;

import com.futureschool.backend.entity.CertificateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRecordRepository extends JpaRepository<CertificateRecord, String> {
    List<CertificateRecord> findByStudentIdOrderByIssueDateDesc(String studentId);
}
