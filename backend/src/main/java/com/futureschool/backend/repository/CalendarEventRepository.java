package com.futureschool.backend.repository;

import com.futureschool.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, String> {
    List<CalendarEvent> findByStartDateBetweenOrderByStartDateAsc(LocalDate start, LocalDate end);
    List<CalendarEvent> findAllByOrderByStartDateAsc();
}
