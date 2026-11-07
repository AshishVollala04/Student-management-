package com.futureschool.backend.controller;

import com.futureschool.backend.entity.TimetableSlot;
import com.futureschool.backend.service.TimetableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@Tag(name = "Timetable & Schedule", description = "Endpoints for class and teacher timetable scheduling")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get weekly timetable for a class")
    public ResponseEntity<List<TimetableSlot>> getClassTimetable(@PathVariable String classId) {
        return ResponseEntity.ok(timetableService.getClassTimetable(classId));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get weekly timetable for a teacher")
    public ResponseEntity<List<TimetableSlot>> getTeacherTimetable(@PathVariable String teacherId) {
        return ResponseEntity.ok(timetableService.getTeacherTimetable(teacherId));
    }

    @PostMapping
    @Operation(summary = "Create or update a single timetable period slot")
    public ResponseEntity<TimetableSlot> saveSlot(@RequestBody TimetableSlot slot) {
        return ResponseEntity.ok(timetableService.saveSlot(slot));
    }

    @PostMapping("/bulk/{classId}")
    @Operation(summary = "Replace complete weekly schedule for a class")
    public ResponseEntity<List<TimetableSlot>> saveBulkSchedule(
            @PathVariable String classId,
            @RequestBody List<TimetableSlot> slots
    ) {
        return ResponseEntity.ok(timetableService.saveBulkSlots(classId, slots));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete timetable slot by ID")
    public ResponseEntity<?> deleteSlot(@PathVariable String id) {
        timetableService.deleteSlot(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Slot deleted: " + id));
    }
}
