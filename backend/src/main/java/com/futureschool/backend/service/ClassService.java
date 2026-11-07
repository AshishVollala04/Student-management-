package com.futureschool.backend.service;

import com.futureschool.backend.entity.SchoolClass;
import com.futureschool.backend.entity.SubjectAllocation;
import com.futureschool.backend.repository.SchoolClassRepository;
import com.futureschool.backend.repository.SubjectAllocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final SubjectAllocationRepository subjectAllocationRepository;

    public ClassService(
            SchoolClassRepository schoolClassRepository,
            SubjectAllocationRepository subjectAllocationRepository
    ) {
        this.schoolClassRepository = schoolClassRepository;
        this.subjectAllocationRepository = subjectAllocationRepository;
    }

    public List<SchoolClass> getAllActiveClasses() {
        return schoolClassRepository.findByActiveTrueOrderByGradeNumberAscSectionAsc();
    }

    public Optional<SchoolClass> getClassById(String id) {
        return schoolClassRepository.findById(id);
    }

    @Transactional
    public SchoolClass createClass(SchoolClass schoolClass) {
        if (schoolClass.getId() == null || schoolClass.getId().isBlank()) {
            schoolClass.setId("class-" + schoolClass.getGradeNumber() + "-" + schoolClass.getSection().toLowerCase());
        }
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public SchoolClass updateClass(String id, SchoolClass updated) {
        SchoolClass existing = schoolClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found: " + id));

        existing.setName(updated.getName());
        existing.setSection(updated.getSection());
        existing.setGradeNumber(updated.getGradeNumber());
        existing.setSchoolLevel(updated.getSchoolLevel());
        existing.setClassTeacherId(updated.getClassTeacherId());
        existing.setClassTeacherName(updated.getClassTeacherName());
        existing.setActive(updated.isActive());

        return schoolClassRepository.save(existing);
    }

    @Transactional
    public void deleteClass(String id) {
        schoolClassRepository.deleteById(id);
    }

    // --- Subject Allocation Management ---
    public List<SubjectAllocation> getAllSubjectAllocations() {
        return subjectAllocationRepository.findAll();
    }

    public List<SubjectAllocation> getSubjectAllocationsByClass(String classId) {
        return subjectAllocationRepository.findByClassId(classId);
    }

    public List<SubjectAllocation> getSubjectAllocationsByTeacher(String teacherId) {
        return subjectAllocationRepository.findByTeacherId(teacherId);
    }

    @Transactional
    public SubjectAllocation saveSubjectAllocation(SubjectAllocation allocation) {
        if (allocation.getId() == null || allocation.getId().isBlank()) {
            allocation.setId("alloc-" + System.currentTimeMillis());
        }
        if (allocation.getRole() == null || allocation.getRole().isBlank()) {
            allocation.setRole("Teacher");
        }
        return subjectAllocationRepository.save(allocation);
    }

    @Transactional
    public void deleteSubjectAllocation(String id) {
        subjectAllocationRepository.deleteById(id);
    }
}
