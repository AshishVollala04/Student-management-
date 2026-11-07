package com.futureschool.backend.repository;

import com.futureschool.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    List<Student> findByClassIdOrderByRollAsc(String classId);
    List<Student> findByParentAccountId(String parentAccountId);
    List<Student> findByIdIn(List<String> ids);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.admissionNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.id) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(@Param("query") String query);

    long countByClassId(String classId);
}
