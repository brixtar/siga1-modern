package com.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PesoRegistroDto {
    private Long id;
    private Long animalId;
    private LocalDate fecha;
    private Double peso;
}
