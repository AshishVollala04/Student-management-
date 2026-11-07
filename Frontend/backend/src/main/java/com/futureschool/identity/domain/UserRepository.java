package com.futureschool.identity.domain;

import com.futureschool.platform.school.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findBySchoolAndLoginId(School school, String loginId);
    Optional<User> findBySchool_SchoolIdAndLoginId(UUID schoolId, String loginId);
    Optional<User> findBySchool_SchoolCodeAndLoginId(String schoolCode, String loginId);
    Optional<User> findBySchoolIsNullAndLoginId(String loginId);
    Optional<User> findByLoginId(String loginId);
    boolean existsBySchoolAndLoginId(School school, String loginId);
}
