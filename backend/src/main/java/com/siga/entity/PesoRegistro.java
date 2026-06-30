package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "peso_registro", indexes = {
    @Index(name = "idx_peso_registro_animal", columnList = "animal_id"),
    @Index(name = "idx_peso_registro_fecha", columnList = "fecha")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PesoRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private Double peso;
}
