package com.futureschool.academic.api;

import com.futureschool.academic.dto.AcademicDtos;
import com.futureschool.academic.service.SchoolCalendarService;
import com.futureschool.common.api.ApiResponse;
import com.futureschool.common.exception.ApiException;
import com.futureschool.common.security.FutureSchoolPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic/calendars")
public class SchoolCalendarController {

    private final SchoolCalendarService calendarService;

    public SchoolCalendarController(SchoolCalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolCalendarResponse>> createCalendarDraft(
            @Valid @RequestBody AcademicDtos.CreateCalendarRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolCalendarResponse response = calendarService.createCalendarDraft(
                principal.getSchoolId(), request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Calendar draft created successfully"));
    }

    @PostMapping("/{calendarId}/entries")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.CalendarEntryResponse>> addCalendarEntry(
            @PathVariable UUID calendarId,
            @Valid @RequestBody AcademicDtos.AddCalendarEntryRequest request,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.CalendarEntryResponse response = calendarService.addCalendarEntry(
                principal.getSchoolId(), calendarId, request, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Calendar entry added successfully"));
    }

    @PostMapping("/{calendarId}/publish")
    @PreAuthorize("hasAuthority('PERM_ACADEMIC_OPERATIONS')")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolCalendarResponse>> publishCalendar(
            @PathVariable UUID calendarId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolCalendarResponse response = calendarService.publishCalendar(
                principal.getSchoolId(), calendarId, principal.getUserId(), principal.getLoginId());
        return ResponseEntity.ok(ApiResponse.success(response, "Calendar published successfully"));
    }

    @GetMapping("/{calendarId}")
    public ResponseEntity<ApiResponse<AcademicDtos.SchoolCalendarResponse>> getCalendar(
            @PathVariable UUID calendarId,
            @AuthenticationPrincipal FutureSchoolPrincipal principal) {
        ensureSchoolContext(principal);

        AcademicDtos.SchoolCalendarResponse response = calendarService.getCalendar(principal.getSchoolId(), calendarId);
        return ResponseEntity.ok(ApiResponse.success(response, "Calendar retrieved successfully"));
    }

    private void ensureSchoolContext(FutureSchoolPrincipal principal) {
        if (principal == null || principal.getSchoolId() == null) {
            throw ApiException.forbidden("NOT_SCHOOL_USER", "Operation requires active school tenant context");
        }
    }
}
