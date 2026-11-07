package com.futureschool;

import com.futureschool.common.id.TenantId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class DomainIdentifierTest {

    @Test
    @DisplayName("TenantId value object enforces non-null invariant")
    void testTenantIdNullCheck() {
        assertThrows(NullPointerException.class, () -> new TenantId(null));
    }

    @Test
    @DisplayName("TenantId value object equality and string representation")
    void testTenantIdEquality() {
        UUID uuid = UUID.randomUUID();
        TenantId id1 = TenantId.of(uuid);
        TenantId id2 = TenantId.fromString(uuid.toString());

        assertEquals(id1, id2);
        assertEquals(uuid.toString(), id1.toString());
        assertEquals(id1.hashCode(), id2.hashCode());
    }
}
