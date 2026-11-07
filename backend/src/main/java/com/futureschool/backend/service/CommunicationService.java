package com.futureschool.backend.service;

import com.futureschool.backend.entity.CalendarEvent;
import com.futureschool.backend.entity.Complaint;
import com.futureschool.backend.entity.Meeting;
import com.futureschool.backend.repository.CalendarEventRepository;
import com.futureschool.backend.repository.ComplaintRepository;
import com.futureschool.backend.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class CommunicationService {

    private final CalendarEventRepository calendarEventRepository;
    private final MeetingRepository meetingRepository;
    private final ComplaintRepository complaintRepository;

    public CommunicationService(
            CalendarEventRepository calendarEventRepository,
            MeetingRepository meetingRepository,
            ComplaintRepository complaintRepository
    ) {
        this.calendarEventRepository = calendarEventRepository;
        this.meetingRepository = meetingRepository;
        this.complaintRepository = complaintRepository;
    }

    // --- Calendar Events ---
    public List<CalendarEvent> getAllEvents() {
        return calendarEventRepository.findAllByOrderByStartDateAsc();
    }

    public List<CalendarEvent> getEventsForRange(LocalDate start, LocalDate end) {
        return calendarEventRepository.findByStartDateBetweenOrderByStartDateAsc(start, end);
    }

    @Transactional
    public CalendarEvent saveEvent(CalendarEvent event) {
        if (event.getId() == null || event.getId().isBlank()) {
            event.setId("EVT-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return calendarEventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(String id) {
        calendarEventRepository.deleteById(id);
    }

    // --- Meetings (PTM) ---
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    public List<Meeting> getTeacherMeetings(String teacherId) {
        return meetingRepository.findByTeacherIdOrderByMeetingDateDesc(teacherId);
    }

    public List<Meeting> getParentMeetings(String parentId) {
        return meetingRepository.findByParentIdOrderByMeetingDateDesc(parentId);
    }

    @Transactional
    public Meeting scheduleMeeting(Meeting meeting) {
        if (meeting.getId() == null || meeting.getId().isBlank()) {
            meeting.setId("MTG-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (meeting.getStatus() == null) meeting.setStatus("SCHEDULED");
        return meetingRepository.save(meeting);
    }

    @Transactional
    public Meeting updateMeetingStatus(String id, String status, String notes) {
        Meeting m = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found: " + id));
        m.setStatus(status);
        if (notes != null) m.setNotes(notes);
        return meetingRepository.save(m);
    }

    // --- Complaints & Grievances ---
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getUserComplaints(String userId) {
        return complaintRepository.findBySubmittedByIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Complaint fileComplaint(Complaint complaint, String userId, String userName, String userRole) {
        if (complaint.getId() == null || complaint.getId().isBlank()) {
            complaint.setId("CMP-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (complaint.getTicketNumber() == null || complaint.getTicketNumber().isBlank()) {
            complaint.setTicketNumber("TKT-2026-" + String.format("%04d", complaintRepository.count() + 1));
        }
        if (userId != null) complaint.setSubmittedById(userId);
        if (userName != null) complaint.setSubmittedByName(userName);
        if (userRole != null) complaint.setSubmittedByRole(userRole);
        complaint.setStatus("OPEN");

        return complaintRepository.save(complaint);
    }

    @Transactional
    public Complaint resolveComplaint(String id, String status, String resolution, String assignedTo) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + id));
        c.setStatus(status);
        if (resolution != null) c.setResolution(resolution);
        if (assignedTo != null) c.setAssignedTo(assignedTo);
        return complaintRepository.save(c);
    }
}
