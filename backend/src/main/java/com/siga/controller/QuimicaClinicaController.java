package com.siga.controller;

import com.siga.dto.QuimicaClinicaDto;
import com.siga.service.QuimicaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quimica-clinica")
public class QuimicaClinicaController {

    @Autowired
    private QuimicaClinicaService quimicaClinicaService;

    @GetMapping
    public ResponseEntity<List<QuimicaClinicaDto>> getAll() {
        return ResponseEntity.ok(quimicaClinicaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuimicaClinicaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(quimicaClinicaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<QuimicaClinicaDto> create(@RequestBody QuimicaClinicaDto dto) {
        return ResponseEntity.ok(quimicaClinicaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuimicaClinicaDto> update(@PathVariable Long id, @RequestBody QuimicaClinicaDto dto) {
        return ResponseEntity.ok(quimicaClinicaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quimicaClinicaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
