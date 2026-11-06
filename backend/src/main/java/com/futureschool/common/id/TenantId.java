package com.futureschool.common.id;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * Immutable strongly-typed value object representing a Tenant / School identifier.
 */
public record TenantId(UUID value) implements Serializable {

    public TenantId {
        Objects.requireNonNull(value, "Tenant UUID value must not be null");
    }

    public static TenantId of(UUID value) {
        return new TenantId(value);
    }

    public static TenantId fromString(String uuidString) {
        return new TenantId(UUID.fromString(uuidString));
    }

    public static TenantId random() {
        return new TenantId(UUID.randomUUID());
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
