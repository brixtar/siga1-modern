package com.siga.service;

import com.siga.dto.ConsultaDto;
import com.siga.dto.ConsultaMedicamentoDto;
import com.siga.entity.Consulta;
import com.siga.entity.ConsultaMedicamento;
import com.siga.entity.Medicamento;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AlumnoRepository;
import com.siga.repository.AnimalRepository;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.MedicamentoRepository;
import com.siga.repository.ConsultaMedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private ConsultaMedicamentoRepository consultaMedicamentoRepository;

    public List<ConsultaDto> findAll() {
        return consultaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ConsultaDto findById(Long id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + id));
        return toDto(consulta);
    }

    public List<ConsultaDto> findByAnimalId(Long animalId) {
        return consultaRepository.findByAnimalId(animalId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ConsultaDto> findByDoctorId(Long doctorId) {
        return consultaRepository.findByDoctorId(doctorId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ConsultaDto> findByFechaRange(LocalDateTime start, LocalDateTime end) {
        return consultaRepository.findByFechaBetween(start, end).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ConsultaDto create(ConsultaDto dto) {
        Consulta consulta = mapToEntity(dto, new Consulta());
        consulta.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        Consulta saved = consultaRepository.save(consulta);
        if (dto.getMedicamentos() != null) {
            for (ConsultaMedicamentoDto mDto : dto.getMedicamentos()) {
                Medicamento med = medicamentoRepository.findById(mDto.getMedicamentoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medicamento not found: " + mDto.getMedicamentoId()));
                if (med.getCantidadStock() < mDto.getCantidad()) {
                    throw new IllegalArgumentException("Stock insuficiente para: " + med.getNombre() + " (Disponible: " + med.getCantidadStock() + ")");
                }
                med.setCantidadStock(med.getCantidadStock() - mDto.getCantidad());
                medicamentoRepository.save(med);

                ConsultaMedicamento cm = ConsultaMedicamento.builder()
                        .consulta(saved)
                        .medicamento(med)
                        .cantidad(mDto.getCantidad())
                        .dosificacion(mDto.getDosificacion())
                        .build();
                consultaMedicamentoRepository.save(cm);
            }
        }
        return toDto(saved);
    }

    @Transactional
    public ConsultaDto update(Long id, ConsultaDto dto) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + id));
        mapToEntity(dto, consulta);

        // Restore stock for existing
        List<ConsultaMedicamento> existing = consultaMedicamentoRepository.findByConsultaId(id);
        for (ConsultaMedicamento cm : existing) {
            Medicamento med = cm.getMedicamento();
            med.setCantidadStock(med.getCantidadStock() + cm.getCantidad());
            medicamentoRepository.save(med);
        }
        consultaMedicamentoRepository.deleteAll(existing);

        Consulta saved = consultaRepository.save(consulta);

        // Apply new medicines list
        if (dto.getMedicamentos() != null) {
            for (ConsultaMedicamentoDto mDto : dto.getMedicamentos()) {
                Medicamento med = medicamentoRepository.findById(mDto.getMedicamentoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medicamento not found: " + mDto.getMedicamentoId()));
                if (med.getCantidadStock() < mDto.getCantidad()) {
                    throw new IllegalArgumentException("Stock insuficiente para: " + med.getNombre() + " (Disponible: " + med.getCantidadStock() + ")");
                }
                med.setCantidadStock(med.getCantidadStock() - mDto.getCantidad());
                medicamentoRepository.save(med);

                ConsultaMedicamento cm = ConsultaMedicamento.builder()
                        .consulta(saved)
                        .medicamento(med)
                        .cantidad(mDto.getCantidad())
                        .dosificacion(mDto.getDosificacion())
                        .build();
                consultaMedicamentoRepository.save(cm);
            }
        }
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + id));

        // Restore stock
        List<ConsultaMedicamento> existing = consultaMedicamentoRepository.findByConsultaId(id);
        for (ConsultaMedicamento cm : existing) {
            Medicamento med = cm.getMedicamento();
            med.setCantidadStock(med.getCantidadStock() + cm.getCantidad());
            medicamentoRepository.save(med);
        }
        consultaMedicamentoRepository.deleteAll(existing);

        consultaRepository.delete(consulta);
    }

    private Consulta mapToEntity(ConsultaDto dto, Consulta consulta) {
        consulta.setCasoClinico(dto.getCasoClinico());
        consulta.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getDoctorId() != null) {
            consulta.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        if (dto.getAlumnoId() != null) {
            consulta.setAlumno(alumnoRepository.findById(dto.getAlumnoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + dto.getAlumnoId())));
        }
        consulta.setMotivo(dto.getMotivo());
        consulta.setAnamnesis(dto.getAnamnesis());
        consulta.setTemperatura(dto.getTemperatura());
        consulta.setFc(dto.getFc());
        consulta.setFr(dto.getFr());
        consulta.setCc(dto.getCc());
        consulta.setLlCap(dto.getLlCap());
        consulta.setPulsoRitmo(dto.getPulsoRitmo());
        consulta.setPulsoIntensidad(dto.getPulsoIntensidad());
        consulta.setHidratacion(dto.getHidratacion());
        consulta.setMaOcular(dto.getMaOcular());
        consulta.setMaBucal(dto.getMaBucal());
        consulta.setMaNasal(dto.getMaNasal());
        consulta.setMaGenital(dto.getMaGenital());
        consulta.setSubmandibular(dto.getSubmandibular());
        consulta.setAxilar(dto.getAxilar());
        consulta.setInguinales(dto.getInguinales());
        consulta.setPopliteos(dto.getPopliteos());
        consulta.setLesionTipo(dto.getLesionTipo());
        consulta.setLesionForma(dto.getLesionForma());
        consulta.setLesionUbicacion(dto.getLesionUbicacion());
        consulta.setLesionSimetria(dto.getLesionSimetria());
        consulta.setOlor(dto.getOlor());
        consulta.setPrurito(dto.getPrurito());
        consulta.setMantoPiloso(dto.getMantoPiloso());
        consulta.setEctoparasitos(dto.getEctoparasitos());
        consulta.setOido(dto.getOido());
        consulta.setBoca(dto.getBoca());
        consulta.setEsofago(dto.getEsofago());
        consulta.setEstomago(dto.getEstomago());
        consulta.setIntestino(dto.getIntestino());
        consulta.setHigado(dto.getHigado());
        consulta.setRegurgitacion(dto.getRegurgitacion());
        consulta.setVomito(dto.getVomito());
        consulta.setDiarrea(dto.getDiarrea());
        consulta.setRuidos(dto.getRuidos());
        consulta.setDistension(dto.getDistension());
        consulta.setViasSuperiores(dto.getViasSuperiores());
        consulta.setViasInferiores(dto.getViasInferiores());
        consulta.setRitmoRespiratorio(dto.getRitmoRespiratorio());
        consulta.setTipo(dto.getTipo());
        consulta.setTosReflejo(dto.getTosReflejo());
        consulta.setAuscultacion(dto.getAuscultacion());
        consulta.setCorazonAuscultacion(dto.getCorazonAuscultacion());
        consulta.setRitmoCorazon(dto.getRitmoCorazon());
        consulta.setRinones(dto.getRinones());
        consulta.setUreteres(dto.getUreteres());
        consulta.setVejiga(dto.getVejiga());
        consulta.setUretra(dto.getUretra());
        consulta.setSecreciones(dto.getSecreciones());
        consulta.setOrina(dto.getOrina());
        consulta.setGenitalesInterno(dto.getGenitalesInterno());
        consulta.setGenitalesExterno(dto.getGenitalesExterno());
        consulta.setGenitalesSecreciones(dto.getGenitalesSecreciones());
        consulta.setTactoRectal(dto.getTactoRectal());
        consulta.setLocomotorLesion(dto.getLocomotorLesion());
        consulta.setLocomotorUbicacionL(dto.getLocomotorUbicacionL());
        consulta.setLocomotorDeformacion(dto.getLocomotorDeformacion());
        consulta.setLocomotorUbicacionD(dto.getLocomotorUbicacionD());
        consulta.setClaudicacionMiembro(dto.getClaudicacionMiembro());
        consulta.setClaudicacionTipo(dto.getClaudicacionTipo());
        consulta.setNerviosoUbicacion(dto.getNerviosoUbicacion());
        consulta.setParalisis(dto.getParalisis());
        consulta.setParesia(dto.getParesia());
        consulta.setConvulsion(dto.getConvulsion());
        consulta.setAtaxia(dto.getAtaxia());
        consulta.setReflejos(dto.getReflejos());
        consulta.setSensibilidad(dto.getSensibilidad());
        consulta.setConducta(dto.getConducta());
        consulta.setEstadoSensorio(dto.getEstadoSensorio());
        consulta.setSnms(dto.getSnms());
        consulta.setSnmi(dto.getSnmi());
        consulta.setOjoDerecho(dto.getOjoDerecho());
        consulta.setOjoIzq(dto.getOjoIzq());
        consulta.setDiagnosticoPresuntivo(dto.getDiagnosticoPresuntivo());
        consulta.setDiagnosticoDiferencial(dto.getDiagnosticoDiferencial());
        consulta.setDiagnosticoPronostico(dto.getDiagnosticoPronostico());
        consulta.setTratamiento(dto.getTratamiento());
        consulta.setIndicaciones(dto.getIndicaciones());
        return consulta;
    }

    private ConsultaDto toDto(Consulta c) {
        ConsultaDto dto = new ConsultaDto();
        dto.setId(c.getId());
        dto.setCasoClinico(c.getCasoClinico());
        dto.setFecha(c.getFecha());
        dto.setAnimalId(c.getAnimal().getId());
        dto.setAnimalNombre(c.getAnimal().getNombre());
        if (c.getDoctor() != null) {
            dto.setDoctorId(c.getDoctor().getId());
            dto.setDoctorNombreCompleto(c.getDoctor().getNombre() + " " + c.getDoctor().getApellido());
        }
        if (c.getAlumno() != null) {
            dto.setAlumnoId(c.getAlumno().getId());
            dto.setAlumnoNombreCompleto(c.getAlumno().getNombre() + " " + c.getAlumno().getApellido());
        }
        dto.setMotivo(c.getMotivo());
        dto.setAnamnesis(c.getAnamnesis());
        dto.setTemperatura(c.getTemperatura());
        dto.setFc(c.getFc());
        dto.setFr(c.getFr());
        dto.setCc(c.getCc());
        dto.setLlCap(c.getLlCap());
        dto.setPulsoRitmo(c.getPulsoRitmo());
        dto.setPulsoIntensidad(c.getPulsoIntensidad());
        dto.setHidratacion(c.getHidratacion());
        dto.setMaOcular(c.getMaOcular());
        dto.setMaBucal(c.getMaBucal());
        dto.setMaNasal(c.getMaNasal());
        dto.setMaGenital(c.getMaGenital());
        dto.setSubmandibular(c.getSubmandibular());
        dto.setAxilar(c.getAxilar());
        dto.setInguinales(c.getInguinales());
        dto.setPopliteos(c.getPopliteos());
        dto.setLesionTipo(c.getLesionTipo());
        dto.setLesionForma(c.getLesionForma());
        dto.setLesionUbicacion(c.getLesionUbicacion());
        dto.setLesionSimetria(c.getLesionSimetria());
        dto.setOlor(c.getOlor());
        dto.setPrurito(c.getPrurito());
        dto.setMantoPiloso(c.getMantoPiloso());
        dto.setEctoparasitos(c.getEctoparasitos());
        dto.setOido(c.getOido());
        dto.setBoca(c.getBoca());
        dto.setEsofago(c.getEsofago());
        dto.setEstomago(c.getEstomago());
        dto.setIntestino(c.getIntestino());
        dto.setHigado(c.getHigado());
        dto.setRegurgitacion(c.getRegurgitacion());
        dto.setVomito(c.getVomito());
        dto.setDiarrea(c.getDiarrea());
        dto.setRuidos(c.getRuidos());
        dto.setDistension(c.getDistension());
        dto.setViasSuperiores(c.getViasSuperiores());
        dto.setViasInferiores(c.getViasInferiores());
        dto.setRitmoRespiratorio(c.getRitmoRespiratorio());
        dto.setTipo(c.getTipo());
        dto.setTosReflejo(c.getTosReflejo());
        dto.setAuscultacion(c.getAuscultacion());
        dto.setCorazonAuscultacion(c.getCorazonAuscultacion());
        dto.setRitmoCorazon(c.getRitmoCorazon());
        dto.setRinones(c.getRinones());
        dto.setUreteres(c.getUreteres());
        dto.setVejiga(c.getVejiga());
        dto.setUretra(c.getUretra());
        dto.setSecreciones(c.getSecreciones());
        dto.setOrina(c.getOrina());
        dto.setGenitalesInterno(c.getGenitalesInterno());
        dto.setGenitalesExterno(c.getGenitalesExterno());
        dto.setGenitalesSecreciones(c.getGenitalesSecreciones());
        dto.setTactoRectal(c.getTactoRectal());
        dto.setLocomotorLesion(c.getLocomotorLesion());
        dto.setLocomotorUbicacionL(c.getLocomotorUbicacionL());
        dto.setLocomotorDeformacion(c.getLocomotorDeformacion());
        dto.setLocomotorUbicacionD(c.getLocomotorUbicacionD());
        dto.setClaudicacionMiembro(c.getClaudicacionMiembro());
        dto.setClaudicacionTipo(c.getClaudicacionTipo());
        dto.setNerviosoUbicacion(c.getNerviosoUbicacion());
        dto.setParalisis(c.getParalisis());
        dto.setParesia(c.getParesia());
        dto.setConvulsion(c.getConvulsion());
        dto.setAtaxia(c.getAtaxia());
        dto.setReflejos(c.getReflejos());
        dto.setSensibilidad(c.getSensibilidad());
        dto.setConducta(c.getConducta());
        dto.setEstadoSensorio(c.getEstadoSensorio());
        dto.setSnms(c.getSnms());
        dto.setSnmi(c.getSnmi());
        dto.setOjoDerecho(c.getOjoDerecho());
        dto.setOjoIzq(c.getOjoIzq());
        dto.setDiagnosticoPresuntivo(c.getDiagnosticoPresuntivo());
        dto.setDiagnosticoDiferencial(c.getDiagnosticoDiferencial());
        dto.setDiagnosticoPronostico(c.getDiagnosticoPronostico());
        dto.setTratamiento(c.getTratamiento());
        dto.setIndicaciones(c.getIndicaciones());

        List<ConsultaMedicamentoDto> meds = consultaMedicamentoRepository.findByConsultaId(c.getId()).stream()
                .map(cm -> {
                    ConsultaMedicamentoDto mDto = new ConsultaMedicamentoDto();
                    mDto.setId(cm.getId());
                    mDto.setConsultaId(cm.getConsulta().getId());
                    mDto.setMedicamentoId(cm.getMedicamento().getId());
                    mDto.setMedicamentoNombre(cm.getMedicamento().getNombre());
                    mDto.setCantidad(cm.getCantidad());
                    mDto.setDosificacion(cm.getDosificacion());
                    return mDto;
                }).collect(Collectors.toList());
        dto.setMedicamentos(meds);

        return dto;
    }
}
