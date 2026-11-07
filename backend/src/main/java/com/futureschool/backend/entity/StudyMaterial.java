package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials", indexes = {
    @Index(name = "idx_mat_class_subject", columnList = "class_id, subject")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMaterial {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "class_id", nullable = false, length = 64)
    private String classId;

    @Column(name = "subject", nullable = false, length = 64)
    private String subject;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "material_type", length = 32)
    @Builder.Default
    private String materialType = "PDF"; // PDF, DOC, VIDEO_LINK, NOTES

    @Column(name = "file_url", length = 255)
    private String fileUrl;

    @Column(name = "uploaded_by", length = 128)
    private String uploadedBy;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
