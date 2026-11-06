package com.futureschool.staff.domain;

import com.futureschool.platform.school.domain.School;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "staff_id", updatable = false, nullable = false)
    private UUID staffId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotBlank
    @Column(name = "staff_code", nullable = false, length = 64)
    private String staffCode; // e.g. "TCH0001"

    @NotBlank
    @Column(name = "first_name", nullable = false, length = 128)
    private String firstName;

    @NotBlank
    @Column(name = "last_name", nullable = false, length = 128)
    private String lastName;

    @NotBlank
    @Column(name = "designation", nullable = false, length = 128)
    private String designation;

    @Column(name = "department", length = 64)
    private String department;

    @NotBlank
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private StaffStatus status = StaffStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Staff() {
    }

    public Staff(School school, String staffCode, String firstName, String lastName, String designation, String email, StaffStatus status) {
        this.school = school;
        this.staffCode = staffCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.designation = designation;
        this.email = email;
        this.status = status;
    }

    public UUID getStaffId() {
        return staffId;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public String getStaffCode() {
        return staffCode;
    }

    public void setStaffCode(String staffCode) {
        this.staffCode = staffCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public StaffStatus getStatus() {
        return status;
    }

    public void setStatus(StaffStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
