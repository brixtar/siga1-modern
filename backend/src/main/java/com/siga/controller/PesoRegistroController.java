package com.siga.controller;

import com.siga.dto.PesoRegistroDto;
import com.siga.entity.PesoRegistro;
import com.siga.service.PesoRegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class PesoRegistroController {

    @Autowired
    private PesoRegistroService pesoRegistroService;

    @GetMapping("/animales/{animalId}/pesos")
    public ResponseEntity<List<PesoRegistroDto>> getPesosByAnimal(@PathVariable Long animalId) {
        List<PesoRegistroDto> list = pesoRegistroService.findByAnimalId(animalId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/animales/{animalId}/pesos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PesoRegistroDto> addPeso(@PathVariable Long animalId, @RequestBody PesoRegistroDto dto) {
        PesoRegistro saved = pesoRegistroService.create(animalId, dto.getPeso(), dto.getFecha());
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/pesos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deletePeso(@PathVariable Long id) {
        pesoRegistroService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private PesoRegistroDto toDto(PesoRegistro entity) {
        PesoRegistroDto dto = new PesoRegistroDto();
        dto.setId(entity.getId());
        dto.setAnimalId(entity.getAnimal().getId());
        dto.setFecha(entity.getFecha());
        dto.setPeso(entity.getPeso());
        return dto;
    }
}
