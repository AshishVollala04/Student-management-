package com.futureschool.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

/**
 * Standard RFC 7807 extended error model as specified in Phase 13.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        Instant timestamp,
        int status,
        String code,
        String message,
        List<FieldErrorItem> fieldErrors,
        String requestId
) {
    public static ErrorResponse of(int status, String code, String message, String requestId) {
        return new ErrorResponse(Instant.now(), status, code, message, null, requestId);
    }

    public static ErrorResponse of(int status, String code, String message, List<FieldErrorItem> fieldErrors, String requestId) {
        return new ErrorResponse(Instant.now(), status, code, message, fieldErrors, requestId);
    }

    public record FieldErrorItem(
            String field,
            String code,
            String message
    ) {}
}
