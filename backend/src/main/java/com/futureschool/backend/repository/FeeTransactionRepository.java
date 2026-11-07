package com.futureschool.backend.repository;

import com.futureschool.backend.entity.FeeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeTransactionRepository extends JpaRepository<FeeTransaction, String> {
    List<FeeTransaction> findByStudentIdOrderByPaymentDateDesc(String studentId);
    List<FeeTransaction> findByClassId(String classId);
    Optional<FeeTransaction> findByReceiptNumber(String receiptNumber);
}
