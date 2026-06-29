package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "retorno")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Retorno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consulta_id", nullable = false)
    private Consulta consulta;

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
    private String temperatura;
    private String fc;
    private String fr;
    private String cc;

    @Column(name = "ll_cap")
    private String llCap;

    @Column(name = "pulso_ritmo")
    private String pulsoRitmo;

    @Column(name = "pulso_intensidad")
    private String pulsoIntensidad;

    private String hidratacion;

    @Column(name = "ma_ocular")
    private String maOcular;

    @Column(name = "ma_bucal")
    private String maBucal;

    @Column(name = "ma_nasal")
    private String maNasal;

    @Column(name = "ma_genital")
    private String maGenital;

    private String submandibular;
    private String axilar;
    private String inguinales;
    private String popliteos;
    private String indicaciones;
}
