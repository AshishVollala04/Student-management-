package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FamilyRelationshipRepository extends JpaRepository<FamilyRelationship, UUID> {
    List<FamilyRelationship> findByStudent(Student student);
    List<FamilyRelationship> findByGuardian(ParentGuardian guardian);
    Optional<FamilyRelationship> findByStudentAndGuardian(Student student, ParentGuardian guardian);
    List<FamilyRelationship> findBySchoolAndStudent(School school, Student student);
}
