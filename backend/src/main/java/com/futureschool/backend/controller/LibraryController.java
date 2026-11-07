package com.futureschool.backend.controller;

import com.futureschool.backend.entity.BookIssueRecord;
import com.futureschool.backend.entity.LibraryBook;
import com.futureschool.backend.service.LibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
@Tag(name = "Library Management", description = "Endpoints for library book catalog, borrowing, and returns")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/books")
    @Operation(summary = "Search & list library books")
    public ResponseEntity<List<LibraryBook>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(libraryService.getAllBooks(search, category));
    }

    @PostMapping("/books")
    @Operation(summary = "Add a new book to the library catalog")
    public ResponseEntity<LibraryBook> addBook(@RequestBody LibraryBook book) {
        return ResponseEntity.ok(libraryService.addBook(book));
    }

    @PostMapping("/issue")
    @Operation(summary = "Issue a book to a student")
    public ResponseEntity<?> issueBook(@RequestBody Map<String, Object> body) {
        try {
            String bookId = (String) body.get("bookId");
            String studentId = (String) body.get("studentId");
            int loanDays = body.containsKey("loanDays") ? Integer.parseInt(body.get("loanDays").toString()) : 14;
            return ResponseEntity.ok(libraryService.issueBook(bookId, studentId, loanDays));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/return/{issueId}")
    @Operation(summary = "Process a book return")
    public ResponseEntity<?> returnBook(@PathVariable String issueId) {
        try {
            return ResponseEntity.ok(libraryService.returnBook(issueId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get all books borrowed by a student")
    public ResponseEntity<List<BookIssueRecord>> getStudentIssuedBooks(@PathVariable String studentId) {
        return ResponseEntity.ok(libraryService.getStudentIssuedBooks(studentId));
    }

    @GetMapping("/issues")
    @Operation(summary = "Get all active and past book issues")
    public ResponseEntity<List<BookIssueRecord>> getAllIssues() {
        return ResponseEntity.ok(libraryService.getAllIssuedBooks());
    }
}
