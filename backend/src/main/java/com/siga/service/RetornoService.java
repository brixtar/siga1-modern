package com.siga.service;

import com.siga.dto.RetornoDto;
import com.siga.entity.Retorno;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AlumnoRepository;
import com.siga.repository.AnimalRepository;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.RetornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RetornoService {

    @Autowired
    private RetornoRepository retornoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    public List<RetornoDto> findAll() {
        return retornoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public RetornoDto findById(Long id) {
        Retorno retorno = retornoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Retorno not found: " + id));
        return toDto(retorno);
    }

    @Transactional
    public RetornoDto create(RetornoDto dto) {
        Retorno retorno = new Retorno();
        retorno.setConsulta(consultaRepository.findById(dto.getConsultaId())
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + dto.getConsultaId())));
        retorno.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        retorno.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getDoctorId() != null) {
            retorno.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        if (dto.getAlumnoId() != null) {
            retorno.setAlumno(alumnoRepository.findById(dto.getAlumnoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + dto.getAlumnoId())));
        }
        retorno.setAnamnesis(dto.getAnamnesis());
        retorno.setTemperatura(dto.getTemperatura());
        retorno.setFc(dto.getFc());
        retorno.setFr(dto.getFr());
        retorno.setCc(dto.getCc());
        retorno.setLlCap(dto.getLlCap());
        retorno.setPulsoRitmo(dto.getPulsoRitmo());
        retorno.setPulsoIntensidad(dto.getPulsoIntensidad());
        retorno.setHidratacion(dto.getHidratacion());
        retorno.setMaOcular(dto.getMaOcular());
        retorno.setMaBucal(dto.getMaBucal());
        retorno.setMaNasal(dto.getMaNasal());
        retorno.setMaGenital(dto.getMaGenital());
        retorno.setSubmandibular(dto.getSubmandibular());
        retorno.setAxilar(dto.getAxilar());
        retorno.setInguinales(dto.getInguinales());
        retorno.setPopliteos(dto.getPopliteos());
        retorno.setIndicaciones(dto.getIndicaciones());
        return toDto(retornoRepository.save(retorno));
    }

    @Transactional
    public RetornoDto update(Long id, RetornoDto dto) {
        Retorno retorno = retornoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Retorno not found: " + id));
        retorno.setConsulta(consultaRepository.findById(dto.getConsultaId())
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + dto.getConsultaId())));
        retorno.setFecha(dto.getFecha());
        retorno.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getDoctorId() != null) {
            retorno.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        } else {
            retorno.setDoctor(null);
        }
        if (dto.getAlumnoId() != null) {
            retorno.setAlumno(alumnoRepository.findById(dto.getAlumnoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + dto.getAlumnoId())));
        } else {
            retorno.setAlumno(null);
        }
        retorno.setAnamnesis(dto.getAnamnesis());
        retorno.setTemperatura(dto.getTemperatura());
        retorno.setFc(dto.getFc());
        retorno.setFr(dto.getFr());
        retorno.setCc(dto.getCc());
        retorno.setLlCap(dto.getLlCap());
        retorno.setPulsoRitmo(dto.getPulsoRitmo());
        retorno.setPulsoIntensidad(dto.getPulsoIntensidad());
        retorno.setHidratacion(dto.getHidratacion());
        retorno.setMaOcular(dto.getMaOcular());
        retorno.setMaBucal(dto.getMaBucal());
        retorno.setMaNasal(dto.getMaNasal());
        retorno.setMaGenital(dto.getMaGenital());
        retorno.setSubmandibular(dto.getSubmandibular());
        retorno.setAxilar(dto.getAxilar());
        retorno.setInguinales(dto.getInguinales());
        retorno.setPopliteos(dto.getPopliteos());
        retorno.setIndicaciones(dto.getIndicaciones());
        return toDto(retornoRepository.save(retorno));
    }

    @Transactional
    public void delete(Long id) {
        Retorno retorno = retornoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Retorno not found: " + id));
        retornoRepository.delete(retorno);
    }

    private RetornoDto toDto(Retorno r) {
        RetornoDto dto = new RetornoDto();
        dto.setId(r.getId());
        dto.setConsultaId(r.getConsulta().getId());
        dto.setFecha(r.getFecha());
        dto.setAnimalId(r.getAnimal().getId());
        dto.setAnimalNombre(r.getAnimal().getNombre());
        if (r.getDoctor() != null) {
            dto.setDoctorId(r.getDoctor().getId());
            dto.setDoctorNombreCompleto(r.getDoctor().getNombre() + " " + r.getDoctor().getApellido());
        }
        if (r.getAlumno() != null) {
            dto.setAlumnoId(r.getAlumno().getId());
            dto.setAlumnoNombreCompleto(r.getAlumno().getNombre() + " " + r.getAlumno().getApellido());
        }
        dto.setAnamnesis(r.getAnamnesis());
        dto.setTemperatura(r.getTemperatura());
        dto.setFc(r.getFc());
        dto.setFr(r.getFr());
        dto.setCc(r.getCc());
        dto.setLlCap(r.getLlCap());
        dto.setPulsoRitmo(r.getPulsoRitmo());
        dto.setPulsoIntensidad(r.getPulsoIntensidad());
        dto.setHidratacion(r.getHidratacion());
        dto.setMaOcular(r.getMaOcular());
        dto.setMaBucal(r.getMaBucal());
        dto.setMaNasal(r.getMaNasal());
        dto.setMaGenital(r.getMaGenital());
        dto.setSubmandibular(r.getSubmandibular());
        dto.setAxilar(r.getAxilar());
        dto.setInguinales(r.getInguinales());
        dto.setPopliteos(r.getPopliteos());
        dto.setIndicaciones(r.getIndicaciones());
        return dto;
    }
}
