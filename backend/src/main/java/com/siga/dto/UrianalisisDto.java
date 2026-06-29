package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrianalisisDto {
    private Long id;
    private String protocoloLab;
    private LocalDateTime fecha;
    private Long consultaId;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private String color;
    private String aspecto;
    private String densidad;
    private String ph;
    private String proteina;
    private String urobilinogeno;
    private String glucosa;
    private String cCetonicos;
    private String leucocitos;
    private String nitritos;
    private String sangreOculta;
    private String pigBiliares;
    private String observaciones;
    private String celulasSanguineas;
    private String celulasSanguineas2;
    private String celulasEpiteliales;
    private String celulasEpiteliales2;
    private String cilindros;
    private String cilindros2;
    private String cristales;
    private String cristales2;
    private String otra;
    private String otra2;
    private String observaciones2;
}
