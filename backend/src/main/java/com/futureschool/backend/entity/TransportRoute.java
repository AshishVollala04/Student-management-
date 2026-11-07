package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transport_routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransportRoute {

    @Id
    @Column(name = "id", length = 64)
    private String id; // e.g. "ROUTE-01"

    @Column(name = "route_name", nullable = false, length = 128)
    private String routeName; // e.g. "Indiranagar - Whitefield Express"

    @Column(name = "vehicle_number", nullable = false, length = 32)
    private String vehicleNumber; // e.g. "KA-01-AB-1234"

    @Column(name = "driver_name", length = 128)
    private String driverName;

    @Column(name = "driver_phone", length = 32)
    private String driverPhone;

    @Column(name = "stops", columnDefinition = "TEXT")
    private String stops; // JSON or comma-separated list of stops

    @Column(name = "capacity", nullable = false)
    @Builder.Default
    private int capacity = 40;

    @Column(name = "enrolled_count", nullable = false)
    @Builder.Default
    private int enrolledCount = 0;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
