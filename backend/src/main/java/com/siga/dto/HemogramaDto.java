package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HemogramaDto {
    private Long id;
    private String protocoloLab;
    private LocalDateTime fecha;
    private Long consultaId;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private String eritrocitos;
    private String hemoglobina;
    private String hematocrito;
    private String vcm;
    private String hcm;
    private String chcm;
    private String reticulocitos;
    private String ipr;
    private String eritrNucleados;
    private String pPlasmaticas;
    private String fibrinogeno;
    private String relPpFibr;
    private String leucocitos;
    private String mieloblastos;
    private String promielocitos;
    private String mielocitos;
    private String metamielocitos;
    private String neutrofCay;
    private String neutrofSeg;
    private String eosinofilos;
    private String basofilos;
    private String linfocitos;
    private String monocitos;
    private String observaciones;
}
