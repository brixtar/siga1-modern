package com.siga.controller;

import com.siga.dto.AlumnoDto;
import com.siga.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<AlumnoDto>> getAll() {
        return ResponseEntity.ok(alumnoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(alumnoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AlumnoDto> create(@RequestBody AlumnoDto dto) {
        return ResponseEntity.ok(alumnoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDto> update(@PathVariable Long id, @RequestBody AlumnoDto dto) {
        return ResponseEntity.ok(alumnoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alumnoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
