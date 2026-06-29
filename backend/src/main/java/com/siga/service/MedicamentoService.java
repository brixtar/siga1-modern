package com.siga.service;

import com.siga.dto.MedicamentoDto;
import com.siga.entity.Medicamento;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    public List<MedicamentoDto> findAll() {
        return medicamentoRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MedicamentoDto findById(Long id) {
        Medicamento m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento not found with id: " + id));
        return toDto(m);
    }

    public List<MedicamentoDto> findLowStock() {
        // Query to get medicines with stock <= minStock
        return medicamentoRepository.findAll().stream()
                .filter(m -> m.getCantidadStock() <= m.getStockMinimo())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicamentoDto create(MedicamentoDto dto) {
        Medicamento m = Medicamento.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .cantidadStock(dto.getCantidadStock() != null ? dto.getCantidadStock() : 0)
                .stockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5)
                .precioUnidad(dto.getPrecioUnidad())
                .unidadMedida(dto.getUnidadMedida())
                .build();
        return toDto(medicamentoRepository.save(m));
    }

    @Transactional
    public MedicamentoDto update(Long id, MedicamentoDto dto) {
        Medicamento m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento not found with id: " + id));
        m.setNombre(dto.getNombre());
        m.setDescripcion(dto.getDescripcion());
        if (dto.getCantidadStock() != null) {
            m.setCantidadStock(dto.getCantidadStock());
        }
        if (dto.getStockMinimo() != null) {
            m.setStockMinimo(dto.getStockMinimo());
        }
        m.setPrecioUnidad(dto.getPrecioUnidad());
        m.setUnidadMedida(dto.getUnidadMedida());
        return toDto(medicamentoRepository.save(m));
    }

    @Transactional
    public void delete(Long id) {
        Medicamento m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento not found with id: " + id));
        medicamentoRepository.delete(m);
    }

    public MedicamentoDto toDto(Medicamento m) {
        MedicamentoDto dto = new MedicamentoDto();
        dto.setId(m.getId());
        dto.setNombre(m.getNombre());
        dto.setDescripcion(m.getDescripcion());
        dto.setCantidadStock(m.getCantidadStock());
        dto.setStockMinimo(m.getStockMinimo());
        dto.setPrecioUnidad(m.getPrecioUnidad());
        dto.setUnidadMedida(m.getUnidadMedida());
        return dto;
    }
}
