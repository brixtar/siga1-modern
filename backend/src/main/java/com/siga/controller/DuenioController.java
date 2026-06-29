package com.siga.controller;

import com.siga.dto.DuenioDto;
import com.siga.service.DuenioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/duenios")
public class DuenioController {

    @Autowired
    private DuenioService duenioService;

    @GetMapping
    public ResponseEntity<List<DuenioDto>> getAll() {
        return ResponseEntity.ok(duenioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DuenioDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(duenioService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DuenioDto> create(@RequestBody DuenioDto dto) {
        return ResponseEntity.ok(duenioService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DuenioDto> update(@PathVariable Long id, @RequestBody DuenioDto dto) {
        return ResponseEntity.ok(duenioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        duenioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
