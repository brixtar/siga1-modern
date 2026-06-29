package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consulta", indexes = {
    @Index(name = "idx_consulta_fecha", columnList = "fecha"),
    @Index(name = "idx_consulta_animal", columnList = "animal_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "caso_clinico", columnDefinition = "TEXT")
    private String casoClinico;

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

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String anamnesis;
    @Column(length = 100)
    private String temperatura;

    @Column(length = 100)
    private String fc;

    @Column(length = 100)
    private String fr;

    @Column(length = 100)
    private String cc;

    @Column(name = "ll_cap", length = 100)
    private String llCap;

    @Column(name = "pulso_ritmo", length = 100)
    private String pulsoRitmo;

    @Column(name = "pulso_intensidad", length = 100)
    private String pulsoIntensidad;

    @Column(length = 100)
    private String hidratacion;

    @Column(name = "ma_ocular", length = 100)
    private String maOcular;

    @Column(name = "ma_bucal", length = 100)
    private String maBucal;

    @Column(name = "ma_nasal", length = 100)
    private String maNasal;

    @Column(name = "ma_genital", length = 100)
    private String maGenital;

    @Column(length = 100)
    private String submandibular;

    @Column(length = 100)
    private String axilar;

    @Column(length = 100)
    private String inguinales;

    @Column(length = 100)
    private String popliteos;

    @Column(name = "lesion_tipo", length = 100)
    private String lesionTipo;

    @Column(name = "lesion_forma", length = 100)
    private String lesionForma;

    @Column(name = "lesion_ubicacion", length = 100)
    private String lesionUbicacion;

    @Column(name = "lesion_simetria", length = 100)
    private String lesionSimetria;

    @Column(length = 100)
    private String olor;

    @Column(length = 100)
    private String prurito;

    @Column(name = "manto_piloso", length = 100)
    private String mantoPiloso;

    @Column(length = 100)
    private String ectoparasitos;

    @Column(length = 100)
    private String oido;

    @Column(length = 100)
    private String boca;

    @Column(length = 100)
    private String esofago;

    @Column(length = 100)
    private String estomago;

    @Column(length = 100)
    private String intestino;

    @Column(length = 100)
    private String higado;

    @Column(length = 100)
    private String regurgitacion;

    @Column(length = 100)
    private String vomito;

    @Column(length = 100)
    private String diarrea;

    @Column(length = 100)
    private String ruidos;

    @Column(length = 100)
    private String distension;

    @Column(name = "vias_superiores", length = 100)
    private String viasSuperiores;

    @Column(name = "vias_inferiores", length = 100)
    private String viasInferiores;

    @Column(name = "ritmo_respiratorio", length = 100)
    private String ritmoRespiratorio;

    @Column(length = 100)
    private String tipo;

    @Column(name = "tos_reflejo", length = 100)
    private String tosReflejo;

    @Column(columnDefinition = "TEXT")
    private String auscultacion;

    @Column(name = "corazon_auscultacion", length = 100)
    private String corazonAuscultacion;

    @Column(name = "ritmo_corazon", length = 100)
    private String ritmoCorazon;

    @Column(name = "rinones", length = 100)
    private String rinones;

    @Column(length = 100)
    private String ureteres;

    @Column(length = 100)
    private String vejiga;

    @Column(length = 100)
    private String uretra;

    @Column(length = 100)
    private String secreciones;

    @Column(length = 100)
    private String orina;

    @Column(name = "genitales_interno", length = 100)
    private String genitalesInterno;

    @Column(name = "genitales_externo", length = 100)
    private String genitalesExterno;

    @Column(name = "genitales_secreciones", length = 100)
    private String genitalesSecreciones;

    @Column(name = "tacto_rectal", length = 100)
    private String tactoRectal;

    @Column(name = "locomotor_lesion", length = 100)
    private String locomotorLesion;

    @Column(name = "locomotor_ubicacionL", length = 100)
    private String locomotorUbicacionL;

    @Column(name = "locomotor_deformacion", length = 100)
    private String locomotorDeformacion;

    @Column(name = "locomotor_ubicacionD", length = 100)
    private String locomotorUbicacionD;

    @Column(name = "claudicacion_miembro", length = 100)
    private String claudicacionMiembro;

    @Column(name = "claudicacion_tipo", length = 100)
    private String claudicacionTipo;

    @Column(name = "nervioso_ubicacion", length = 100)
    private String nerviosoUbicacion;

    @Column(length = 100)
    private String paralisis;

    @Column(length = 100)
    private String paresia;

    @Column(length = 100)
    private String convulsion;

    @Column(length = 100)
    private String ataxia;

    @Column(length = 100)
    private String reflejos;

    @Column(length = 100)
    private String sensibilidad;

    @Column(length = 100)
    private String conducta;

    @Column(name = "estado_sensorio", length = 100)
    private String estadoSensorio;

    @Column(length = 100)
    private String snms;

    @Column(length = 100)
    private String snmi;

    @Column(name = "ojo_derecho", length = 100)
    private String ojoDerecho;

    @Column(name = "ojo_izq", length = 100)
    private String ojoIzq;

    @Column(name = "diagnostico_presuntivo", columnDefinition = "TEXT")
    private String diagnosticoPresuntivo;

    @Column(name = "diagnostico_diferencial", columnDefinition = "TEXT")
    private String diagnosticoDiferencial;

    @Column(name = "diagnostico_pronostico", columnDefinition = "TEXT")
    private String diagnosticoPronostico;

    @Column(columnDefinition = "TEXT")
    private String tratamiento;

    @Column(columnDefinition = "TEXT")
    private String indicaciones;

    @Column(name = "estado", length = 100)
    private String estado = "PENDIENTE";
}
