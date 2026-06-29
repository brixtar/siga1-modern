package com.siga.controller;

import com.siga.dto.AnimalDto;
import com.siga.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/animales")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalDto>> getAll() {
        return ResponseEntity.ok(animalService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.findById(id));
    }

    @GetMapping("/duenio/{duenioId}")
    public ResponseEntity<List<AnimalDto>> getByDuenio(@PathVariable Long duenioId) {
        return ResponseEntity.ok(animalService.findByDuenioId(duenioId));
    }

    @PostMapping
    public ResponseEntity<AnimalDto> create(@RequestBody AnimalDto dto) {
        return ResponseEntity.ok(animalService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalDto> update(@PathVariable Long id, @RequestBody AnimalDto dto) {
        return ResponseEntity.ok(animalService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        animalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
