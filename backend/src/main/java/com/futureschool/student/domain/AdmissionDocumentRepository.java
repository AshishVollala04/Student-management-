package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdmissionDocumentRepository extends JpaRepository<AdmissionDocument, UUID> {
    Optional<AdmissionDocument> findBySchoolAndDocumentId(School school, UUID documentId);
    List<AdmissionDocument> findByApplicationOrderByCreatedAtAsc(AdmissionApplication application);
    List<AdmissionDocument> findByStudentOrderByCreatedAtAsc(Student student);
    List<AdmissionDocument> findBySchoolAndVerificationStatus(School school, VerificationStatus status);
}
