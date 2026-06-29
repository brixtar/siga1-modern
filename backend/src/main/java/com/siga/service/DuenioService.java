package com.siga.service;

import com.siga.dto.DuenioDto;
import com.siga.entity.Duenio;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.DuenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DuenioService {

    @Autowired
    private DuenioRepository duenioRepository;

    public List<DuenioDto> findAll() {
        return duenioRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public DuenioDto findById(Long id) {
        Duenio duenio = duenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Duenio not found: " + id));
        return toDto(duenio);
    }

    @Transactional
    public DuenioDto create(DuenioDto dto) {
        Duenio duenio = new Duenio();
        duenio.setDni(dto.getDni());
        duenio.setNombre(dto.getNombre());
        duenio.setApellido(dto.getApellido());
        duenio.setEmail(dto.getEmail());
        duenio.setFacebook(dto.getFacebook());
        duenio.setDomicilio(dto.getDomicilio());
        duenio.setCiudad(dto.getCiudad());
        duenio.setTelefonoFijo(dto.getTelefonoFijo());
        duenio.setTelefonoCelular(dto.getTelefonoCelular());
        return toDto(duenioRepository.save(duenio));
    }

    @Transactional
    public DuenioDto update(Long id, DuenioDto dto) {
        Duenio duenio = duenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Duenio not found: " + id));
        duenio.setDni(dto.getDni());
        duenio.setNombre(dto.getNombre());
        duenio.setApellido(dto.getApellido());
        duenio.setEmail(dto.getEmail());
        duenio.setFacebook(dto.getFacebook());
        duenio.setDomicilio(dto.getDomicilio());
        duenio.setCiudad(dto.getCiudad());
        duenio.setTelefonoFijo(dto.getTelefonoFijo());
        duenio.setTelefonoCelular(dto.getTelefonoCelular());
        return toDto(duenioRepository.save(duenio));
    }

    @Transactional
    public void delete(Long id) {
        Duenio duenio = duenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Duenio not found: " + id));
        duenioRepository.delete(duenio);
    }

    private DuenioDto toDto(Duenio duenio) {
        DuenioDto dto = new DuenioDto();
        dto.setId(duenio.getId());
        dto.setDni(duenio.getDni());
        dto.setNombre(duenio.getNombre());
        dto.setApellido(duenio.getApellido());
        dto.setEmail(duenio.getEmail());
        dto.setFacebook(duenio.getFacebook());
        dto.setDomicilio(duenio.getDomicilio());
        dto.setCiudad(duenio.getCiudad());
        dto.setTelefonoFijo(duenio.getTelefonoFijo());
        dto.setTelefonoCelular(duenio.getTelefonoCelular());
        return dto;
    }
}
