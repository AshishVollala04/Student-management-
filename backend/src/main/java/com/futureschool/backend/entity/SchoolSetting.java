package com.futureschool.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "school_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolSetting {

    @Id
    @Column(name = "id", length = 64)
    private String id; // e.g. "DEFAULT"

    @Column(name = "school_name", nullable = false, length = 128)
    @Builder.Default
    private String schoolName = "FutureSchool High School";

    @Column(name = "school_code", length = 32)
    @Builder.Default
    private String schoolCode = "FSHS-2026";

    @Column(name = "affiliation_number", length = 64)
    @Builder.Default
    private String affiliationNumber = "CBSE-998877";

    @Column(name = "address", length = 255)
    @Builder.Default
    private String address = "Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103";

    @Column(name = "phone", length = 32)
    @Builder.Default
    private String phone = "+91 80 1234 5678";

    @Column(name = "email", length = 128)
    @Builder.Default
    private String email = "info@futureschool.edu";

    @Column(name = "website", length = 128)
    @Builder.Default
    private String website = "https://futureschool.edu";

    @Column(name = "current_academic_year", length = 32)
    @Builder.Default
    private String currentAcademicYear = "2026-2027";
}
