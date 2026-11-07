package com.futureschool.backend.service;

import com.futureschool.backend.entity.FeeTransaction;
import com.futureschool.backend.entity.Student;
import com.futureschool.backend.repository.FeeTransactionRepository;
import com.futureschool.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeService {

    private final FeeTransactionRepository feeTransactionRepository;
    private final StudentRepository studentRepository;

    public FeeService(FeeTransactionRepository feeTransactionRepository, StudentRepository studentRepository) {
        this.feeTransactionRepository = feeTransactionRepository;
        this.studentRepository = studentRepository;
    }

    public List<FeeTransaction> getAllTransactions() {
        return feeTransactionRepository.findAll();
    }

    public List<FeeTransaction> getStudentTransactions(String studentId) {
        return feeTransactionRepository.findByStudentIdOrderByPaymentDateDesc(studentId);
    }

    public List<Student> getOverdueStudents() {
        return studentRepository.findAll().stream()
                .filter(s -> s.getFeeBalance() != null && s.getFeeBalance() > 0)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeeTransaction collectFee(FeeTransaction tx, String collectedBy) {
        Student student = studentRepository.findById(tx.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + tx.getStudentId()));

        if (tx.getReceiptNumber() == null || tx.getReceiptNumber().isBlank()) {
            long count = feeTransactionRepository.count() + 1;
            tx.setReceiptNumber("REC-2026-" + String.format("%04d", count));
        }
        if (tx.getId() == null || tx.getId().isBlank()) {
            tx.setId("FEE-" + tx.getReceiptNumber());
        }
        if (tx.getPaymentDate() == null) {
            tx.setPaymentDate(LocalDate.now());
        }
        if (tx.getStudentName() == null) {
            tx.setStudentName(student.getName());
        }
        if (tx.getClassId() == null) {
            tx.setClassId(student.getClassId());
        }
        if (collectedBy != null) {
            tx.setCollectedBy(collectedBy);
        }

        FeeTransaction saved = feeTransactionRepository.save(tx);

        // Deduct fee balance from student
        double currentBalance = (student.getFeeBalance() != null) ? student.getFeeBalance() : 0.0;
        double newBalance = Math.max(0.0, currentBalance - tx.getAmount());
        student.setFeeBalance(newBalance);
        studentRepository.save(student);

        return saved;
    }

    @Transactional
    public Student assignFee(String studentId, Double feeAmount) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        double currentBalance = (student.getFeeBalance() != null) ? student.getFeeBalance() : 0.0;
        student.setFeeBalance(currentBalance + feeAmount);
        return studentRepository.save(student);
    }
}
