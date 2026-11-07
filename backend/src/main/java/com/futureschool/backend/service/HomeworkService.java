package com.futureschool.backend.service;

import com.futureschool.backend.entity.Homework;
import com.futureschool.backend.repository.HomeworkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class HomeworkService {

    private final HomeworkRepository homeworkRepository;

    public HomeworkService(HomeworkRepository homeworkRepository) {
        this.homeworkRepository = homeworkRepository;
    }

    public List<Homework> getHomeworkByClass(String classId) {
        return homeworkRepository.findByClassIdOrderByDueDateDesc(classId);
    }

    public List<Homework> getHomeworkByTeacher(String teacherId) {
        return homeworkRepository.findByTeacherIdOrderByDueDateDesc(teacherId);
    }

    public List<Homework> getAllHomework() {
        return homeworkRepository.findAll();
    }

    @Transactional
    public Homework createHomework(Homework hw, String teacherId, String teacherName) {
        if (hw.getId() == null || hw.getId().isBlank()) {
            hw.setId("HW-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (hw.getAssignedDate() == null) {
            hw.setAssignedDate(LocalDate.now());
        }
        if (teacherId != null) hw.setTeacherId(teacherId);
        if (teacherName != null) hw.setTeacherName(teacherName);
        if (hw.getStatus() == null) hw.setStatus("Active");

        return homeworkRepository.save(hw);
    }

    @Transactional
    public void deleteHomework(String id) {
        homeworkRepository.deleteById(id);
    }
}
