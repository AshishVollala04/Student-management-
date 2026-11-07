package com.futureschool.backend.service;

import com.futureschool.backend.dto.AccountDTO;
import com.futureschool.backend.dto.LoginRequest;
import com.futureschool.backend.dto.LoginResponse;
import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.entity.UserRole;
import com.futureschool.backend.repository.UserAccountRepository;
import com.futureschool.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserAccountRepository userAccountRepository,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(request.getLoginId())
                .orElseThrow(() -> new BadCredentialsException("Account not found with ID: " + request.getLoginId()));

        if (!account.isActive() || "Inactive".equalsIgnoreCase(account.getStatus())) {
            throw new BadCredentialsException("Account is inactive. Please contact school administration.");
        }

        // Check password if provided or required
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getPassword(), account.getPassword()) &&
                !request.getPassword().equals(account.getPassword())) {
                throw new BadCredentialsException("Invalid password provided.");
            }
        }

        String roleStr = account.getRole().name().toLowerCase();
        String token = jwtUtil.generateToken(account.getLoginId(), roleStr, account.getName());
        AccountDTO accountDTO = mapToAccountDTO(account);

        return LoginResponse.builder()
                .success(true)
                .token(token)
                .message("Login successful")
                .user(accountDTO)
                .authorizedRole(roleStr)
                .build();
    }

    public AccountDTO getCurrentUser(String loginId) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));
        return mapToAccountDTO(account);
    }

    public List<AccountDTO> getAllUsers(String roleFilter) {
        List<UserAccount> accounts;
        if (roleFilter != null && !roleFilter.isBlank()) {
            try {
                UserRole role = UserRole.valueOf(roleFilter.toUpperCase());
                accounts = userAccountRepository.findByRole(role);
            } catch (IllegalArgumentException e) {
                accounts = userAccountRepository.findAll();
            }
        } else {
            accounts = userAccountRepository.findAll();
        }
        return accounts.stream().map(this::mapToAccountDTO).collect(Collectors.toList());
    }

    @Transactional
    public AccountDTO registerUser(UserAccount account, String rawPassword) {
        if (userAccountRepository.existsByLoginIdIgnoreCase(account.getLoginId())) {
            throw new RuntimeException("User already exists with Login ID: " + account.getLoginId());
        }

        if (account.getId() == null || account.getId().isBlank()) {
            account.setId("USR-" + account.getLoginId());
        }

        String pwd = (rawPassword != null && !rawPassword.isBlank()) ? rawPassword : "password123";
        account.setPassword(passwordEncoder.encode(pwd));
        account.setActive(true);
        if (account.getStatus() == null) account.setStatus("Active");

        UserAccount saved = userAccountRepository.save(account);
        return mapToAccountDTO(saved);
    }

    @Transactional
    public void changePassword(String loginId, String oldPassword, String newPassword) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));

        if (!passwordEncoder.matches(oldPassword, account.getPassword()) && !oldPassword.equals(account.getPassword())) {
            throw new BadCredentialsException("Current password does not match.");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        userAccountRepository.save(account);
    }

    @Transactional
    public void deleteUser(String loginId) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));
        userAccountRepository.delete(account);
    }

    @Transactional
    public AccountDTO toggleUserStatus(String loginId) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));
        boolean newActive = !account.isActive();
        account.setActive(newActive);
        account.setStatus(newActive ? "Active" : "Inactive");
        UserAccount saved = userAccountRepository.save(account);
        return mapToAccountDTO(saved);
    }

    @Transactional
    public String adminResetPassword(String loginId, String customPassword) {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));
        String newPassword = (customPassword != null && !customPassword.isBlank()) 
                ? customPassword 
                : "welcome" + (int)(100 + Math.random() * 900);
        account.setPassword(passwordEncoder.encode(newPassword));
        userAccountRepository.save(account);
        return newPassword;
    }

    public AccountDTO mapToAccountDTO(UserAccount account) {
        return AccountDTO.builder()
                .id(account.getId())
                .loginId(account.getLoginId())
                .name(account.getName())
                .email(account.getEmail())
                .role(account.getRole().name().toLowerCase())
                .status(account.getStatus())
                .active(account.isActive())
                .studentId(account.getStudentId())
                .teacherId(account.getTeacherId())
                .linkedStudentIds(account.getLinkedStudentIds())
                .scope(account.getRole().name().toLowerCase())
                .build();
    }
}
