package com.futureschool.backend.repository;

import com.futureschool.backend.entity.SubjectAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectAllocationRepository extends JpaRepository<SubjectAllocation, String> {
    List<SubjectAllocation> findByClassId(String classId);
    List<SubjectAllocation> findByTeacherId(String teacherId);
    List<SubjectAllocation> findByActiveTrue();
}
