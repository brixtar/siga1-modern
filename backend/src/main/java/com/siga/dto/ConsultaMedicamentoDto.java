package com.siga.dto;

import lombok.Data;

@Data
public class ConsultaMedicamentoDto {
    private Long id;
    private Long consultaId;
    private Long medicamentoId;
    private String medicamentoNombre;
    private Integer cantidad;
    private String dosificacion;
}
