package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DerivacionDto {
    private Long id;
    private LocalDateTime fecha;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private Long alumnoId;
    private String alumnoNombreCompleto;
    private String anamnesis;
    private String sistema;
    private String indicaciones;
}
