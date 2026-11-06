package com.futureschool.identity.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "permission_id", updatable = false, nullable = false)
    private UUID permissionId;

    @NotBlank
    @Column(name = "permission_code", unique = true, nullable = false, length = 64)
    private String permissionCode;

    @NotBlank
    @Column(name = "module", nullable = false, length = 64)
    private String module;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Permission() {
    }

    public Permission(String permissionCode, String module, String description) {
        this.permissionCode = permissionCode;
        this.module = module;
        this.description = description;
    }

    public UUID getPermissionId() {
        return permissionId;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public String getModule() {
        return module;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
