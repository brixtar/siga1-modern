package com.siga.service;

import com.siga.dto.UrianalisisDto;
import com.siga.entity.Urianalisis;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.UrianalisisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UrianalisisService {

    @Autowired
    private UrianalisisRepository urianalisisRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    public List<UrianalisisDto> findAll() {
        return urianalisisRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public UrianalisisDto findById(Long id) {
        Urianalisis u = urianalisisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Urianalisis not found: " + id));
        return toDto(u);
    }

    @Transactional
    public UrianalisisDto create(UrianalisisDto dto) {
        Urianalisis u = mapToEntity(dto, new Urianalisis());
        u.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now());
        return toDto(urianalisisRepository.save(u));
    }

    @Transactional
    public UrianalisisDto update(Long id, UrianalisisDto dto) {
        Urianalisis u = urianalisisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Urianalisis not found: " + id));
        mapToEntity(dto, u);
        return toDto(urianalisisRepository.save(u));
    }

    @Transactional
    public void delete(Long id) {
        Urianalisis u = urianalisisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Urianalisis not found: " + id));
        urianalisisRepository.delete(u);
    }

    private Urianalisis mapToEntity(UrianalisisDto dto, Urianalisis u) {
        u.setProtocoloLab(dto.getProtocoloLab());
        u.setAnimal(animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + dto.getAnimalId())));
        if (dto.getConsultaId() != null) {
            u.setConsulta(consultaRepository.findById(dto.getConsultaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + dto.getConsultaId())));
        }
        if (dto.getDoctorId() != null) {
            u.setDoctor(doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + dto.getDoctorId())));
        }
        u.setColor(dto.getColor());
        u.setAspecto(dto.getAspecto());
        u.setDensidad(dto.getDensidad());
        u.setPh(dto.getPh());
        u.setProteina(dto.getProteina());
        u.setUrobilinogeno(dto.getUrobilinogeno());
        u.setGlucosa(dto.getGlucosa());
        u.setCCetonicos(dto.getCCetonicos());
        u.setLeucocitos(dto.getLeucocitos());
        u.setNitritos(dto.getNitritos());
        u.setSangreOculta(dto.getSangreOculta());
        u.setPigBiliares(dto.getPigBiliares());
        u.setObservaciones(dto.getObservaciones());
        u.setCelulasSanguineas(dto.getCelulasSanguineas());
        u.setCelulasSanguineas2(dto.getCelulasSanguineas2());
        u.setCelulasEpiteliales(dto.getCelulasEpiteliales());
        u.setCelulasEpiteliales2(dto.getCelulasEpiteliales2());
        u.setCilindros(dto.getCilindros());
        u.setCilindros2(dto.getCilindros2());
        u.setCristales(dto.getCristales());
        u.setCristales2(dto.getCristales2());
        u.setOtra(dto.getOtra());
        u.setOtra2(dto.getOtra2());
        u.setObservaciones2(dto.getObservaciones2());
        return u;
    }

    private UrianalisisDto toDto(Urianalisis u) {
        UrianalisisDto dto = new UrianalisisDto();
        dto.setId(u.getId());
        dto.setProtocoloLab(u.getProtocoloLab());
        dto.setFecha(u.getFecha());
        if (u.getConsulta() != null) dto.setConsultaId(u.getConsulta().getId());
        dto.setAnimalId(u.getAnimal().getId());
        dto.setAnimalNombre(u.getAnimal().getNombre());
        if (u.getDoctor() != null) {
            dto.setDoctorId(u.getDoctor().getId());
            dto.setDoctorNombreCompleto(u.getDoctor().getNombre() + " " + u.getDoctor().getApellido());
        }
        dto.setColor(u.getColor());
        dto.setAspecto(u.getAspecto());
        dto.setDensidad(u.getDensidad());
        dto.setPh(u.getPh());
        dto.setProteina(u.getProteina());
        dto.setUrobilinogeno(u.getUrobilinogeno());
        dto.setGlucosa(u.getGlucosa());
        dto.setCCetonicos(u.getCCetonicos());
        dto.setLeucocitos(u.getLeucocitos());
        dto.setNitritos(u.getNitritos());
        dto.setSangreOculta(u.getSangreOculta());
        dto.setPigBiliares(u.getPigBiliares());
        dto.setObservaciones(u.getObservaciones());
        dto.setCelulasSanguineas(u.getCelulasSanguineas());
        dto.setCelulasSanguineas2(u.getCelulasSanguineas2());
        dto.setCelulasEpiteliales(u.getCelulasEpiteliales());
        dto.setCelulasEpiteliales2(u.getCelulasEpiteliales2());
        dto.setCilindros(u.getCilindros());
        dto.setCilindros2(u.getCilindros2());
        dto.setCristales(u.getCristales());
        dto.setCristales2(u.getCristales2());
        dto.setOtra(u.getOtra());
        dto.setOtra2(u.getOtra2());
        dto.setObservaciones2(u.getObservaciones2());
        return dto;
    }
}
