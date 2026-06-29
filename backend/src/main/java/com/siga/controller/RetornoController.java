package com.siga.controller;

import com.siga.dto.RetornoDto;
import com.siga.service.RetornoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/retornos")
public class RetornoController {

    @Autowired
    private RetornoService retornoService;

    @GetMapping
    public ResponseEntity<List<RetornoDto>> getAll() {
        return ResponseEntity.ok(retornoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetornoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(retornoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RetornoDto> create(@RequestBody RetornoDto dto) {
        return ResponseEntity.ok(retornoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RetornoDto> update(@PathVariable Long id, @RequestBody RetornoDto dto) {
        return ResponseEntity.ok(retornoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        retornoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
