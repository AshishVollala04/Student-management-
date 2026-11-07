package com.futureschool.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.UUID;

/**
 * Standard API response envelope as specified in Phase 13.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        T data,
        ErrorDetails error,
        ApiMeta meta
) {
    public ApiResponse(T data, ApiMeta meta) {
        this(true, data, null, meta);
    }

    public static <T> ApiResponse<T> of(T data, String requestId) {
        return new ApiResponse<>(true, data, null, new ApiMeta(Instant.now(), requestId, null));
    }

    public static <T> ApiResponse<T> of(T data, String requestId, PageMeta pageMeta) {
        return new ApiResponse<>(true, data, null, new ApiMeta(Instant.now(), requestId, pageMeta));
    }

    public static <T> ApiResponse<T> success(T data) {
        return of(data, UUID.randomUUID().toString());
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return of(data, UUID.randomUUID().toString());
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorDetails(code, message), new ApiMeta(Instant.now(), UUID.randomUUID().toString(), null));
    }

    public record ErrorDetails(
            String code,
            String message
    ) {}

    public record ApiMeta(
            Instant timestamp,
            String requestId,
            PageMeta pagination
    ) {}

    public record PageMeta(
            int page,
            int size,
            long totalElements,
            int totalPages
    ) {}
}
