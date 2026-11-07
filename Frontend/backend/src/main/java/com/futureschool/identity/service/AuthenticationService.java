package com.futureschool.identity.service;

import com.futureschool.common.audit.AuditService;
import com.futureschool.common.security.*;
import com.futureschool.identity.domain.*;
import com.futureschool.identity.dto.*;
import com.futureschool.platform.school.domain.School;
import com.futureschool.platform.school.domain.SchoolRepository;
import com.futureschool.staff.domain.Staff;
import com.futureschool.staff.domain.StaffRepository;
import com.futureschool.student.domain.Student;
import com.futureschool.student.domain.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordService passwordService;
    private final JwtTokenService jwtTokenService;
    private final SessionService sessionService;
    private final LoginThrottlingService throttlingService;
    private final MfaService mfaService;
    private final AuditService auditService;
    private final long passwordResetExpirationSeconds;

    public AuthenticationService(
            UserRepository userRepository,
            SchoolRepository schoolRepository,
            StudentRepository studentRepository,
            StaffRepository staffRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordService passwordService,
            JwtTokenService jwtTokenService,
            SessionService sessionService,
            LoginThrottlingService throttlingService,
            MfaService mfaService,
            AuditService auditService,
            @Value("${app.security.password-reset.expiration-seconds:1800}") long passwordResetExpirationSeconds) {
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
        this.sessionService = sessionService;
        this.throttlingService = throttlingService;
        this.mfaService = mfaService;
        this.auditService = auditService;
        this.passwordResetExpirationSeconds = passwordResetExpirationSeconds;
    }

    @Transactional
    public LoginResponse login(LoginRequest request, String ipAddress, String userAgent) {
        String throttleKey = (request.schoolCode() != null ? request.schoolCode() : "PLATFORM") + ":" + request.loginId();

        if (throttlingService.isBlocked(throttleKey)) {
            throw new LockedException("Account is temporarily locked due to excessive failed attempts. Please try again later.");
        }

        User user = findUserForLogin(request);
        if (user == null) {
            throttlingService.recordFailedAttempt(throttleKey);
            throw new BadCredentialsException("Invalid credentials or portal context");
        }

        if (user.getStatus() == AccountStatus.INACTIVE || user.getStatus() == AccountStatus.EXITED || user.getStatus() == AccountStatus.LOCKED) {
            throw new DisabledException("Account is locked or inactive");
        }

        if (!passwordService.matches(request.password(), user.getPasswordHash())) {
            throttlingService.recordFailedAttempt(throttleKey);
            throw new BadCredentialsException("Invalid credentials or portal context");
        }

        // Validate portal context eligibility
        if (!isPortalContextEligible(user, request.portal())) {
            throttlingService.recordFailedAttempt(throttleKey);
            throw new BadCredentialsException("Invalid credentials or portal context");
        }

        // Credentials & portal context valid -> clear throttle count
        throttlingService.recordSuccess(throttleKey);

        // Check if MFA challenge is active
        if (user.isMfaEnabled()) {
            String mfaSessionToken = passwordService.generateSecureRandomToken();
            return LoginResponse.mfaChallenge(mfaSessionToken);
        }

        return completeSuccessfulLogin(user, request.portal(), ipAddress, userAgent);
    }

    private User findUserForLogin(LoginRequest request) {
        if (request.portal() == PortalContext.PLATFORM) {
            return userRepository.findBySchoolIsNullAndLoginId(request.loginId()).orElse(null);
        }

        if (request.schoolCode() != null && !request.schoolCode().isBlank()) {
            return userRepository.findBySchool_SchoolCodeAndLoginId(request.schoolCode(), request.loginId()).orElse(null);
        }

        return userRepository.findByLoginId(request.loginId()).orElse(null);
    }

    private boolean isPortalContextEligible(User user, PortalContext portal) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());

        return switch (portal) {
            case STUDENT -> roleNames.contains("STUDENT") || roleNames.contains("ROLE_STUDENT");
            case PARENT -> roleNames.contains("PARENT") || roleNames.contains("ROLE_PARENT") ||
                    roleNames.contains("STUDENT") || roleNames.contains("ROLE_STUDENT");
            case STAFF -> roleNames.stream().anyMatch(r ->
                    r.contains("TEACHER") || r.contains("PRINCIPAL") || r.contains("ADMIN"));
            case PLATFORM -> roleNames.contains("PLATFORM_ADMIN") || roleNames.contains("ROLE_PLATFORM_ADMIN");
        };
    }

    @Transactional
    public LoginResponse completeSuccessfulLogin(User user, PortalContext portal, String ipAddress, String userAgent) {
        // Resolve studentId or staffId
        UUID studentId = null;
        UUID staffId = null;

        if (user.getSchool() != null) {
            if (portal == PortalContext.STUDENT || portal == PortalContext.PARENT) {
                studentId = studentRepository.findBySchoolAndStudentNumber(user.getSchool(), user.getLoginId())
                        .map(Student::getStudentId)
                        .orElse(null);
            }
            if (portal == PortalContext.STAFF) {
                staffId = staffRepository.findBySchoolAndStaffCode(user.getSchool(), user.getLoginId())
                        .map(Staff::getStaffId)
                        .orElse(null);
            }
        }

        // Establish authorities based on portal context
        Set<GrantedAuthority> authorities = determineAuthorities(user, portal);

        // Create refresh session
        SessionService.SessionResult sessionResult = sessionService.createSession(user, portal, ipAddress, userAgent);

        FutureSchoolPrincipal principal = new FutureSchoolPrincipal(
                user.getUserId(),
                user.getSchool() != null ? user.getSchool().getSchoolId() : null,
                user.getSchool() != null ? user.getSchool().getSchoolCode() : null,
                user.getLoginId(),
                user.getDisplayName(),
                portal,
                studentId,
                staffId,
                sessionResult.session().getSessionId(),
                authorities,
                user.getStatus() == AccountStatus.ACTIVE,
                user.getStatus() != AccountStatus.LOCKED
        );

        String accessToken = jwtTokenService.generateAccessToken(principal);

        List<String> roleStrings = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .toList();

        List<String> permissionStrings = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("PERM_"))
                .toList();

        LoginResponse.UserSummary userSummary = new LoginResponse.UserSummary(
                user.getUserId(),
                user.getLoginId(),
                user.getDisplayName(),
                portal,
                user.getSchool() != null ? user.getSchool().getSchoolId() : null,
                user.getSchool() != null ? user.getSchool().getSchoolCode() : null,
                studentId,
                staffId,
                roleStrings,
                permissionStrings
        );

        return LoginResponse.success(
                accessToken,
                sessionResult.rawRefreshToken(),
                jwtTokenService.getAccessTokenExpirationSeconds(),
                userSummary
        );
    }

    private Set<GrantedAuthority> determineAuthorities(User user, PortalContext portal) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        if (portal == PortalContext.PARENT) {
            authorities.add(new SimpleGrantedAuthority("ROLE_PARENT"));
            authorities.add(new SimpleGrantedAuthority("PERM_VIEW_OWN_STUDENT"));
            return authorities;
        }

        if (portal == PortalContext.STUDENT) {
            authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
            authorities.add(new SimpleGrantedAuthority("PERM_VIEW_OWN_STUDENT"));
            return authorities;
        }

        // STAFF or PLATFORM: populate configured roles and permissions
        for (Role role : user.getRoles()) {
            String roleName = role.getRoleName();
            if (!roleName.startsWith("ROLE_")) {
                roleName = "ROLE_" + roleName;
            }
            authorities.add(new SimpleGrantedAuthority(roleName));

            if (role.getPermissions() != null) {
                for (Permission perm : role.getPermissions()) {
                    String code = perm.getPermissionCode();
                    if (!code.startsWith("PERM_")) {
                        code = "PERM_" + code;
                    }
                    authorities.add(new SimpleGrantedAuthority(code));
                }
            }
        }

        return authorities;
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request, String ipAddress, String userAgent) {
        Optional<SessionService.SessionResult> rotated =
                sessionService.rotateRefreshToken(request.refreshToken(), ipAddress, userAgent);

        if (rotated.isEmpty()) {
            throw new BadCredentialsException("Invalid, expired, or reused refresh token");
        }

        SessionService.SessionResult result = rotated.get();
        User user = result.session().getUser();

        if (user.getStatus() == AccountStatus.INACTIVE || user.getStatus() == AccountStatus.EXITED || user.getStatus() == AccountStatus.LOCKED) {
            sessionService.revokeSession(result.session().getSessionId(), user);
            throw new DisabledException("Account is locked or inactive");
        }

        // Determine portal from previous session or fallback to user role
        PortalContext portal = PortalContext.STAFF;
        if (user.getSchool() == null) {
            portal = PortalContext.PLATFORM;
        } else {
            boolean isStudent = user.getRoles().stream()
                    .anyMatch(r -> r.getRoleName().contains("STUDENT") || r.getRoleName().contains("PARENT"));
            if (isStudent) {
                portal = PortalContext.STUDENT;
            }
        }

        UUID studentId = null;
        UUID staffId = null;
        if (user.getSchool() != null) {
            if (portal == PortalContext.STUDENT || portal == PortalContext.PARENT) {
                studentId = studentRepository.findBySchoolAndStudentNumber(user.getSchool(), user.getLoginId())
                        .map(Student::getStudentId).orElse(null);
            } else {
                staffId = staffRepository.findBySchoolAndStaffCode(user.getSchool(), user.getLoginId())
                        .map(Staff::getStaffId).orElse(null);
            }
        }

        Set<GrantedAuthority> authorities = determineAuthorities(user, portal);

        FutureSchoolPrincipal principal = new FutureSchoolPrincipal(
                user.getUserId(),
                user.getSchool() != null ? user.getSchool().getSchoolId() : null,
                user.getSchool() != null ? user.getSchool().getSchoolCode() : null,
                user.getLoginId(),
                user.getDisplayName(),
                portal,
                studentId,
                staffId,
                result.session().getSessionId(),
                authorities,
                user.getStatus() == AccountStatus.ACTIVE,
                user.getStatus() != AccountStatus.LOCKED
        );

        String newAccessToken = jwtTokenService.generateAccessToken(principal);

        LoginResponse.UserSummary userSummary = new LoginResponse.UserSummary(
                user.getUserId(),
                user.getLoginId(),
                user.getDisplayName(),
                portal,
                user.getSchool() != null ? user.getSchool().getSchoolId() : null,
                user.getSchool() != null ? user.getSchool().getSchoolCode() : null,
                studentId,
                staffId,
                authorities.stream().map(GrantedAuthority::getAuthority).filter(a -> a.startsWith("ROLE_")).toList(),
                authorities.stream().map(GrantedAuthority::getAuthority).filter(a -> a.startsWith("PERM_")).toList()
        );

        return LoginResponse.success(
                newAccessToken,
                result.rawRefreshToken(),
                jwtTokenService.getAccessTokenExpirationSeconds(),
                userSummary
        );
    }

    @Transactional
    public String requestPasswordReset(PasswordResetRequest request) {
        Optional<User> userOpt;
        if (request.schoolCode() != null && !request.schoolCode().isBlank()) {
            userOpt = userRepository.findBySchool_SchoolCodeAndLoginId(request.schoolCode(), request.loginId());
        } else {
            userOpt = userRepository.findByLoginId(request.loginId());
        }

        if (userOpt.isEmpty()) {
            // Constant-time safety: do not reveal if user does not exist
            return null;
        }

        User user = userOpt.get();
        String rawToken = passwordService.generateSecureRandomToken();
        String hash = passwordService.hashToken(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(passwordResetExpirationSeconds);

        PasswordResetToken token = new PasswordResetToken(user, hash, expiresAt);
        passwordResetTokenRepository.save(token);

        return rawToken;
    }

    @Transactional
    public boolean confirmPasswordReset(PasswordResetConfirmRequest request) {
        String hash = passwordService.hashToken(request.token());
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByTokenHash(hash);

        if (tokenOpt.isEmpty()) {
            throw new BadCredentialsException("Invalid or expired password reset token");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Invalid or expired password reset token");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordService.hashPassword(request.newPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Security best practice: Revoke all existing sessions on password change
        sessionService.revokeAllUserSessions(user);
        return true;
    }
}
