package com.futureschool.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private boolean success;
    private String token;
    private String message;
    private AccountDTO user;
    private String authorizedRole;
}
