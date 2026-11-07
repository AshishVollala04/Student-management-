package com.futureschool.backend.service;

import com.futureschool.backend.entity.TimetableSlot;
import com.futureschool.backend.repository.TimetableSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TimetableService {

    private final TimetableSlotRepository timetableSlotRepository;

    public TimetableService(TimetableSlotRepository timetableSlotRepository) {
        this.timetableSlotRepository = timetableSlotRepository;
    }

    public List<TimetableSlot> getClassTimetable(String classId) {
        return timetableSlotRepository.findByClassIdOrderByDayOfWeekAscPeriodNumberAsc(classId);
    }

    public List<TimetableSlot> getTeacherTimetable(String teacherId) {
        return timetableSlotRepository.findByTeacherIdOrderByDayOfWeekAscPeriodNumberAsc(teacherId);
    }

    @Transactional
    public TimetableSlot saveSlot(TimetableSlot slot) {
        if (slot.getId() == null || slot.getId().isBlank()) {
            slot.setId("TT-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return timetableSlotRepository.save(slot);
    }

    @Transactional
    public List<TimetableSlot> saveBulkSlots(String classId, List<TimetableSlot> slots) {
        timetableSlotRepository.deleteByClassId(classId);
        for (TimetableSlot s : slots) {
            if (s.getId() == null || s.getId().isBlank()) {
                s.setId("TT-" + UUID.randomUUID().toString().substring(0, 8));
            }
            s.setClassId(classId);
        }
        return timetableSlotRepository.saveAll(slots);
    }

    @Transactional
    public void deleteSlot(String id) {
        timetableSlotRepository.deleteById(id);
    }
}
