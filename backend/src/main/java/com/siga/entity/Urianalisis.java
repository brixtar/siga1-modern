package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "urianalisis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Urianalisis {

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

    private String color;
    private String aspecto;
    private String densidad;
    private String ph;
    private String proteina;
    private String urobilinogeno;
    private String glucosa;

    @Column(name = "c_cetonicos")
    private String cCetonicos;

    private String leucocitos;
    private String nitritos;

    @Column(name = "sangre_oculta")
    private String sangreOculta;

    @Column(name = "pig_biliares")
    private String pigBiliares;

    private String observaciones;

    @Column(name = "celulas_sanguineas")
    private String celulasSanguineas;

    @Column(name = "celulas_sanguineas2")
    private String celulasSanguineas2;

    @Column(name = "celulas_epiteliales")
    private String celulasEpiteliales;

    @Column(name = "celulas_epiteliales2")
    private String celulasEpiteliales2;

    private String cilindros;

    @Column(name = "cilindros2")
    private String cilindros2;

    private String cristales;

    @Column(name = "cristales2")
    private String cristales2;

    private String otra;

    @Column(name = "otra2")
    private String otra2;

    @Column(name = "observaciones2")
    private String observaciones2;
}
