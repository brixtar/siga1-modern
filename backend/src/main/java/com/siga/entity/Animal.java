package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "animal", indexes = {
    @Index(name = "idx_animal_nombre", columnList = "nombre"),
    @Index(name = "idx_animal_duenio", columnList = "duenio_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAnimal tipo;

    @ManyToOne
    @JoinColumn(name = "especie_id", nullable = false)
    private Especie especie;

    @ManyToOne
    @JoinColumn(name = "raza_id", nullable = false)
    private Raza raza;

    private Double peso;

    private LocalDate nacimiento;

    private String sexo;
    private String color;

    @ManyToOne
    @JoinColumn(name = "duenio_id", nullable = false)
    private Duenio duenio;

    @Column(nullable = false)
    private Boolean vivo = true;
}
