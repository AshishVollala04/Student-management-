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

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserAccountRepository userAccountRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(
            StudentRepository studentRepository,
            UserAccountRepository userAccountRepository,
            ParentRepository parentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.studentRepository = studentRepository;
        this.userAccountRepository = userAccountRepository;
        this.parentRepository = parentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(String id) {
        Optional<Student> s = studentRepository.findById(id);
        if (s.isPresent()) return s;
        return studentRepository.findByAdmissionNumber(id);
    }

    public List<Student> getStudentsByClassId(String classId) {
        return studentRepository.findByClassIdOrderByRollAsc(classId);
    }

    public List<Student> getStudentsByParentAccountId(String parentAccountId) {
        return studentRepository.findByParentAccountId(parentAccountId);
    }

    public List<Student> getStudentsByIds(List<String> ids) {
        return studentRepository.findByIdIn(ids);
    }

    public List<Student> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        return studentRepository.searchStudents(query.trim());
    }

    @Transactional
    public Student createStudent(Student student, String initialPassword) {
        if (student.getId() == null || student.getId().isBlank()) {
            student.setId("STU" + String.format("%04d", (int)(studentRepository.count() + 1)));
        }
        if (student.getAdmissionNumber() == null || student.getAdmissionNumber().isBlank()) {
            student.setAdmissionNumber("ADM2026-" + student.getId());
        }
        if (student.getStatus() == null || student.getStatus().isBlank()) {
            student.setStatus("Active");
        }

        // If parentAccountId is supplied, try to sync parent details
        if (student.getParentAccountId() != null && !student.getParentAccountId().isBlank()) {
            parentRepository.findByLoginIdIgnoreCase(student.getParentAccountId()).ifPresent(p -> {
                if (student.getParentName() == null) student.setParentName(p.getName());
                if (student.getParentMobile() == null) student.setParentMobile(p.getMobile());
                if (student.getParentEmail() == null) student.setParentEmail(p.getEmail());
                if (student.getAddress() == null) student.setAddress(p.getAddress());
            });
        }

        Student saved = studentRepository.save(student);

        // Auto-create student login account
        if (!userAccountRepository.existsByLoginIdIgnoreCase(saved.getId())) {
            String pwd = (initialPassword != null && !initialPassword.isBlank()) ? initialPassword : "password123";
            String email = (saved.getParentEmail() != null) ? saved.getParentEmail() : saved.getId().toLowerCase() + "@student.futureschool.edu";
            UserAccount account = UserAccount.builder()
                    .id("USR-" + saved.getId())
                    .loginId(saved.getId())
                    .password(passwordEncoder.encode(pwd))
                    .name(saved.getName())
                    .email(email)
                    .role(UserRole.STUDENT)
                    .studentId(saved.getId())
                    .status("Active")
                    .active(true)
                    .build();
            userAccountRepository.save(account);
        }

        // If parent exists, automatically link this child to parent's account
        if (saved.getParentAccountId() != null && !saved.getParentAccountId().isBlank()) {
            userAccountRepository.findByLoginIdIgnoreCase(saved.getParentAccountId()).ifPresent(acc -> {
                if (!acc.getLinkedStudentIds().contains(saved.getId())) {
                    acc.getLinkedStudentIds().add(saved.getId());
                    userAccountRepository.save(acc);
                }
            });
        }

        return saved;
    }

    @Transactional
    public Student updateStudent(String id, Student updated) {
        Student existing = getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        existing.setName(updated.getName());
        existing.setDob(updated.getDob());
        existing.setGender(updated.getGender());
        existing.setClassId(updated.getClassId());
        existing.setClassName(updated.getClassName());
        existing.setSection(updated.getSection());
        existing.setRoll(updated.getRoll());
        existing.setParentAccountId(updated.getParentAccountId());
        existing.setParentName(updated.getParentName());
        existing.setParentMobile(updated.getParentMobile());
        existing.setParentEmail(updated.getParentEmail());
        existing.setAddress(updated.getAddress());
        existing.setDistrict(updated.getDistrict());
        existing.setMandal(updated.getMandal());
        existing.setPincode(updated.getPincode());
        existing.setAadhaarNumber(updated.getAadhaarNumber());
        existing.setApaarId(updated.getApaarId());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setCasteCategory(updated.getCasteCategory());
        existing.setSubCaste(updated.getSubCaste());
        existing.setReligion(updated.getReligion());
        existing.setMotherTongue(updated.getMotherTongue());
        existing.setFatherName(updated.getFatherName());
        existing.setFatherMobile(updated.getFatherMobile());
        existing.setFatherOccupation(updated.getFatherOccupation());
        existing.setFatherAadhaar(updated.getFatherAadhaar());
        existing.setMotherName(updated.getMotherName());
        existing.setMotherMobile(updated.getMotherMobile());
        existing.setMotherOccupation(updated.getMotherOccupation());
        existing.setMotherAadhaar(updated.getMotherAadhaar());
        existing.setMediumOfInstruction(updated.getMediumOfInstruction());
        existing.setSecondLanguage(updated.getSecondLanguage());
        existing.setPreviousSchool(updated.getPreviousSchool());
        existing.setTcNumber(updated.getTcNumber());
        existing.setTransportRouteId(updated.getTransportRouteId());
        existing.setStatus(updated.getStatus());
        if (updated.getFeeBalance() != null) existing.setFeeBalance(updated.getFeeBalance());

        // Update corresponding user account name
        userAccountRepository.findByLoginIdIgnoreCase(existing.getId()).ifPresent(acc -> {
            acc.setName(updated.getName());
            userAccountRepository.save(acc);
        });

        return studentRepository.save(existing);
    }

    @Transactional
    public void deleteStudent(String id) {
        Student existing = getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        userAccountRepository.findByLoginIdIgnoreCase(existing.getId()).ifPresent(userAccountRepository::delete);
        studentRepository.delete(existing);
    }

    @Transactional
    public Student recordExit(String id, String effectiveDate, String reason, String destinationSchool) {
        Student existing = getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        existing.setStatus("Transferred");
        existing.setExitDate(effectiveDate);
        existing.setExitReason(reason);
        existing.setDestinationSchool(destinationSchool);

        // Deactivate student account
        userAccountRepository.findByLoginIdIgnoreCase(existing.getId()).ifPresent(acc -> {
            acc.setActive(false);
            acc.setStatus("Inactive");
            userAccountRepository.save(acc);
        });

        return studentRepository.save(existing);
    }

    @Transactional
    public Student updateHallTicket(String id, Boolean released, Boolean approved) {
        Student existing = getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        if (released != null) existing.setHallTicketReleased(released);
        if (approved != null) existing.setHallTicketApproved(approved);

        return studentRepository.save(existing);
    }
}
