package com.futureschool.common.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;

public class FutureSchoolPrincipal implements UserDetails, Principal {

    private final UUID userId;
    private final UUID schoolId;
    private final String schoolCode;
    private final String loginId;
    private final String displayName;
    private final PortalContext portal;
    private final UUID studentId;
    private final UUID staffId;
    private final UUID sessionId;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;
    private final boolean accountNonLocked;

    public FutureSchoolPrincipal(UUID userId,
                                 UUID schoolId,
                                 String schoolCode,
                                 String loginId,
                                 String displayName,
                                 PortalContext portal,
                                 UUID studentId,
                                 UUID staffId,
                                 UUID sessionId,
                                 Collection<? extends GrantedAuthority> authorities,
                                 boolean enabled,
                                 boolean accountNonLocked) {
        this.userId = userId;
        this.schoolId = schoolId;
        this.schoolCode = schoolCode;
        this.loginId = loginId;
        this.displayName = displayName;
        this.portal = portal;
        this.studentId = studentId;
        this.staffId = staffId;
        this.sessionId = sessionId;
        this.authorities = authorities != null ? authorities : Set.of();
        this.enabled = enabled;
        this.accountNonLocked = accountNonLocked;
    }

    @Override
    public String getName() {
        return loginId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getSchoolId() {
        return schoolId;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public String getLoginId() {
        return loginId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public PortalContext getPortal() {
        return portal;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public UUID getStaffId() {
        return staffId;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Token-based authentication, password not stored in principal
    }

    @Override
    public String getUsername() {
        return loginId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean hasRole(String role) {
        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return authorities.stream().anyMatch(a -> a.getAuthority().equals(roleWithPrefix));
    }

    public boolean hasPermission(String permission) {
        String permWithPrefix = permission.startsWith("PERM_") ? permission : "PERM_" + permission;
        return authorities.stream().anyMatch(a -> a.getAuthority().equals(permWithPrefix));
    }

    @Override
    public String toString() {
        return "FutureSchoolPrincipal{" +
                "userId=" + userId +
                ", schoolId=" + schoolId +
                ", loginId='" + loginId + '\'' +
                ", portal=" + portal +
                ", studentId=" + studentId +
                ", sessionId=" + sessionId +
                '}';
    }
}
