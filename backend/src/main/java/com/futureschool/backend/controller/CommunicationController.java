package com.futureschool.backend.controller;

import com.futureschool.backend.entity.CalendarEvent;
import com.futureschool.backend.entity.Complaint;
import com.futureschool.backend.entity.Meeting;
import com.futureschool.backend.service.CommunicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communication")
@Tag(name = "Communication, Meetings & Complaints", description = "Endpoints for school calendar events, PTM meeting scheduling, and parent/student complaints")
public class CommunicationController {

    private final CommunicationService communicationService;

    public CommunicationController(CommunicationService communicationService) {
        this.communicationService = communicationService;
    }

    // --- Calendar Events ---
    @GetMapping("/calendar/events")
    @Operation(summary = "Get school calendar events and holidays")
    public ResponseEntity<List<CalendarEvent>> getEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (start != null && end != null) {
            return ResponseEntity.ok(communicationService.getEventsForRange(start, end));
        }
        return ResponseEntity.ok(communicationService.getAllEvents());
    }

    @PostMapping("/calendar/events")
    @Operation(summary = "Create or update a school calendar event")
    public ResponseEntity<CalendarEvent> saveEvent(@RequestBody CalendarEvent event) {
        return ResponseEntity.ok(communicationService.saveEvent(event));
    }

    @DeleteMapping("/calendar/events/{id}")
    @Operation(summary = "Delete calendar event")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        communicationService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Event deleted: " + id));
    }

    // --- Meetings (PTM) ---
    @GetMapping("/meetings")
    @Operation(summary = "Get scheduled meetings (filter by teacherId or parentId)")
    public ResponseEntity<List<Meeting>> getMeetings(
            @RequestParam(required = false) String teacherId,
            @RequestParam(required = false) String parentId
    ) {
        if (teacherId != null && !teacherId.isBlank()) {
            return ResponseEntity.ok(communicationService.getTeacherMeetings(teacherId));
        }
        if (parentId != null && !parentId.isBlank()) {
            return ResponseEntity.ok(communicationService.getParentMeetings(parentId));
        }
        return ResponseEntity.ok(communicationService.getAllMeetings());
    }

    @PostMapping("/meetings")
    @Operation(summary = "Schedule a Parent-Teacher Meeting (PTM)")
    public ResponseEntity<Meeting> scheduleMeeting(@RequestBody Meeting meeting) {
        return ResponseEntity.ok(communicationService.scheduleMeeting(meeting));
    }

    @PatchMapping("/meetings/{id}/status")
    @Operation(summary = "Update meeting status (SCHEDULED, COMPLETED, CANCELLED)")
    public ResponseEntity<?> updateMeetingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        String notes = body.get("notes");
        return ResponseEntity.ok(communicationService.updateMeetingStatus(id, status, notes));
    }

    // --- Complaints & Helpdesk ---
    @GetMapping("/complaints")
    @Operation(summary = "List all complaints or tickets submitted by current user")
    public ResponseEntity<List<Complaint>> getComplaints(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(communicationService.getUserComplaints(userId));
        }
        return ResponseEntity.ok(communicationService.getAllComplaints());
    }

    @PostMapping("/complaints")
    @Operation(summary = "File a new grievance / helpdesk ticket")
    public ResponseEntity<Complaint> fileComplaint(@RequestBody Complaint complaint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (auth != null) ? auth.getName() : "Anonymous";
        return ResponseEntity.ok(communicationService.fileComplaint(complaint, userId, userId, "USER"));
    }

    @PatchMapping("/complaints/{id}/resolve")
    @Operation(summary = "Resolve or update a complaint ticket")
    public ResponseEntity<?> resolveComplaint(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "RESOLVED");
        String resolution = body.get("resolution");
        String assignedTo = body.get("assignedTo");
        return ResponseEntity.ok(communicationService.resolveComplaint(id, status, resolution, assignedTo));
    }
}
