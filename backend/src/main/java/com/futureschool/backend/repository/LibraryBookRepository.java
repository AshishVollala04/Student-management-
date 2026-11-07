package com.futureschool.backend.repository;

import com.futureschool.backend.entity.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryBookRepository extends JpaRepository<LibraryBook, String> {
    List<LibraryBook> findByCategory(String category);

    @Query("SELECT b FROM LibraryBook b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<LibraryBook> searchBooks(@Param("query") String query);
}
