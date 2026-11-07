package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parents", indexes = {
    @Index(name = "idx_parent_login_id", columnList = "login_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "login_id", nullable = false, unique = true, length = 64)
    private String loginId;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "mobile", length = 32)
    private String mobile;

    @Column(name = "email", length = 128)
    private String email;

    @Column(name = "occupation", length = 128)
    private String occupation;

    @Column(name = "address", length = 255)
    private String address;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
