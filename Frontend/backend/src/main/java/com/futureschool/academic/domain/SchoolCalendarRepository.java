package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolCalendarRepository extends JpaRepository<SchoolCalendar, UUID> {
    List<SchoolCalendar> findBySchoolAndAcademicYearOrderByVersionDesc(School school, AcademicYear academicYear);
    Optional<SchoolCalendar> findBySchoolAndAcademicYearAndStatus(School school, AcademicYear academicYear, CalendarStatus status);
    Optional<SchoolCalendar> findBySchoolAndAcademicYearAndVersion(School school, AcademicYear academicYear, int version);
    Optional<SchoolCalendar> findBySchool_SchoolIdAndCalendarId(UUID schoolId, UUID calendarId);
    boolean existsBySchoolAndAcademicYearAndStatus(School school, AcademicYear academicYear, CalendarStatus status);
}
