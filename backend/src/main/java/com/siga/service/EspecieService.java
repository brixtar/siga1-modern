package com.siga.service;

import com.siga.dto.EspecieDto;
import com.siga.entity.Especie;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.EspecieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EspecieService {

    @Autowired
    private EspecieRepository especieRepository;

    public List<EspecieDto> findAll() {
        return especieRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public EspecieDto findById(Long id) {
        Especie especie = especieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + id));
        return toDto(especie);
    }

    @Transactional
    public EspecieDto create(EspecieDto dto) {
        Especie especie = new Especie();
        especie.setEspecie(dto.getEspecie());
        return toDto(especieRepository.save(especie));
    }

    @Transactional
    public EspecieDto update(Long id, EspecieDto dto) {
        Especie especie = especieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + id));
        especie.setEspecie(dto.getEspecie());
        return toDto(especieRepository.save(especie));
    }

    @Transactional
    public void delete(Long id) {
        Especie especie = especieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + id));
        especieRepository.delete(especie);
    }

    private EspecieDto toDto(Especie especie) {
        EspecieDto dto = new EspecieDto();
        dto.setId(especie.getId());
        dto.setEspecie(especie.getEspecie());
        return dto;
    }
}
