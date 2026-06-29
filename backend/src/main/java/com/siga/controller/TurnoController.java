package com.siga.controller;

import com.siga.dto.TurnoDto;
import com.siga.entity.Animal;
import com.siga.entity.Doctor;
import com.siga.entity.Turno;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.DoctorRepository;
import com.siga.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/turnos")
public class TurnoController {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<TurnoDto> getTurnos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) Long doctorId) {
        
        List<Turno> turnos;
        if (start != null && end != null) {
            if (doctorId != null) {
                turnos = turnoRepository.findByDoctorIdAndFechaHoraBetweenOrderByFechaHoraAsc(doctorId, start, end);
            } else {
                turnos = turnoRepository.findByFechaHoraBetweenOrderByFechaHoraAsc(start, end);
            }
        } else {
            turnos = turnoRepository.findAllByOrderByFechaHoraAsc();
        }
        
        return turnos.stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<TurnoDto> createTurno(@RequestBody TurnoDto dto) {
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado con id: " + dto.getAnimalId()));
        
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + dto.getDoctorId()));
        
        Turno turno = Turno.builder()
                .fechaHora(dto.getFechaHora())
                .motivo(dto.getMotivo())
                .estado(dto.getEstado() != null ? dto.getEstado() : "RESERVADO")
                .animal(animal)
                .doctor(doctor)
                .build();
        
        Turno saved = turnoRepository.save(turno);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<TurnoDto> updateEstado(@PathVariable Long id, @RequestParam String estado) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con id: " + id));
        
        turno.setEstado(estado.toUpperCase());
        Turno saved = turnoRepository.save(turno);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTurno(@PathVariable Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con id: " + id));
        
        turnoRepository.delete(turno);
        return ResponseEntity.noContent().build();
    }

    private TurnoDto toDto(Turno t) {
        TurnoDto dto = new TurnoDto();
        dto.setId(t.getId());
        dto.setFechaHora(t.getFechaHora());
        dto.setMotivo(t.getMotivo());
        dto.setEstado(t.getEstado());
        dto.setAnimalId(t.getAnimal().getId());
        dto.setAnimalNombre(t.getAnimal().getNombre());
        dto.setDoctorId(t.getDoctor().getId());
        dto.setDoctorNombre(t.getDoctor().getNombre() + " " + t.getDoctor().getApellido());
        return dto;
    }
}
