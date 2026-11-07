package com.futureschool.backend.controller;

import com.futureschool.backend.entity.SchoolNotice;
import com.futureschool.backend.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notices")
@Tag(name = "Notices & Announcements", description = "Endpoints for school notices and circulars")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    @Operation(summary = "Get active school notices (optional filter by role: student, teacher, parent)")
    public ResponseEntity<List<SchoolNotice>> getNotices(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(noticeService.getNoticesForRole(role));
    }

    @PostMapping
    @Operation(summary = "Publish a new school notice")
    public ResponseEntity<?> createNotice(@RequestBody SchoolNotice notice) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String author = (auth != null) ? auth.getName() : "Administration";
            return ResponseEntity.ok(noticeService.createNotice(notice, author));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete / unpublish notice by ID")
    public ResponseEntity<?> deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Notice deleted: " + id));
    }
}
