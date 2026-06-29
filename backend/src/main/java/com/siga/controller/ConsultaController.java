package com.siga.controller;

import com.siga.dto.ConsultaDto;
import com.siga.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    public ResponseEntity<List<ConsultaDto>> getAll() {
        return ResponseEntity.ok(consultaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.findById(id));
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<ConsultaDto>> getByAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(consultaService.findByAnimalId(animalId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<ConsultaDto>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(consultaService.findByDoctorId(doctorId));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<ConsultaDto>> getByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(consultaService.findByFechaRange(start, end));
    }

    @PostMapping
    public ResponseEntity<ConsultaDto> create(@RequestBody ConsultaDto dto) {
        return ResponseEntity.ok(consultaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaDto> update(@PathVariable Long id, @RequestBody ConsultaDto dto) {
        return ResponseEntity.ok(consultaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        consultaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
