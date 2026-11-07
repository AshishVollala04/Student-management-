package com.futureschool.backend.repository;

import com.futureschool.backend.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, String> {
    List<StudyMaterial> findByClassIdOrderByUploadedAtDesc(String classId);
    List<StudyMaterial> findByClassIdAndSubject(String classId, String subject);
}
