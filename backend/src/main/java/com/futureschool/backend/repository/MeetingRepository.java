package com.futureschool.backend.repository;

import com.futureschool.backend.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, String> {
    List<Meeting> findByTeacherIdOrderByMeetingDateDesc(String teacherId);
    List<Meeting> findByParentIdOrderByMeetingDateDesc(String parentId);
}
