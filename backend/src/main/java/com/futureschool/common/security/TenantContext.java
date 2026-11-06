package com.futureschool.common.security;

import com.futureschool.common.id.TenantId;

import java.util.Optional;

/**
 * Interface representing the current execution tenant context.
 */
public interface TenantContext {

    /**
     * Returns the current TenantId or empty if unauthenticated / platform scope.
     */
    Optional<TenantId> getTenantId();

    /**
     * Returns true if executing under a valid school tenant context.
     */
    boolean isTenantScoped();

    /**
     * Clears the current tenant context.
     */
    void clear();
}
