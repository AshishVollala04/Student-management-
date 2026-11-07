package com.futureschool.backend.repository;

import com.futureschool.backend.entity.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, String> {
    List<Homework> findByClassIdOrderByDueDateDesc(String classId);
    List<Homework> findByTeacherIdOrderByDueDateDesc(String teacherId);
}
