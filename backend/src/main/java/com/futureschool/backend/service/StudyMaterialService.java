package com.futureschool.backend.service;

import com.futureschool.backend.entity.StudyMaterial;
import com.futureschool.backend.repository.StudyMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class StudyMaterialService {

    private final StudyMaterialRepository studyMaterialRepository;

    public StudyMaterialService(StudyMaterialRepository studyMaterialRepository) {
        this.studyMaterialRepository = studyMaterialRepository;
    }

    public List<StudyMaterial> getMaterialsByClass(String classId, String subject) {
        if (subject != null && !subject.isBlank()) {
            return studyMaterialRepository.findByClassIdAndSubject(classId, subject);
        }
        return studyMaterialRepository.findByClassIdOrderByUploadedAtDesc(classId);
    }

    public List<StudyMaterial> getAllMaterials() {
        return studyMaterialRepository.findAll();
    }

    @Transactional
    public StudyMaterial uploadMaterial(StudyMaterial material, String uploadedBy) {
        if (material.getId() == null || material.getId().isBlank()) {
            material.setId("MAT-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (uploadedBy != null) material.setUploadedBy(uploadedBy);
        return studyMaterialRepository.save(material);
    }

    @Transactional
    public void deleteMaterial(String id) {
        studyMaterialRepository.deleteById(id);
    }
}
