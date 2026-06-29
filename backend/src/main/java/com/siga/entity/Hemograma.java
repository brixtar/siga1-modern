package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "hemograma")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hemograma {

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

    private String eritrocitos;
    private String hemoglobina;
    private String hematocrito;
    private String vcm;
    private String hcm;
    private String chcm;
    private String reticulocitos;
    private String ipr;

    @Column(name = "eritr_nucleados")
    private String eritrNucleados;

    @Column(name = "p_plasmaticas")
    private String pPlasmaticas;

    private String fibrinogeno;

    @Column(name = "rel_pp_fibr")
    private String relPpFibr;

    private String leucocitos;
    private String mieloblastos;
    private String promielocitos;
    private String mielocitos;
    private String metamielocitos;

    @Column(name = "neutrof_cay")
    private String neutrofCay;

    @Column(name = "neutrof_seg")
    private String neutrofSeg;

    private String eosinofilos;
    private String basofilos;
    private String linfocitos;
    private String monocitos;
    private String observaciones;
}
