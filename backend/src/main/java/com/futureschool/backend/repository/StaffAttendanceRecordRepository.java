package com.futureschool.backend.repository;

import com.futureschool.backend.entity.StaffAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffAttendanceRecordRepository extends JpaRepository<StaffAttendanceRecord, String> {
    List<StaffAttendanceRecord> findByAttendanceDate(LocalDate attendanceDate);
    List<StaffAttendanceRecord> findByTeacherIdOrderByAttendanceDateDesc(String teacherId);
    void deleteByAttendanceDate(LocalDate attendanceDate);
}
