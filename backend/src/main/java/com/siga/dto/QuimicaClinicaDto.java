package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuimicaClinicaDto {
    private Long id;
    private String protocoloLab;
    private LocalDateTime fecha;
    private Long consultaId;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private String glucemia;
    private String uremia;
    private String creatininemia;
    private String fosfatemia;
    private String albuminemia;
    private String got;
    private String gpt;
    private String cpk;
    private String ldh;
    private String observaciones;
}
