package com.siga.service;

import com.siga.dto.DerivacionDto;
import com.siga.entity.Derivacion;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AlumnoRepository;
import com.siga.repository.AnimalRepository;
import com.siga.repository.DerivacionRepository;
import com.siga.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DerivacionService {

    @Autowired
    private DerivacionRepository derivacionRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    public List<DerivacionDto> findAll() {
        return derivacionRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public DerivacionDto findById(Long id) {
        Derivacion derivacion = derivacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Derivacion not found: " + id));
        return toDto(derivacion);
    }

    @Transactional
    public DerivacionDto create(DerivacionDto dto) {
        Derivacion derivacion = new Derivacion();
        derivacion.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        derivacion.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getDoctorId() != null) {
            derivacion.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        if (dto.getAlumnoId() != null) {
            derivacion.setAlumno(alumnoRepository.findById(dto.getAlumnoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + dto.getAlumnoId())));
        }
        derivacion.setAnamnesis(dto.getAnamnesis());
        derivacion.setSistema(dto.getSistema());
        derivacion.setIndicaciones(dto.getIndicaciones());
        return toDto(derivacionRepository.save(derivacion));
    }

    @Transactional
    public DerivacionDto update(Long id, DerivacionDto dto) {
        Derivacion derivacion = derivacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Derivacion not found: " + id));
        derivacion.setFecha(dto.getFecha());
        derivacion.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getDoctorId() != null) {
            derivacion.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        } else {
            derivacion.setDoctor(null);
        }
        if (dto.getAlumnoId() != null) {
            derivacion.setAlumno(alumnoRepository.findById(dto.getAlumnoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + dto.getAlumnoId())));
        } else {
            derivacion.setAlumno(null);
        }
        derivacion.setAnamnesis(dto.getAnamnesis());
        derivacion.setSistema(dto.getSistema());
        derivacion.setIndicaciones(dto.getIndicaciones());
        return toDto(derivacionRepository.save(derivacion));
    }

    @Transactional
    public void delete(Long id) {
        Derivacion derivacion = derivacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Derivacion not found: " + id));
        derivacionRepository.delete(derivacion);
    }

    private DerivacionDto toDto(Derivacion d) {
        DerivacionDto dto = new DerivacionDto();
        dto.setId(d.getId());
        dto.setFecha(d.getFecha());
        dto.setAnimalId(d.getAnimal().getId());
        dto.setAnimalNombre(d.getAnimal().getNombre());
        if (d.getDoctor() != null) {
            dto.setDoctorId(d.getDoctor().getId());
            dto.setDoctorNombreCompleto(d.getDoctor().getNombre() + " " + d.getDoctor().getApellido());
        }
        if (d.getAlumno() != null) {
            dto.setAlumnoId(d.getAlumno().getId());
            dto.setAlumnoNombreCompleto(d.getAlumno().getNombre() + " " + d.getAlumno().getApellido());
        }
        dto.setAnamnesis(d.getAnamnesis());
        dto.setSistema(d.getSistema());
        dto.setIndicaciones(d.getIndicaciones());
        return dto;
    }
}
