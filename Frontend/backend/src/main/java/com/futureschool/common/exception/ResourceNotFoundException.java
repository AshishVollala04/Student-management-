package com.futureschool.common.exception;

/**
 * Thrown when a resource does not exist within the current tenant partition.
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String resourceType, String identifier) {
        super(String.format("%s with identifier '%s' was not found", resourceType, identifier),
                "RESOURCE_NOT_FOUND", 404);
    }

    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", 404);
    }
}
