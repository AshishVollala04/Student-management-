package com.futureschool.backend.repository;

import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    Optional<UserAccount> findByLoginIdIgnoreCase(String loginId);
    boolean existsByLoginIdIgnoreCase(String loginId);
    List<UserAccount> findByRole(UserRole role);
}
