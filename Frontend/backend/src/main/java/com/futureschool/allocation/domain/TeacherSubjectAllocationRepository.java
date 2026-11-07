package com.futureschool.allocation.domain;

import com.futureschool.academic.domain.AcademicYear;
import com.futureschool.academic.domain.Section;
import com.futureschool.academic.domain.Subject;
import com.futureschool.platform.school.domain.School;
import com.futureschool.staff.domain.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherSubjectAllocationRepository extends JpaRepository<TeacherSubjectAllocation, UUID> {
    List<TeacherSubjectAllocation> findByStaffAndAcademicYear(Staff staff, AcademicYear academicYear);
    List<TeacherSubjectAllocation> findBySectionAndAcademicYear(Section section, AcademicYear academicYear);
    Optional<TeacherSubjectAllocation> findByStaffAndSectionAndSubjectAndAcademicYear(Staff staff, Section section, Subject subject, AcademicYear academicYear);
    List<TeacherSubjectAllocation> findBySchoolAndAcademicYear(School school, AcademicYear academicYear);
    boolean existsByStaff_StaffIdAndSection_SectionIdAndSubject_SubjectId(UUID staffId, UUID sectionId, UUID subjectId);
    boolean existsByStaff_StaffIdAndSection_SchoolClass_ClassId(UUID staffId, UUID classId);
}
