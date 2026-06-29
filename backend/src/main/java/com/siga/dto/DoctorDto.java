package com.siga.dto;

import lombok.Data;

@Data
public class DoctorDto {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String dni;
    private String nombre;
    private String apellido;
    private String matricula;
    private String domicilio;
    private String ciudad;
    private String telefonoCelular;
    private String telefonoFijo;
}
