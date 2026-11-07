package com.futureschool.backend.controller;

import com.futureschool.backend.entity.Quiz;
import com.futureschool.backend.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quizzes & Assessments", description = "Endpoints for online interactive quizzes and practice questions")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    @Operation(summary = "Get quizzes (optional filter by classId)")
    public ResponseEntity<List<Quiz>> getQuizzes(@RequestParam(required = false) String classId) {
        if (classId != null && !classId.isBlank()) {
            return ResponseEntity.ok(quizService.getQuizzesByClass(classId));
        }
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @PostMapping
    @Operation(summary = "Create an online quiz")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String creator = (auth != null) ? auth.getName() : "Faculty";
        return ResponseEntity.ok(quizService.createQuiz(quiz, creator));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz by ID")
    public ResponseEntity<?> deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Quiz deleted: " + id));
    }
}
