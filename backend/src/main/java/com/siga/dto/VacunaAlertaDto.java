package com.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacunaAlertaDto {
    private Long id;
    private Long animalId;
    private String animalNombre;
    private String duenioNombre;
    private String duenioEmail;
    private String nombreVacuna;
    private LocalDate fechaAplicacion;
    private LocalDate fechaProxima;
    private String estado;
}
