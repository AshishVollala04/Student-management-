package com.futureschool.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDTO {
    private String id;
    private String loginId;
    private String name;
    private String email;
    private String role; // "admin", "principal", "teacher", "parent", "student"
    private String status; // "Active", "Inactive"
    private boolean active;
    private String studentId;
    private String teacherId;
    private List<String> linkedStudentIds;
    private String scope;
}
