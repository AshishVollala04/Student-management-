package com.futureschool.backend.service;

import com.futureschool.backend.entity.Parent;
import com.futureschool.backend.entity.Student;
import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.entity.UserRole;
import com.futureschool.backend.repository.ParentRepository;
import com.futureschool.backend.repository.StudentRepository;
import com.futureschool.backend.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ParentService {

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public ParentService(
            ParentRepository parentRepository,
            StudentRepository studentRepository,
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public Optional<Parent> getParentById(String id) {
        Optional<Parent> p = parentRepository.findById(id);
        if (p.isPresent()) return p;
        return parentRepository.findByLoginIdIgnoreCase(id);
    }

    @Transactional
    public Parent createParent(Parent parent, String initialPassword) {
        if (parent.getLoginId() == null || parent.getLoginId().isBlank()) {
            parent.setLoginId("PAR" + String.format("%04d", (int)(parentRepository.count() + 1)));
        }
        if (parent.getId() == null || parent.getId().isBlank()) {
            parent.setId("PRT-" + parent.getLoginId());
        }

        Parent saved = parentRepository.save(parent);

        // Auto-create parent user account
        if (!userAccountRepository.existsByLoginIdIgnoreCase(saved.getLoginId())) {
            String pwd = (initialPassword != null && !initialPassword.isBlank()) ? initialPassword : "password123";
            UserAccount account = UserAccount.builder()
                    .id("USR-" + saved.getLoginId())
                    .loginId(saved.getLoginId())
                    .password(passwordEncoder.encode(pwd))
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(UserRole.PARENT)
                    .status("Active")
                    .active(true)
                    .linkedStudentIds(new ArrayList<>())
                    .build();
            userAccountRepository.save(account);
        }

        return saved;
    }

    @Transactional
    public Parent updateParent(String id, Parent updated) {
        Parent existing = getParentById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found with ID: " + id));

        existing.setName(updated.getName());
        existing.setMobile(updated.getMobile());
        existing.setEmail(updated.getEmail());
        existing.setOccupation(updated.getOccupation());
        existing.setAddress(updated.getAddress());

        userAccountRepository.findByLoginIdIgnoreCase(existing.getLoginId()).ifPresent(acc -> {
            acc.setName(updated.getName());
            acc.setEmail(updated.getEmail());
            userAccountRepository.save(acc);
        });

        return parentRepository.save(existing);
    }

    @Transactional
    public void linkStudentToParent(String parentLoginId, String studentId) {
        Parent parent = getParentById(parentLoginId)
                .orElseThrow(() -> new RuntimeException("Parent not found: " + parentLoginId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        // Update student's parent link
        student.setParentAccountId(parent.getLoginId());
        student.setParentName(parent.getName());
        student.setParentMobile(parent.getMobile());
        student.setParentEmail(parent.getEmail());
        studentRepository.save(student);

        // Update parent user account's linked student IDs list
        userAccountRepository.findByLoginIdIgnoreCase(parent.getLoginId()).ifPresent(acc -> {
            if (!acc.getLinkedStudentIds().contains(studentId)) {
                acc.getLinkedStudentIds().add(studentId);
                userAccountRepository.save(acc);
            }
        });
    }

    @Transactional
    public void deleteParent(String id) {
        Parent existing = getParentById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found with ID: " + id));
        userAccountRepository.findByLoginIdIgnoreCase(existing.getLoginId()).ifPresent(userAccountRepository::delete);
        parentRepository.delete(existing);
    }
}
