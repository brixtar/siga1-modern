package com.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@lombok.NoArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private Boolean puedeVerAuditoria = false;

    public LoginResponse(String token, Long id, String username, String email, List<String> roles, Boolean puedeVerAuditoria) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.puedeVerAuditoria = puedeVerAuditoria;
    }
}
