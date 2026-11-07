package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "teachers", indexes = {
    @Index(name = "idx_teacher_id", columnList = "teacher_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "teacher_id", nullable = false, unique = true, length = 64)
    private String teacherId;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "email", length = 128)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @Column(name = "designation", length = 64)
    private String designation;

    @Column(name = "qualification", length = 128)
    private String qualification;

    @Column(name = "primary_subject", length = 64)
    private String primarySubject;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
