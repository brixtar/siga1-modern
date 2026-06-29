package com.siga.service;

import com.siga.dto.QuimicaClinicaDto;
import com.siga.entity.QuimicaClinica;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.QuimicaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuimicaClinicaService {

    @Autowired
    private QuimicaClinicaRepository quimicaClinicaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    public List<QuimicaClinicaDto> findAll() {
        return quimicaClinicaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public QuimicaClinicaDto findById(Long id) {
        QuimicaClinica q = quimicaClinicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QuimicaClinica not found: " + id));
        return toDto(q);
    }

    @Transactional
    public QuimicaClinicaDto create(QuimicaClinicaDto dto) {
        QuimicaClinica q = mapToEntity(dto, new QuimicaClinica());
        q.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        return toDto(quimicaClinicaRepository.save(q));
    }

    @Transactional
    public QuimicaClinicaDto update(Long id, QuimicaClinicaDto dto) {
        QuimicaClinica q = quimicaClinicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QuimicaClinica not found: " + id));
        mapToEntity(dto, q);
        return toDto(quimicaClinicaRepository.save(q));
    }

    @Transactional
    public void delete(Long id) {
        QuimicaClinica q = quimicaClinicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QuimicaClinica not found: " + id));
        quimicaClinicaRepository.delete(q);
    }

    private QuimicaClinica mapToEntity(QuimicaClinicaDto dto, QuimicaClinica q) {
        q.setProtocoloLab(dto.getProtocoloLab());
        q.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getConsultaId() != null) {
            q.setConsulta(consultaRepository.findById(dto.getConsultaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + dto.getConsultaId())));
        }
        if (dto.getDoctorId() != null) {
            q.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        q.setGlucemia(dto.getGlucemia());
        q.setUremia(dto.getUremia());
        q.setCreatininemia(dto.getCreatininemia());
        q.setFosfatemia(dto.getFosfatemia());
        q.setAlbuminemia(dto.getAlbuminemia());
        q.setGot(dto.getGot());
        q.setGpt(dto.getGpt());
        q.setCpk(dto.getCpk());
        q.setLdh(dto.getLdh());
        q.setObservaciones(dto.getObservaciones());
        return q;
    }

    private QuimicaClinicaDto toDto(QuimicaClinica q) {
        QuimicaClinicaDto dto = new QuimicaClinicaDto();
        dto.setId(q.getId());
        dto.setProtocoloLab(q.getProtocoloLab());
        dto.setFecha(q.getFecha());
        if (q.getConsulta() != null) dto.setConsultaId(q.getConsulta().getId());
        dto.setAnimalId(q.getAnimal().getId());
        dto.setAnimalNombre(q.getAnimal().getNombre());
        if (q.getDoctor() != null) {
            dto.setDoctorId(q.getDoctor().getId());
            dto.setDoctorNombreCompleto(q.getDoctor().getNombre() + " " + q.getDoctor().getApellido());
        }
        dto.setGlucemia(q.getGlucemia());
        dto.setUremia(q.getUremia());
        dto.setCreatininemia(q.getCreatininemia());
        dto.setFosfatemia(q.getFosfatemia());
        dto.setAlbuminemia(q.getAlbuminemia());
        dto.setGot(q.getGot());
        dto.setGpt(q.getGpt());
        dto.setCpk(q.getCpk());
        dto.setLdh(q.getLdh());
        dto.setObservaciones(q.getObservaciones());
        return dto;
    }
}
