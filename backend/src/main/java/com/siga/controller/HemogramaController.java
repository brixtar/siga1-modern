package com.siga.controller;

import com.siga.dto.HemogramaDto;
import com.siga.service.HemogramaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hemogramas")
public class HemogramaController {

    @Autowired
    private HemogramaService hemogramaService;

    @GetMapping
    public ResponseEntity<List<HemogramaDto>> getAll() {
        return ResponseEntity.ok(hemogramaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HemogramaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hemogramaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<HemogramaDto> create(@RequestBody HemogramaDto dto) {
        return ResponseEntity.ok(hemogramaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HemogramaDto> update(@PathVariable Long id, @RequestBody HemogramaDto dto) {
        return ResponseEntity.ok(hemogramaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hemogramaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
