package com.futureschool.backend.controller;

import com.futureschool.backend.entity.StudyMaterial;
import com.futureschool.backend.service.StudyMaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
@Tag(name = "Study Materials", description = "Endpoints for sharing syllabus, study notes, and digital reference documents")
public class StudyMaterialController {

    private final StudyMaterialService studyMaterialService;

    public StudyMaterialController(StudyMaterialService studyMaterialService) {
        this.studyMaterialService = studyMaterialService;
    }

    @GetMapping
    @Operation(summary = "Get study materials (filter by classId and optional subject)")
    public ResponseEntity<List<StudyMaterial>> getMaterials(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String subject
    ) {
        if (classId != null && !classId.isBlank()) {
            return ResponseEntity.ok(studyMaterialService.getMaterialsByClass(classId, subject));
        }
        return ResponseEntity.ok(studyMaterialService.getAllMaterials());
    }

    @PostMapping
    @Operation(summary = "Upload or share new study material")
    public ResponseEntity<StudyMaterial> uploadMaterial(@RequestBody StudyMaterial material) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String uploader = (auth != null) ? auth.getName() : "Faculty";
        return ResponseEntity.ok(studyMaterialService.uploadMaterial(material, uploader));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete study material by ID")
    public ResponseEntity<?> deleteMaterial(@PathVariable String id) {
        studyMaterialService.deleteMaterial(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Material deleted: " + id));
    }
}
