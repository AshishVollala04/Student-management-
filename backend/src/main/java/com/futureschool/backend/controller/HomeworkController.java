package com.futureschool.backend.controller;

import com.futureschool.backend.entity.Homework;
import com.futureschool.backend.service.HomeworkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homework")
@Tag(name = "Homework & Assignments", description = "Endpoints for teachers creating assignments and students/parents viewing homework")
public class HomeworkController {

    private final HomeworkService homeworkService;

    public HomeworkController(HomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    @GetMapping
    @Operation(summary = "Get homework assignments (filter by classId or teacherId)")
    public ResponseEntity<List<Homework>> getHomework(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String teacherId
    ) {
        if (classId != null && !classId.isBlank()) {
            return ResponseEntity.ok(homeworkService.getHomeworkByClass(classId));
        }
        if (teacherId != null && !teacherId.isBlank()) {
            return ResponseEntity.ok(homeworkService.getHomeworkByTeacher(teacherId));
        }
        return ResponseEntity.ok(homeworkService.getAllHomework());
    }

    @PostMapping
    @Operation(summary = "Assign new homework to a class")
    public ResponseEntity<Homework> createHomework(@RequestBody Homework hw) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String teacherId = (auth != null) ? auth.getName() : "Faculty";
        return ResponseEntity.ok(homeworkService.createHomework(hw, teacherId, teacherId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete homework assignment")
    public ResponseEntity<?> deleteHomework(@PathVariable String id) {
        homeworkService.deleteHomework(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Homework deleted: " + id));
    }
}
