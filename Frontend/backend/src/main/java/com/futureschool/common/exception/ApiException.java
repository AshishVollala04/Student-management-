package com.futureschool.common.exception;

/**
 * Base unchecked exception for FutureSchool business domain errors.
 */
public class ApiException extends RuntimeException {

    private final String errorCode;
    private final int httpStatus;

    public ApiException(String message, String errorCode, int httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public static ApiException conflict(String errorCode, String message) {
        return new ApiException(message, errorCode, 409);
    }

    public static ApiException notFound(String errorCode, String message) {
        return new ApiException(message, errorCode, 404);
    }

    public static ApiException badRequest(String errorCode, String message) {
        return new ApiException(message, errorCode, 400);
    }

    public static ApiException forbidden(String errorCode, String message) {
        return new ApiException(message, errorCode, 403);
    }

    public static ApiException unprocessable(String errorCode, String message) {
        return new ApiException(message, errorCode, 422);
    }

    public String getErrorCode() {
        return errorCode;
    }

    public int getHttpStatus() {
        return httpStatus;
    }
}
