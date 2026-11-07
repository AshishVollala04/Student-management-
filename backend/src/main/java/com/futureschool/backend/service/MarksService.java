package com.futureschool.backend.service;

import com.futureschool.backend.entity.MarksRecord;
import com.futureschool.backend.repository.MarksRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MarksService {

    private final MarksRecordRepository marksRecordRepository;

    public MarksService(MarksRecordRepository marksRecordRepository) {
        this.marksRecordRepository = marksRecordRepository;
    }

    public List<MarksRecord> getClassMarks(String classId, String exam, String subject) {
        if (exam != null && subject != null) {
            return marksRecordRepository.findByClassIdAndExamAndSubject(classId, exam, subject);
        }
        return marksRecordRepository.findByClassId(classId);
    }

    public List<MarksRecord> getStudentMarks(String studentId, String exam) {
        if (exam != null && !exam.isBlank()) {
            return marksRecordRepository.findByStudentIdAndExam(studentId, exam);
        }
        return marksRecordRepository.findByStudentId(studentId);
    }

    @Transactional
    public List<MarksRecord> enterMarks(List<MarksRecord> records, String enteredByTeacherId) {
        List<MarksRecord> savedList = new ArrayList<>();

        for (MarksRecord r : records) {
            // Calculate percentage & grade
            double max = (r.getMaximumMarks() != null && r.getMaximumMarks() > 0) ? r.getMaximumMarks() : 100.0;
            double score = (r.getScore() != null) ? r.getScore() : 0.0;
            double pct = Math.round((score / max) * 100.0 * 10.0) / 10.0;
            String grade = calculateGrade(pct);

            r.setMaximumMarks(max);
            r.setScore(score);
            r.setPercentage(pct);
            r.setGrade(grade);
            if (enteredByTeacherId != null) r.setEnteredByTeacherId(enteredByTeacherId);
            if (r.getStatus() == null) r.setStatus("Draft");

            // Check if record exists for student + exam + subject
            Optional<MarksRecord> existing = marksRecordRepository.findByStudentIdAndExamAndSubject(
                    r.getStudentId(), r.getExam(), r.getSubject());

            if (existing.isPresent()) {
                MarksRecord ex = existing.get();
                ex.setScore(score);
                ex.setMaximumMarks(max);
                ex.setPercentage(pct);
                ex.setGrade(grade);
                ex.setStatus(r.getStatus());
                ex.setRemarks(r.getRemarks());
                savedList.add(marksRecordRepository.save(ex));
            } else {
                if (r.getId() == null || r.getId().isBlank()) {
                    r.setId("MRK-" + r.getStudentId() + "-" + r.getSubject().replaceAll("\\s+", "") + "-" + r.getExam().replaceAll("\\s+", ""));
                }
                savedList.add(marksRecordRepository.save(r));
            }
        }

        return savedList;
    }

    @Transactional
    public MarksRecord verifyMarks(String id, String verifiedByUserId) {
        MarksRecord record = marksRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks record not found: " + id));
        record.setStatus("Verified");
        record.setVerifiedByUserId(verifiedByUserId);
        return marksRecordRepository.save(record);
    }

    @Transactional
    public List<MarksRecord> publishMarks(List<String> ids) {
        List<MarksRecord> records = marksRecordRepository.findAllById(ids);
        for (MarksRecord r : records) {
            r.setStatus("Published");
        }
        return marksRecordRepository.saveAll(records);
    }

    private String calculateGrade(double pct) {
        if (pct >= 90.0) return "A+";
        if (pct >= 80.0) return "A";
        if (pct >= 70.0) return "B+";
        if (pct >= 60.0) return "B";
        if (pct >= 50.0) return "C";
        if (pct >= 40.0) return "D";
        return "F";
    }
}
