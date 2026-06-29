package com.siga.controller;

import com.siga.dto.UrianalisisDto;
import com.siga.service.UrianalisisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/urianalisis")
public class UrianalisisController {

    @Autowired
    private UrianalisisService urianalisisService;

    @GetMapping
    public ResponseEntity<List<UrianalisisDto>> getAll() {
        return ResponseEntity.ok(urianalisisService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UrianalisisDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(urianalisisService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UrianalisisDto> create(@RequestBody UrianalisisDto dto) {
        return ResponseEntity.ok(urianalisisService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UrianalisisDto> update(@PathVariable Long id, @RequestBody UrianalisisDto dto) {
        return ResponseEntity.ok(urianalisisService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        urianalisisService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
