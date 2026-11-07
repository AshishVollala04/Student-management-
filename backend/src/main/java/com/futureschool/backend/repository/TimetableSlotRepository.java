package com.futureschool.backend.repository;

import com.futureschool.backend.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, String> {
    List<TimetableSlot> findByClassIdOrderByDayOfWeekAscPeriodNumberAsc(String classId);
    List<TimetableSlot> findByTeacherIdOrderByDayOfWeekAscPeriodNumberAsc(String teacherId);
    void deleteByClassId(String classId);
}
