package com.futureschool.backend.service;

import com.futureschool.backend.entity.Student;
import com.futureschool.backend.entity.TransportRoute;
import com.futureschool.backend.repository.StudentRepository;
import com.futureschool.backend.repository.TransportRouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransportService {

    private final TransportRouteRepository transportRouteRepository;
    private final StudentRepository studentRepository;

    public TransportService(TransportRouteRepository transportRouteRepository, StudentRepository studentRepository) {
        this.transportRouteRepository = transportRouteRepository;
        this.studentRepository = studentRepository;
    }

    public List<TransportRoute> getAllRoutes() {
        return transportRouteRepository.findByActiveTrue();
    }

    @Transactional
    public TransportRoute saveRoute(TransportRoute route) {
        if (route.getId() == null || route.getId().isBlank()) {
            route.setId("ROUTE-" + String.format("%02d", transportRouteRepository.count() + 1));
        }
        return transportRouteRepository.save(route);
    }

    @Transactional
    public void deleteRoute(String id) {
        transportRouteRepository.deleteById(id);
    }

    @Transactional
    public Student assignStudentToRoute(String studentId, String routeId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        student.setTransportRouteId(routeId);
        return studentRepository.save(student);
    }
}
