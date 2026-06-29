package com.siga.service;

import com.siga.dto.HemogramaDto;
import com.siga.entity.Hemograma;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.HemogramaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HemogramaService {

    @Autowired
    private HemogramaRepository hemogramaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    public List<HemogramaDto> findAll() {
        return hemogramaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public HemogramaDto findById(Long id) {
        Hemograma h = hemogramaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hemograma not found: " + id));
        return toDto(h);
    }

    @Transactional
    public HemogramaDto create(HemogramaDto dto) {
        Hemograma h = mapToEntity(dto, new Hemograma());
        h.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        return toDto(hemogramaRepository.save(h));
    }

    @Transactional
    public HemogramaDto update(Long id, HemogramaDto dto) {
        Hemograma h = hemogramaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hemograma not found: " + id));
        mapToEntity(dto, h);
        return toDto(hemogramaRepository.save(h));
    }

    @Transactional
    public void delete(Long id) {
        Hemograma h = hemogramaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hemograma not found: " + id));
        hemogramaRepository.delete(h);
    }

    private Hemograma mapToEntity(HemogramaDto dto, Hemograma h) {
        h.setProtocoloLab(dto.getProtocoloLab());
        h.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getConsultaId() != null) {
            h.setConsulta(consultaRepository.findById(dto.getConsultaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + dto.getConsultaId())));
        }
        if (dto.getDoctorId() != null) {
            h.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        h.setEritrocitos(dto.getEritrocitos());
        h.setHemoglobina(dto.getHemoglobina());
        h.setHematocrito(dto.getHematocrito());
        h.setVcm(dto.getVcm());
        h.setHcm(dto.getHcm());
        h.setChcm(dto.getChcm());
        h.setReticulocitos(dto.getReticulocitos());
        h.setIpr(dto.getIpr());
        h.setEritrNucleados(dto.getEritrNucleados());
        h.setPPlasmaticas(dto.getPPlasmaticas());
        h.setFibrinogeno(dto.getFibrinogeno());
        h.setRelPpFibr(dto.getRelPpFibr());
        h.setLeucocitos(dto.getLeucocitos());
        h.setMieloblastos(dto.getMieloblastos());
        h.setPromielocitos(dto.getPromielocitos());
        h.setMielocitos(dto.getMielocitos());
        h.setMetamielocitos(dto.getMetamielocitos());
        h.setNeutrofCay(dto.getNeutrofCay());
        h.setNeutrofSeg(dto.getNeutrofSeg());
        h.setEosinofilos(dto.getEosinofilos());
        h.setBasofilos(dto.getBasofilos());
        h.setLinfocitos(dto.getLinfocitos());
        h.setMonocitos(dto.getMonocitos());
        h.setObservaciones(dto.getObservaciones());
        return h;
    }

    private HemogramaDto toDto(Hemograma h) {
        HemogramaDto dto = new HemogramaDto();
        dto.setId(h.getId());
        dto.setProtocoloLab(h.getProtocoloLab());
        dto.setFecha(h.getFecha());
        if (h.getConsulta() != null) dto.setConsultaId(h.getConsulta().getId());
        dto.setAnimalId(h.getAnimal().getId());
        dto.setAnimalNombre(h.getAnimal().getNombre());
        if (h.getDoctor() != null) {
            dto.setDoctorId(h.getDoctor().getId());
            dto.setDoctorNombreCompleto(h.getDoctor().getNombre() + " " + h.getDoctor().getApellido());
        }
        dto.setEritrocitos(h.getEritrocitos());
        dto.setHemoglobina(h.getHemoglobina());
        dto.setHematocrito(h.getHematocrito());
        dto.setVcm(h.getVcm());
        dto.setHcm(h.getHcm());
        dto.setChcm(h.getChcm());
        dto.setReticulocitos(h.getReticulocitos());
        dto.setIpr(h.getIpr());
        dto.setEritrNucleados(h.getEritrNucleados());
        dto.setPPlasmaticas(h.getPPlasmaticas());
        dto.setFibrinogeno(h.getFibrinogeno());
        dto.setRelPpFibr(h.getRelPpFibr());
        dto.setLeucocitos(h.getLeucocitos());
        dto.setMieloblastos(h.getMieloblastos());
        dto.setPromielocitos(h.getPromielocitos());
        dto.setMielocitos(h.getMielocitos());
        dto.setMetamielocitos(h.getMetamielocitos());
        dto.setNeutrofCay(h.getNeutrofCay());
        dto.setNeutrofSeg(h.getNeutrofSeg());
        dto.setEosinofilos(h.getEosinofilos());
        dto.setBasofilos(h.getBasofilos());
        dto.setLinfocitos(h.getLinfocitos());
        dto.setMonocitos(h.getMonocitos());
        dto.setObservaciones(h.getObservaciones());
        return dto;
    }
}
