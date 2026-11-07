package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "school_classes", indexes = {
    @Index(name = "idx_class_section", columnList = "name, section", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "name", nullable = false, length = 64)
    private String name;

    @Column(name = "section", nullable = false, length = 16)
    private String section;

    @Column(name = "grade_number")
    private Integer gradeNumber;

    @Column(name = "school_level", length = 32)
    @Builder.Default
    private String schoolLevel = "Senior";

    @Column(name = "class_teacher_id", length = 64)
    private String classTeacherId;

    @Column(name = "class_teacher_name", length = 128)
    private String classTeacherName;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
