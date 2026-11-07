package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "book_issue_records", indexes = {
    @Index(name = "idx_issue_student", columnList = "student_id"),
    @Index(name = "idx_issue_book", columnList = "book_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookIssueRecord {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "book_id", nullable = false, length = 64)
    private String bookId;

    @Column(name = "book_title", nullable = false, length = 255)
    private String bookTitle;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "Issued"; // Issued, Returned, Overdue

    @Column(name = "fine_amount")
    @Builder.Default
    private Double fineAmount = 0.0;
}
