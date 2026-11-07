package com.futureschool.allocation.domain;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.Section;
import com.futureschool.platform.school.domain.School;
import com.futureschool.staff.domain.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassTeacherAssignmentRepository extends JpaRepository<ClassTeacherAssignment, UUID> {
    Optional<ClassTeacherAssignment> findBySectionAndAcademicYear(Section section, AcademicYear academicYear);
    List<ClassTeacherAssignment> findByStaffAndAcademicYear(Staff staff, AcademicYear academicYear);
    List<ClassTeacherAssignment> findBySchoolAndAcademicYear(School school, AcademicYear academicYear);
    boolean existsByStaff_StaffIdAndSection_SectionId(UUID staffId, UUID sectionId);
    boolean existsByStaff_StaffIdAndSection_SchoolClass_ClassId(UUID staffId, UUID classId);
}
