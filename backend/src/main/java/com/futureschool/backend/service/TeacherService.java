package com.futureschool.backend.service;

import com.futureschool.backend.entity.Teacher;
import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.entity.UserRole;
import com.futureschool.backend.repository.TeacherRepository;
import com.futureschool.backend.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(
            TeacherRepository teacherRepository,
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.teacherRepository = teacherRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(String id) {
        Optional<Teacher> t = teacherRepository.findById(id);
        if (t.isPresent()) return t;
        return teacherRepository.findByTeacherIdIgnoreCase(id);
    }

    @Transactional
    public Teacher createTeacher(Teacher teacher, String initialPassword) {
        if (teacher.getTeacherId() == null || teacher.getTeacherId().isBlank()) {
            teacher.setTeacherId("TCH" + String.format("%04d", (int)(teacherRepository.count() + 1)));
        }
        if (teacher.getId() == null || teacher.getId().isBlank()) {
            teacher.setId("TCH-" + teacher.getTeacherId());
        }

        Teacher saved = teacherRepository.save(teacher);

        // Auto-create teacher login account
        if (!userAccountRepository.existsByLoginIdIgnoreCase(saved.getTeacherId())) {
            String pwd = (initialPassword != null && !initialPassword.isBlank()) ? initialPassword : "password123";
            UserAccount account = UserAccount.builder()
                    .id("USR-" + saved.getTeacherId())
                    .loginId(saved.getTeacherId())
                    .password(passwordEncoder.encode(pwd))
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(UserRole.TEACHER)
                    .teacherId(saved.getTeacherId())
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(account);
        }

        return saved;
    }

    @Transactional
    public Teacher updateTeacher(String id, Teacher updated) {
        Teacher existing = getTeacherById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setDesignation(updated.getDesignation());
        existing.setQualification(updated.getQualification());
        existing.setPrimarySubject(updated.getPrimarySubject());
        existing.setActive(updated.isActive());

        // Update corresponding user account name/email
        userAccountRepository.findByLoginIdIgnoreCase(existing.getTeacherId()).ifPresent(acc -> {
            acc.setName(updated.getName());
            acc.setEmail(updated.getEmail());
            acc.setActive(updated.isActive());
            userAccountRepository.save(acc);
        });

        return teacherRepository.save(existing);
    }

    @Transactional
    public void deleteTeacher(String id) {
        Teacher existing = getTeacherById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + id));
        userAccountRepository.findByLoginIdIgnoreCase(existing.getTeacherId()).ifPresent(userAccountRepository::delete);
        teacherRepository.delete(existing);
    }
}
