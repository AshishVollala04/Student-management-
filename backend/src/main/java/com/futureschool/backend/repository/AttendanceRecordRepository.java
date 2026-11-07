package com.futureschool.backend.repository;

import com.futureschool.backend.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, String> {
    List<AttendanceRecord> findByClassIdAndAttendanceDate(String classId, LocalDate attendanceDate);
    List<AttendanceRecord> findByStudentIdOrderByAttendanceDateDesc(String studentId);
    Optional<AttendanceRecord> findByStudentIdAndAttendanceDate(String studentId, LocalDate attendanceDate);
    long countByStudentIdAndStatus(String studentId, String status);
    long countByStudentId(String studentId);
    void deleteByClassIdAndAttendanceDate(String classId, LocalDate attendanceDate);
}
