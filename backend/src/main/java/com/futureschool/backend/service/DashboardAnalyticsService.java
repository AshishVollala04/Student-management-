package com.futureschool.backend.service;

import com.futureschool.backend.entity.MarksRecord;
import com.futureschool.backend.entity.Student;
import com.futureschool.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardAnalyticsService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final FeeTransactionRepository feeTransactionRepository;
    private final MarksRecordRepository marksRepository;
    private final ComplaintRepository complaintRepository;
    private final SchoolNoticeRepository noticeRepository;

    public DashboardAnalyticsService(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ParentRepository parentRepository,
            SchoolClassRepository schoolClassRepository,
            AttendanceRecordRepository attendanceRepository,
            FeeTransactionRepository feeTransactionRepository,
            MarksRecordRepository marksRepository,
            ComplaintRepository complaintRepository,
            SchoolNoticeRepository noticeRepository
    ) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.parentRepository = parentRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeTransactionRepository = feeTransactionRepository;
        this.marksRepository = marksRepository;
        this.complaintRepository = complaintRepository;
        this.noticeRepository = noticeRepository;
    }

    public Map<String, Object> getDashboardStats(String role, String userId) {
        Map<String, Object> stats = new HashMap<>();

        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalClasses = schoolClassRepository.count();
        long totalParents = parentRepository.count();

        // Today's attendance
        LocalDate today = LocalDate.now();
        long todayPresent = attendanceRepository.findAll().stream()
                .filter(a -> today.equals(a.getAttendanceDate()) && "Present".equalsIgnoreCase(a.getStatus()))
                .count();
        long todayTotal = attendanceRepository.findAll().stream()
                .filter(a -> today.equals(a.getAttendanceDate()))
                .count();
        double attendancePct = todayTotal > 0 ? Math.round(((double) todayPresent / todayTotal) * 1000.0) / 10.0 : 96.5;

        // Fees
        double totalFeesCollected = feeTransactionRepository.findAll().stream()
                .mapToDouble(f -> f.getAmount() != null ? f.getAmount() : 0.0)
                .sum();
        double totalOverdueFees = studentRepository.findAll().stream()
                .mapToDouble(s -> s.getFeeBalance() != null ? s.getFeeBalance() : 0.0)
                .sum();

        // Operational
        long openComplaints = complaintRepository.findByStatus("OPEN").size();
        long activeNotices = noticeRepository.findByActiveTrueOrderByPublishedDateDesc().size();

        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("totalClasses", totalClasses);
        stats.put("totalParents", totalParents);
        stats.put("attendancePercentage", attendancePct);
        stats.put("feesCollected", totalFeesCollected);
        stats.put("feesPending", totalOverdueFees);
        stats.put("openComplaints", openComplaints);
        stats.put("activeNotices", activeNotices);
        stats.put("role", role);

        return stats;
    }

    public Map<String, Object> getLeaderboard() {
        List<MarksRecord> allMarks = marksRepository.findAll();

        // Group by student
        Map<String, List<MarksRecord>> byStudent = allMarks.stream()
                .collect(Collectors.groupingBy(MarksRecord::getStudentId));

        List<Map<String, Object>> studentRankings = new ArrayList<>();
        for (Map.Entry<String, List<MarksRecord>> entry : byStudent.entrySet()) {
            String studentId = entry.getKey();
            List<MarksRecord> recs = entry.getValue();
            double avg = recs.stream().mapToDouble(r -> r.getPercentage() != null ? r.getPercentage() : 0.0).average().orElse(0.0);
            String name = recs.get(0).getStudentName();
            String classId = recs.get(0).getClassId();

            Map<String, Object> row = new HashMap<>();
            row.put("studentId", studentId);
            row.put("name", name);
            row.put("classId", classId);
            row.put("averageScore", Math.round(avg * 10.0) / 10.0);
            studentRankings.add(row);
        }

        studentRankings.sort((a, b) -> Double.compare((Double) b.get("averageScore"), (Double) a.get("averageScore")));

        return Map.of("studentRankings", studentRankings);
    }
}
