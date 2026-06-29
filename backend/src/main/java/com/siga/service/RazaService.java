package com.siga.service;

import com.siga.dto.RazaDto;
import com.siga.entity.Raza;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.EspecieRepository;
import com.siga.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RazaService {

    @Autowired
    private RazaRepository razaRepository;

    @Autowired
    private EspecieRepository especieRepository;

    public List<RazaDto> findAll() {
        return razaRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RazaDto> findByEspecieId(Long especieId) {
        return razaRepository.findByEspecieId(especieId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public RazaDto findById(Long id) {
        Raza raza = razaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Raza not found: " + id));
        return toDto(raza);
    }

    @Transactional
    public RazaDto create(RazaDto dto) {
        Raza raza = new Raza();
        raza.setEspecie(especieRepository.findById(dto.getEspecieId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + dto.getEspecieId())));
        raza.setRaza(dto.getRaza());
        return toDto(razaRepository.save(raza));
    }

    @Transactional
    public RazaDto update(Long id, RazaDto dto) {
        Raza raza = razaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Raza not found: " + id));
        raza.setEspecie(especieRepository.findById(dto.getEspecieId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + dto.getEspecieId())));
        raza.setRaza(dto.getRaza());
        return toDto(razaRepository.save(raza));
    }

    @Transactional
    public void delete(Long id) {
        Raza raza = razaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Raza not found: " + id));
        razaRepository.delete(raza);
    }

    private RazaDto toDto(Raza raza) {
        RazaDto dto = new RazaDto();
        dto.setId(raza.getId());
        dto.setEspecieId(raza.getEspecie().getId());
        dto.setEspecieNombre(raza.getEspecie().getEspecie());
        dto.setRaza(raza.getRaza());
        return dto;
    }
}
