package com.futureschool.academic.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolCalendarEntryRepository extends JpaRepository<SchoolCalendarEntry, UUID> {
    List<SchoolCalendarEntry> findByCalendarOrderByEntryDateAsc(SchoolCalendar calendar);
    Optional<SchoolCalendarEntry> findByCalendarAndEntryDate(SchoolCalendar calendar, LocalDate entryDate);
    boolean existsByCalendarAndEntryDate(SchoolCalendar calendar, LocalDate entryDate);
    boolean existsByCalendarAndEntryDateAndEntryIdNot(SchoolCalendar calendar, LocalDate entryDate, UUID entryId);
    List<SchoolCalendarEntry> findBySchoolAndEntryDateBetweenOrderByEntryDateAsc(School school, LocalDate startDate, LocalDate endDate);
}
