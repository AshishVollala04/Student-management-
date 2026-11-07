package com.futureschool.backend.service;

import com.futureschool.backend.entity.AttendanceRecord;
import com.futureschool.backend.repository.AttendanceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;

    public AttendanceService(AttendanceRecordRepository attendanceRecordRepository) {
        this.attendanceRecordRepository = attendanceRecordRepository;
    }

    public List<AttendanceRecord> getClassAttendance(String classId, LocalDate date) {
        return attendanceRecordRepository.findByClassIdAndAttendanceDate(classId, date);
    }

    public List<AttendanceRecord> getStudentAttendanceHistory(String studentId) {
        return attendanceRecordRepository.findByStudentIdOrderByAttendanceDateDesc(studentId);
    }

    @Transactional
    public List<AttendanceRecord> markAttendance(String classId, LocalDate date, List<AttendanceRecord> records, String recordedBy) {
        // Delete existing records for this class & date to prevent duplicate marking
        attendanceRecordRepository.deleteByClassIdAndAttendanceDate(classId, date);

        List<AttendanceRecord> toSave = new ArrayList<>();
        for (AttendanceRecord r : records) {
            if (r.getId() == null || r.getId().isBlank()) {
                r.setId("ATT-" + classId + "-" + date + "-" + r.getStudentId());
            }
            r.setClassId(classId);
            r.setAttendanceDate(date);
            if (recordedBy != null) r.setRecordedBy(recordedBy);
            toSave.add(r);
        }

        return attendanceRecordRepository.saveAll(toSave);
    }

    public Map<String, Object> getStudentAttendanceSummary(String studentId) {
        long total = attendanceRecordRepository.countByStudentId(studentId);
        long present = attendanceRecordRepository.countByStudentIdAndStatus(studentId, "Present");
        long absent = attendanceRecordRepository.countByStudentIdAndStatus(studentId, "Absent");
        long late = attendanceRecordRepository.countByStudentIdAndStatus(studentId, "Late");
        long excused = attendanceRecordRepository.countByStudentIdAndStatus(studentId, "Excused");

        double percentage = total > 0 ? ((double)(present + late) / total) * 100.0 : 100.0;
        percentage = Math.round(percentage * 10.0) / 10.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("studentId", studentId);
        summary.put("totalDays", total);
        summary.put("presentDays", present);
        summary.put("absentDays", absent);
        summary.put("lateDays", late);
        summary.put("excusedDays", excused);
        summary.put("attendancePercentage", percentage);

        return summary;
    }
}
