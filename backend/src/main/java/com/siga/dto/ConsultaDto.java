package com.siga.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConsultaDto {
    private Long id;
    private String casoClinico;
    private LocalDateTime fecha;
    private Long animalId;
    private String animalNombre;
    private Long doctorId;
    private String doctorNombreCompleto;
    private Long alumnoId;
    private String alumnoNombreCompleto;

    // General
    private String motivo;
    private String anamnesis;
    private String temperatura;
    private String fc;
    private String fr;
    private String cc;
    private String llCap;
    private String pulsoRitmo;
    private String pulsoIntensidad;
    private String hidratacion;
    private String maOcular;
    private String maBucal;
    private String maNasal;
    private String maGenital;
    private String submandibular;
    private String axilar;
    private String inguinales;
    private String popliteos;

    // Piel y anexos
    private String lesionTipo;
    private String lesionForma;
    private String lesionUbicacion;
    private String lesionSimetria;
    private String olor;
    private String prurito;
    private String mantoPiloso;
    private String ectoparasitos;

    // Digestivo
    private String oido;
    private String boca;
    private String esofago;
    private String estomago;
    private String intestino;
    private String higado;
    private String regurgitacion;
    private String vomito;
    private String diarrea;
    private String ruidos;
    private String distension;

    // Respiratorio
    private String viasSuperiores;
    private String viasInferiores;
    private String ritmoRespiratorio;
    private String tipo;
    private String tosReflejo;
    private String auscultacion;

    // Cardiovascular
    private String corazonAuscultacion;
    private String ritmoCorazon;

    // Urinario
    private String rinones;
    private String ureteres;
    private String vejiga;
    private String uretra;
    private String secreciones;
    private String orina;
    private String genitalesInterno;
    private String genitalesExterno;
    private String genitalesSecreciones;
    private String tactoRectal;

    // Locomotor
    private String locomotorLesion;
    private String locomotorUbicacionL;
    private String locomotorDeformacion;
    private String locomotorUbicacionD;
    private String claudicacionMiembro;
    private String claudicacionTipo;

    // Nervioso
    private String nerviosoUbicacion;
    private String paralisis;
    private String paresia;
    private String convulsion;
    private String ataxia;
    private String reflejos;
    private String sensibilidad;
    private String conducta;
    private String estadoSensorio;
    private String snms;
    private String snmi;
    private String ojoDerecho;
    private String ojoIzq;

    // Diagnosticos y tratamiento
    private String diagnosticoPresuntivo;
    private String diagnosticoDiferencial;
    private String diagnosticoPronostico;
    private String tratamiento;
    private String indicaciones;
    private String estado;
    private java.util.List<ConsultaMedicamentoDto> medicamentos;
}

