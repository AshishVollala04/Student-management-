package com.futureschool.backend.repository;

import com.futureschool.backend.entity.MarksRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRecordRepository extends JpaRepository<MarksRecord, String> {
    List<MarksRecord> findByClassIdAndExamAndSubject(String classId, String exam, String subject);
    List<MarksRecord> findByClassId(String classId);
    List<MarksRecord> findByStudentId(String studentId);
    List<MarksRecord> findByStudentIdAndExam(String studentId, String exam);
    Optional<MarksRecord> findByStudentIdAndExamAndSubject(String studentId, String exam, String subject);
}
