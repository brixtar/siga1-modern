package com.siga.dto;

import lombok.Data;

@Data
public class MedicamentoDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer cantidadStock;
    private Integer stockMinimo;
    private Double precioUnidad;
    private String unidadMedida;
}
