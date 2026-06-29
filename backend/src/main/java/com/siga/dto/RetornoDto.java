package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RetornoDto {
    private Long id;
    private Long consultaId;
    private LocalDateTime fecha;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private Long alumnoId;
    private String alumnoNombreCompleto;
    private String anamnesis;
    private String temperatura;
    private String fc;
    private String fr;
    private String cc;
    private String llCap;
    private String pulsoRitmo;
    private String pulsoIntensidad;
    private String hidratacion;
    private String maOcular;
    private String maBucal;
    private String maNasal;
    private String maGenital;
    private String submandibular;
    private String axilar;
    private String inguinales;
    private String popliteos;
    private String indicaciones;
}
