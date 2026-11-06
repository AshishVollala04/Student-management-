package com.futureschool.staff.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<Staff, UUID> {
    Optional<Staff> findBySchoolAndStaffCode(School school, String staffCode);
    Optional<Staff> findBySchoolAndEmail(School school, String email);
    List<Staff> findBySchoolOrderByLastNameAscFirstNameAsc(School school);
    boolean existsBySchoolAndStaffCode(School school, String staffCode);
}
