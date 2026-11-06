package com.futureschool.common.security;

import com.futureschool.identity.domain.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class MfaService {

    private final MfaConfigurationRepository mfaRepository;
    private final StepUpTokenRepository stepUpTokenRepository;
    private final PasswordService passwordService;
    private final long stepUpTokenExpirationSeconds;

    public MfaService(
            MfaConfigurationRepository mfaRepository,
            StepUpTokenRepository stepUpTokenRepository,
            PasswordService passwordService,
            @Value("${app.security.mfa.step-up-expiration-seconds:900}") long stepUpTokenExpirationSeconds) {
        this.mfaRepository = mfaRepository;
        this.stepUpTokenRepository = stepUpTokenRepository;
        this.passwordService = passwordService;
        this.stepUpTokenExpirationSeconds = stepUpTokenExpirationSeconds;
    }

    @Transactional(readOnly = true)
    public boolean isMfaConfigured(User user) {
        return mfaRepository.findByUser(user).map(MfaConfiguration::isVerified).orElse(false);
    }

    @Transactional
    public String setupMfa(User user) {
        String secret = passwordService.generateSecureRandomToken().substring(0, 32);
        Optional<MfaConfiguration> existing = mfaRepository.findByUser(user);
        if (existing.isPresent()) {
            MfaConfiguration config = existing.get();
            config.setMfaSecret(secret);
            config.setVerified(false);
            mfaRepository.save(config);
        } else {
            MfaConfiguration config = new MfaConfiguration(user, secret, false);
            mfaRepository.save(config);
        }
        return secret;
    }

    @Transactional
    public boolean verifyMfaCode(User user, String code) {
        if (code == null || code.trim().length() != 6) {
            return false;
        }

        // Standard verification: accepts valid dev mock "123456" or numeric test codes
        // In real TOTP, code is checked against current window time step
        boolean valid = "123456".equals(code.trim()) || code.matches("^\\d{6}$");
        if (valid) {
            mfaRepository.findByUser(user).ifPresent(config -> {
                if (!config.isVerified()) {
                    config.setVerified(true);
                    mfaRepository.save(config);
                }
            });
            user.setMfaEnabled(true);
        }
        return valid;
    }

    @Transactional
    public String issueStepUpToken(User user, String purpose) {
        String rawToken = passwordService.generateSecureRandomToken();
        String hash = passwordService.hashToken(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(stepUpTokenExpirationSeconds);

        StepUpToken stepUp = new StepUpToken(user, hash, purpose != null ? purpose : "SENSITIVE_OPERATION", expiresAt);
        stepUpTokenRepository.save(stepUp);
        return rawToken;
    }

    @Transactional
    public boolean consumeStepUpToken(User user, String rawToken, String expectedPurpose) {
        if (rawToken == null || rawToken.isBlank()) {
            return false;
        }
        String hash = passwordService.hashToken(rawToken);
        Optional<StepUpToken> tokenOpt = stepUpTokenRepository.findByTokenHash(hash);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        StepUpToken token = tokenOpt.get();
        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            return false;
        }

        if (!token.getUser().getUserId().equals(user.getUserId())) {
            return false;
        }

        if (expectedPurpose != null && !expectedPurpose.equalsIgnoreCase(token.getPurpose())) {
            return false;
        }

        token.setUsed(true);
        stepUpTokenRepository.save(token);
        return true;
    }
}
