package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TurnoDto {
    private Long id;
    private LocalDateTime fechaHora;
    private String motivo;
    private String estado;
    private Long animalId;
    private Long doctorId;
    private String animalNombre;
    private String doctorNombre;
}
