package com.siga.controller;

import com.siga.dto.EspecieDto;
import com.siga.service.EspecieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/especies")
public class EspecieController {

    @Autowired
    private EspecieService especieService;

    @GetMapping
    public ResponseEntity<List<EspecieDto>> getAll() {
        return ResponseEntity.ok(especieService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspecieDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(especieService.findById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<EspecieDto> create(@RequestBody EspecieDto dto) {
        return ResponseEntity.ok(especieService.create(dto));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<EspecieDto> update(@PathVariable Long id, @RequestBody EspecieDto dto) {
        return ResponseEntity.ok(especieService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        especieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
