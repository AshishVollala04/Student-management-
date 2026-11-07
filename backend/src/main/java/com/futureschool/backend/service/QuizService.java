package com.futureschool.backend.service;

import com.futureschool.backend.entity.Quiz;
import com.futureschool.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public List<Quiz> getQuizzesByClass(String classId) {
        return quizRepository.findByClassIdAndActiveTrue(classId);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional
    public Quiz createQuiz(Quiz quiz, String createdBy) {
        if (quiz.getId() == null || quiz.getId().isBlank()) {
            quiz.setId("QZ-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (createdBy != null) quiz.setCreatedBy(createdBy);
        quiz.setActive(true);
        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(String id) {
        quizRepository.deleteById(id);
    }
}
