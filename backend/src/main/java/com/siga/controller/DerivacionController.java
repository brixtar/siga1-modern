package com.siga.controller;

import com.siga.dto.DerivacionDto;
import com.siga.service.DerivacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/derivaciones")
public class DerivacionController {

    @Autowired
    private DerivacionService derivacionService;

    @GetMapping
    public ResponseEntity<List<DerivacionDto>> getAll() {
        return ResponseEntity.ok(derivacionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DerivacionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(derivacionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DerivacionDto> create(@RequestBody DerivacionDto dto) {
        return ResponseEntity.ok(derivacionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DerivacionDto> update(@PathVariable Long id, @RequestBody DerivacionDto dto) {
        return ResponseEntity.ok(derivacionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        derivacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
