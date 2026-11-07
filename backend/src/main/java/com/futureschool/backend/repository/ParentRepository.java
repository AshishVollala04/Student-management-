package com.futureschool.backend.repository;

import com.futureschool.backend.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, String> {
    Optional<Parent> findByLoginIdIgnoreCase(String loginId);
}
