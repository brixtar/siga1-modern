package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vacuna_alerta", indexes = {
    @Index(name = "idx_vacuna_alerta_animal", columnList = "animal_id"),
    @Index(name = "idx_vacuna_alerta_proxima", columnList = "fecha_proxima")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacunaAlerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "nombre_vacuna", nullable = false)
    private String nombreVacuna;

    @Column(name = "fecha_aplicacion", nullable = false)
    private LocalDate fechaAplicacion;

    @Column(name = "fecha_proxima", nullable = false)
    private LocalDate fechaProxima;

    @Column(nullable = false)
    @Builder.Default
    private String estado = "PENDIENTE";
}
