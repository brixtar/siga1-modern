package com.siga.dto;

import lombok.Data;

@Data
public class DuenioDto {
    private Long id;
    private String dni;
    private String nombre;
    private String apellido;
    private String email;
    private String facebook;
    private String domicilio;
    private String ciudad;
    private String telefonoFijo;
    private String telefonoCelular;
}
