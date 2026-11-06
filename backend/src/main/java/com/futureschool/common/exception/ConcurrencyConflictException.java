package com.futureschool.common.exception;

/**
 * Thrown when an optimistic concurrency check fails (e.g. ETag or version mismatch).
 */
public class ConcurrencyConflictException extends ApiException {

    public ConcurrencyConflictException(String message) {
        super(message, "CONCURRENCY_CONFLICT", 409);
    }
}
