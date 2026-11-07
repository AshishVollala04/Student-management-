package com.futureschool.common.exception;

import com.futureschool.common.api.CorrelationIdFilter;
import com.futureschool.common.api.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Centralized exception handler enforcing Phase 13 error schema.
 * Stack traces and raw SQL exceptions are strictly filtered and never leaked.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.warn("Business exception [{}] {}: {}", requestId, ex.getErrorCode(), ex.getMessage());

        ErrorResponse response = ErrorResponse.of(ex.getHttpStatus(), ex.getErrorCode(), ex.getMessage(), requestId);
        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        List<ErrorResponse.FieldErrorItem> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(this::mapFieldError)
                .toList();

        log.warn("Validation failure [{}] on {} fields", requestId, fieldErrors.size());
        ErrorResponse response = ErrorResponse.of(422, "VALIDATION_FAILED", "The request contains invalid or unprocessable values.", fieldErrors, requestId);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.warn("Access denied [{}]: {}", requestId, ex.getMessage());
        ErrorResponse response = ErrorResponse.of(403, "FORBIDDEN", "You are not authorized to perform this operation.", requestId);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.warn("Authentication failure [{}]: {}", requestId, ex.getMessage());
        String msg = (ex.getMessage() != null && !ex.getMessage().isBlank())
                ? ex.getMessage()
                : "Authentication credentials are required or invalid.";
        ErrorResponse response = ErrorResponse.of(401, "UNAUTHORIZED", msg, requestId);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.error("Unhandled internal server exception [{}]", requestId, ex);
        // Clean sanitized message to prevent leaking SQL or framework internals
        ErrorResponse response = ErrorResponse.of(500, "INTERNAL_SERVER_ERROR", "An unexpected internal server error occurred. Please contact support with the request ID.", requestId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    private ErrorResponse.FieldErrorItem mapFieldError(FieldError error) {
        return new ErrorResponse.FieldErrorItem(
                error.getField(),
                error.getCode() != null ? error.getCode().toUpperCase() : "INVALID_FIELD",
                error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid field value"
        );
    }

    private String getRequestId(HttpServletRequest request) {
        String id = (String) request.getAttribute(CorrelationIdFilter.REQUEST_ID_ATTRIBUTE);
        return id != null ? id : CorrelationIdFilter.generateRequestId();
    }
}
