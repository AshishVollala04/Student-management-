package com.futureschool.backend.repository;

import com.futureschool.backend.entity.BookIssueRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookIssueRecordRepository extends JpaRepository<BookIssueRecord, String> {
    List<BookIssueRecord> findByStudentIdOrderByIssueDateDesc(String studentId);
    List<BookIssueRecord> findByStatus(String status);
}
