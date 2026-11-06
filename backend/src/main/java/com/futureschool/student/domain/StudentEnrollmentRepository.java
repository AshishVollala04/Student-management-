package com.futureschool.student.domain;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.SchoolClass;
import com.futureschool.academic.domain.Section;
import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, UUID> {
    Optional<StudentEnrollment> findByStudentAndAcademicYear(Student student, AcademicYear academicYear);
    Optional<StudentEnrollment> findBySchoolAndStudentAndAcademicYear(School school, Student student, AcademicYear academicYear);
    List<StudentEnrollment> findByStudent(Student student);
    List<StudentEnrollment> findBySectionAndAcademicYearOrderByRollNumberAsc(Section section, AcademicYear academicYear);
    List<StudentEnrollment> findBySchoolAndAcademicYear(School school, AcademicYear academicYear);
    long countBySectionAndAcademicYearAndStatus(Section section, AcademicYear academicYear, String status);
    long countBySchoolClassAndAcademicYearAndStatus(SchoolClass schoolClass, AcademicYear academicYear, String status);
}
