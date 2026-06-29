package com.siga.dto;

import lombok.Data;

@Data
public class EstadisticaDto {
    private Long doctorId;
    private String doctorNombre;
    private Long alumnoId;
    private String alumnoNombre;
    private Long cantidadConsultas;
    private Long cantidadDerivaciones;
    private Long cantidadRetornos;
}
