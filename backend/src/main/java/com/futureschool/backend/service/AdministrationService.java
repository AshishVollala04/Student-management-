package com.futureschool.backend.service;

import com.futureschool.backend.entity.*;
import com.futureschool.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdministrationService {

    private final AcademicYearRepository academicYearRepository;
    private final StaffAttendanceRecordRepository staffAttendanceRepository;
    private final CertificateRecordRepository certificateRecordRepository;
    private final SchoolSettingRepository schoolSettingRepository;
    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;

    public AdministrationService(
            AcademicYearRepository academicYearRepository,
            StaffAttendanceRecordRepository staffAttendanceRepository,
            CertificateRecordRepository certificateRecordRepository,
            SchoolSettingRepository schoolSettingRepository,
            StudentRepository studentRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.academicYearRepository = academicYearRepository;
        this.staffAttendanceRepository = staffAttendanceRepository;
        this.certificateRecordRepository = certificateRecordRepository;
        this.schoolSettingRepository = schoolSettingRepository;
        this.studentRepository = studentRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    // --- Academic Years ---
    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }

    public Optional<AcademicYear> getCurrentAcademicYear() {
        return academicYearRepository.findByIsCurrentTrue();
    }

    @Transactional
    public AcademicYear saveAcademicYear(AcademicYear ay) {
        if (ay.getId() == null || ay.getId().isBlank()) {
            ay.setId("AY-" + ay.getName().replaceAll("\\s+", "-"));
        }
        if (ay.isCurrent()) {
            academicYearRepository.findAll().forEach(a -> {
                if (!a.getId().equals(ay.getId()) && a.isCurrent()) {
                    a.setCurrent(false);
                    academicYearRepository.save(a);
                }
            });
        }
        return academicYearRepository.save(ay);
    }

    // --- Staff Attendance ---
    public List<StaffAttendanceRecord> getStaffAttendance(LocalDate date) {
        return staffAttendanceRepository.findByAttendanceDate(date);
    }

    @Transactional
    public List<StaffAttendanceRecord> markStaffAttendance(LocalDate date, List<StaffAttendanceRecord> records) {
        staffAttendanceRepository.deleteByAttendanceDate(date);
        for (StaffAttendanceRecord r : records) {
            if (r.getId() == null || r.getId().isBlank()) {
                r.setId("STF-ATT-" + date + "-" + r.getTeacherId());
            }
            r.setAttendanceDate(date);
        }
        return staffAttendanceRepository.saveAll(records);
    }

    // --- Student Promotion ---
    @Transactional
    public int promoteStudents(String fromClassId, String toClassId, List<String> studentIds) {
        SchoolClass toClass = schoolClassRepository.findById(toClassId)
                .orElseThrow(() -> new RuntimeException("Target class not found: " + toClassId));

        List<Student> students = studentRepository.findByIdIn(studentIds);
        for (Student s : students) {
            s.setClassId(toClass.getId());
            s.setClassName(toClass.getName());
            s.setSection(toClass.getSection());
        }
        studentRepository.saveAll(students);
        return students.size();
    }

    // --- Certificates ---
    public List<CertificateRecord> getStudentCertificates(String studentId) {
        return certificateRecordRepository.findByStudentIdOrderByIssueDateDesc(studentId);
    }

    public List<CertificateRecord> getAllCertificates() {
        return certificateRecordRepository.findAll();
    }

    @Transactional
    public CertificateRecord issueCertificate(CertificateRecord cert, String issuedBy) {
        if (cert.getId() == null || cert.getId().isBlank()) {
            cert.setId("CRT-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (cert.getCertificateNumber() == null || cert.getCertificateNumber().isBlank()) {
            cert.setCertificateNumber("CERT-" + LocalDate.now().getYear() + "-" + String.format("%04d", certificateRecordRepository.count() + 1));
        }
        if (cert.getIssueDate() == null) {
            cert.setIssueDate(LocalDate.now());
        }
        if (issuedBy != null) {
            cert.setIssuedBy(issuedBy);
        }
        return certificateRecordRepository.save(cert);
    }

    // --- School Settings ---
    public SchoolSetting getSettings() {
        return schoolSettingRepository.findById("DEFAULT")
                .orElseGet(() -> schoolSettingRepository.save(SchoolSetting.builder().id("DEFAULT").build()));
    }

    @Transactional
    public SchoolSetting updateSettings(SchoolSetting updated) {
        updated.setId("DEFAULT");
        return schoolSettingRepository.save(updated);
    }
}
