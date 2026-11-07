package com.futureschool.backend.repository;

import com.futureschool.backend.entity.SchoolSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolSettingRepository extends JpaRepository<SchoolSetting, String> {
}
