package com.futureschool.backend.service;

import com.futureschool.backend.entity.SchoolNotice;
import com.futureschool.backend.repository.SchoolNoticeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class NoticeService {

    private final SchoolNoticeRepository schoolNoticeRepository;

    public NoticeService(SchoolNoticeRepository schoolNoticeRepository) {
        this.schoolNoticeRepository = schoolNoticeRepository;
    }

    public List<SchoolNotice> getAllActiveNotices() {
        return schoolNoticeRepository.findByActiveTrueOrderByPublishedDateDesc();
    }

    public List<SchoolNotice> getNoticesForRole(String role) {
        if (role == null || "admin".equalsIgnoreCase(role) || "principal".equalsIgnoreCase(role)) {
            return getAllActiveNotices();
        }
        String aud = role.toUpperCase() + "S"; // STUDENT -> STUDENTS, PARENT -> PARENTS, TEACHER -> TEACHERS
        return schoolNoticeRepository.findByActiveTrueAndAudienceInOrderByPublishedDateDesc(Arrays.asList("ALL", aud));
    }

    @Transactional
    public SchoolNotice createNotice(SchoolNotice notice, String authorName) {
        if (notice.getId() == null || notice.getId().isBlank()) {
            notice.setId("NOT-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (notice.getPublishedDate() == null) {
            notice.setPublishedDate(LocalDate.now());
        }
        if (authorName != null) {
            notice.setAuthorName(authorName);
        }
        notice.setActive(true);
        return schoolNoticeRepository.save(notice);
    }

    @Transactional
    public void deleteNotice(String id) {
        schoolNoticeRepository.deleteById(id);
    }
}
