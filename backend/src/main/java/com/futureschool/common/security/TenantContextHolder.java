package com.futureschool.common.security;

import com.futureschool.common.id.TenantId;

import java.util.Optional;

/**
 * Thread-local based TenantContextHolder for propagating tenant context across execution threads.
 * Note: In Phase 16, this is populated strictly from verified JWT tokens by TenantContextFilter.
 */
public final class TenantContextHolder {

    private static final ThreadLocal<TenantId> CONTEXT = new ThreadLocal<>();

    private TenantContextHolder() {
    }

    public static void setTenantId(TenantId tenantId) {
        CONTEXT.set(tenantId);
    }

    public static Optional<TenantId> getTenantId() {
        return Optional.ofNullable(CONTEXT.get());
    }

    public static TenantId getRequiredTenantId() {
        return getTenantId().orElseThrow(() ->
                new IllegalStateException("No active tenant context bound to current thread"));
    }

    public static boolean isTenantScoped() {
        return CONTEXT.get() != null;
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
