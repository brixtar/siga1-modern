package com.siga.dto;

import com.siga.entity.TipoAnimal;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AnimalDto {
    private Long id;
    private String nombre;
    private TipoAnimal tipo;
    private Long especieId;
    private String especieNombre;
    private Long razaId;
    private String razaNombre;
    private Double peso;
    private LocalDate nacimiento;
    private String sexo;
    private String color;
    private Long duenioId;
    private String duenioNombreCompleto;
    private Boolean vivo;
}
