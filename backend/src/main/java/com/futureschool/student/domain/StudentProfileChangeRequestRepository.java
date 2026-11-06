package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileChangeRequestRepository extends JpaRepository<StudentProfileChangeRequest, UUID> {
    Optional<StudentProfileChangeRequest> findBySchoolAndRequestId(School school, UUID requestId);
    List<StudentProfileChangeRequest> findByStudentOrderByCreatedAtDesc(Student student);
    List<StudentProfileChangeRequest> findBySchoolAndStatusOrderByCreatedAtDesc(School school, ProfileChangeStatus status);
}
