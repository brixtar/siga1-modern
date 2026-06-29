package com.siga.controller;

import com.siga.dto.MedicamentoDto;
import com.siga.service.MedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medicamentos")
public class MedicamentoController {

    @Autowired
    private MedicamentoService medicamentoService;

    @GetMapping
    public ResponseEntity<List<MedicamentoDto>> getAll() {
        return ResponseEntity.ok(medicamentoService.findAll());
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<MedicamentoDto>> getLowStock() {
        return ResponseEntity.ok(medicamentoService.findLowStock());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicamentoDto> create(@RequestBody MedicamentoDto dto) {
        return ResponseEntity.ok(medicamentoService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicamentoDto> update(@PathVariable Long id, @RequestBody MedicamentoDto dto) {
        return ResponseEntity.ok(medicamentoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
