package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consulta_medicamento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consulta_id", nullable = false)
    private Consulta consulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    @Column(nullable = false)
    private Integer cantidad;

    private String dosificacion;
}
