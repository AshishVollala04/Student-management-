package com.futureschool.backend.repository;

import com.futureschool.backend.entity.TransportRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRouteRepository extends JpaRepository<TransportRoute, String> {
    List<TransportRoute> findByActiveTrue();
}
