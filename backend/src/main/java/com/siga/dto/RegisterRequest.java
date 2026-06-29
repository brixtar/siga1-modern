package com.siga.dto;

import com.siga.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    private String dni;
    private String nombre;
    private String apellido;
    private String matricula;
    private String domicilio;
    private String ciudad;
    private String telefonoCelular;
    private String telefonoFijo;
}
