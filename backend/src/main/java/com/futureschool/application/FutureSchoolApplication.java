package com.futureschool.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * FutureSchool Production Backend Application Entry Point.
 * Modular Monolith SaaS Architecture for Multi-School Management.
 */
@SpringBootApplication(scanBasePackages = "com.futureschool")
@EntityScan(basePackages = "com.futureschool")
@EnableJpaRepositories(basePackages = "com.futureschool")
public class FutureSchoolApplication {

    public static void main(String[] args) {
        SpringApplication.run(FutureSchoolApplication.class, args);
    }
}
