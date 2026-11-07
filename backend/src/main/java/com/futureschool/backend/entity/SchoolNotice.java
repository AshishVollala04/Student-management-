package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "school_notices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolNotice {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "category", nullable = false, length = 32)
    @Builder.Default
    private String category = "GENERAL"; // GENERAL, ACADEMIC, EXAM, EVENT, HOLIDAY

    @Column(name = "audience", nullable = false, length = 32)
    @Builder.Default
    private String audience = "ALL"; // ALL, STUDENTS, TEACHERS, PARENTS

    @Column(name = "priority", length = 16)
    @Builder.Default
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW

    @Column(name = "published_date", nullable = false)
    private LocalDate publishedDate;

    @Column(name = "author_name", length = 128)
    private String authorName;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
