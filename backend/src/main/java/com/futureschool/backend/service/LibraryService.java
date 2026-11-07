package com.futureschool.backend.service;

import com.futureschool.backend.entity.BookIssueRecord;
import com.futureschool.backend.entity.LibraryBook;
import com.futureschool.backend.entity.Student;
import com.futureschool.backend.repository.BookIssueRecordRepository;
import com.futureschool.backend.repository.LibraryBookRepository;
import com.futureschool.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LibraryService {

    private final LibraryBookRepository bookRepository;
    private final BookIssueRecordRepository issueRepository;
    private final StudentRepository studentRepository;

    public LibraryService(
            LibraryBookRepository bookRepository,
            BookIssueRecordRepository issueRepository,
            StudentRepository studentRepository
    ) {
        this.bookRepository = bookRepository;
        this.issueRepository = issueRepository;
        this.studentRepository = studentRepository;
    }

    public List<LibraryBook> getAllBooks(String search, String category) {
        if (search != null && !search.isBlank()) {
            return bookRepository.searchBooks(search);
        }
        if (category != null && !category.isBlank()) {
            return bookRepository.findByCategory(category);
        }
        return bookRepository.findAll();
    }

    @Transactional
    public LibraryBook addBook(LibraryBook book) {
        if (book.getId() == null || book.getId().isBlank()) {
            book.setId("BK-" + String.format("%04d", bookRepository.count() + 1001));
        }
        if (book.getAvailableCopies() == 0 && book.getTotalCopies() > 0) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    @Transactional
    public BookIssueRecord issueBook(String bookId, String studentId, int loanDays) {
        LibraryBook book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No available copies of book: " + book.getTitle());
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        // Decrement available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate now = LocalDate.now();
        BookIssueRecord issue = BookIssueRecord.builder()
                .id("ISS-" + UUID.randomUUID().toString().substring(0, 8))
                .bookId(book.getId())
                .bookTitle(book.getTitle())
                .studentId(student.getId())
                .studentName(student.getName())
                .issueDate(now)
                .dueDate(now.plusDays(loanDays > 0 ? loanDays : 14))
                .status("Issued")
                .fineAmount(0.0)
                .build();

        return issueRepository.save(issue);
    }

    @Transactional
    public BookIssueRecord returnBook(String issueId) {
        BookIssueRecord record = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue record not found: " + issueId));

        record.setReturnDate(LocalDate.now());
        record.setStatus("Returned");

        // Increment available copies
        bookRepository.findById(record.getBookId()).ifPresent(b -> {
            b.setAvailableCopies(b.getAvailableCopies() + 1);
            bookRepository.save(b);
        });

        return issueRepository.save(record);
    }

    public List<BookIssueRecord> getStudentIssuedBooks(String studentId) {
        return issueRepository.findByStudentIdOrderByIssueDateDesc(studentId);
    }

    public List<BookIssueRecord> getAllIssuedBooks() {
        return issueRepository.findAll();
    }
}
