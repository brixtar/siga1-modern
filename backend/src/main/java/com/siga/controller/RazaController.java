package com.siga.controller;

import com.siga.dto.RazaDto;
import com.siga.service.RazaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/razas")
public class RazaController {

    @Autowired
    private RazaService razaService;

    @GetMapping
    public ResponseEntity<List<RazaDto>> getAll() {
        return ResponseEntity.ok(razaService.findAll());
    }

    @GetMapping("/especie/{especieId}")
    public ResponseEntity<List<RazaDto>> getByEspecieId(@PathVariable Long especieId) {
        return ResponseEntity.ok(razaService.findByEspecieId(especieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RazaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(razaService.findById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<RazaDto> create(@RequestBody RazaDto dto) {
        return ResponseEntity.ok(razaService.create(dto));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<RazaDto> update(@PathVariable Long id, @RequestBody RazaDto dto) {
        return ResponseEntity.ok(razaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        razaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
