package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "library_books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryBook {

    @Id
    @Column(name = "id", length = 64)
    private String id; // e.g. "BK-1001"

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "author", nullable = false, length = 128)
    private String author;

    @Column(name = "isbn", length = 64)
    private String isbn;

    @Column(name = "category", length = 64)
    private String category; // Fiction, Science, Mathematics, History, Reference

    @Column(name = "shelf_location", length = 32)
    private String shelfLocation;

    @Column(name = "total_copies", nullable = false)
    @Builder.Default
    private int totalCopies = 1;

    @Column(name = "available_copies", nullable = false)
    @Builder.Default
    private int availableCopies = 1;
}
