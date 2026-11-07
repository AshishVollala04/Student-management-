package com.futureschool.backend.repository;

import com.futureschool.backend.entity.SchoolNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolNoticeRepository extends JpaRepository<SchoolNotice, String> {
    List<SchoolNotice> findByActiveTrueOrderByPublishedDateDesc();
    List<SchoolNotice> findByActiveTrueAndAudienceInOrderByPublishedDateDesc(List<String> audiences);
}
