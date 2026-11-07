package com.futureschool.backend.repository;

import com.futureschool.backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    List<Complaint> findBySubmittedByIdOrderByCreatedAtDesc(String submittedById);
    List<Complaint> findByStatus(String status);
    Optional<Complaint> findByTicketNumber(String ticketNumber);
}
