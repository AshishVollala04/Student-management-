package com.futureschool.common.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginThrottlingService {

    private final int maxFailedAttempts;
    private final long lockoutDurationSeconds;

    private static class AttemptRecord {
        int failedAttempts;
        Instant lockoutUntil;
        Instant lastAttempt;

        AttemptRecord(int failedAttempts, Instant lastAttempt) {
            this.failedAttempts = failedAttempts;
            this.lastAttempt = lastAttempt;
        }
    }

    private final ConcurrentHashMap<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    public LoginThrottlingService(
            @Value("${app.security.throttling.max-failed-attempts:5}") int maxFailedAttempts,
            @Value("${app.security.throttling.lockout-duration-seconds:900}") long lockoutDurationSeconds) {
        this.maxFailedAttempts = maxFailedAttempts;
        this.lockoutDurationSeconds = lockoutDurationSeconds;
    }

    public boolean isBlocked(String key) {
        if (key == null) return false;
        AttemptRecord record = attempts.get(key);
        if (record == null) return false;

        if (record.lockoutUntil != null) {
            if (Instant.now().isBefore(record.lockoutUntil)) {
                return true;
            } else {
                // Lockout expired, reset
                attempts.remove(key);
                return false;
            }
        }
        return false;
    }

    public void recordFailedAttempt(String key) {
        if (key == null) return;
        Instant now = Instant.now();
        attempts.compute(key, (k, existing) -> {
            if (existing == null) {
                return new AttemptRecord(1, now);
            }
            existing.failedAttempts += 1;
            existing.lastAttempt = now;
            if (existing.failedAttempts >= maxFailedAttempts) {
                existing.lockoutUntil = now.plusSeconds(lockoutDurationSeconds);
            }
            return existing;
        });
    }

    public void recordSuccess(String key) {
        if (key != null) {
            attempts.remove(key);
        }
    }

    public int getRemainingAttempts(String key) {
        if (key == null) return maxFailedAttempts;
        AttemptRecord record = attempts.get(key);
        if (record == null) return maxFailedAttempts;
        return Math.max(0, maxFailedAttempts - record.failedAttempts);
    }

    public void reset(String key) {
        if (key != null) {
            attempts.remove(key);
        }
    }
}
