package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "quimica_clinica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuimicaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "protocolo_lab")
    private String protocoloLab;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    private Consulta consulta;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String glucemia;
    private String uremia;
    private String creatininemia;
    private String fosfatemia;
    private String albuminemia;
    private String got;
    private String gpt;
    private String cpk;
    private String ldh;
    private String observaciones;
}
