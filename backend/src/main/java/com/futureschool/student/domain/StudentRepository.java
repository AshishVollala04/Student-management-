package com.futureschool.student.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findBySchoolAndStudentId(School school, UUID studentId);
    Optional<Student> findBySchoolAndStudentNumber(School school, String studentNumber);
    Optional<Student> findBySchool_SchoolIdAndStudentNumber(UUID schoolId, String studentNumber);
    Optional<Student> findBySchoolAndAdmissionNumber(School school, String admissionNumber);
    List<Student> findBySchoolOrderByLastNameAscFirstNameAsc(School school);
    boolean existsBySchoolAndStudentNumber(School school, String studentNumber);
    boolean existsBySchoolAndAdmissionNumber(School school, String admissionNumber);
    long countBySchool(School school);
}
