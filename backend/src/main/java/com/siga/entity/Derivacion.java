package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "derivacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Derivacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    private String anamnesis;
    private String sistema;
    private String indicaciones;
}
