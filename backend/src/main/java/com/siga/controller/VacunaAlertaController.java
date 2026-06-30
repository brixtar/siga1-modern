package com.siga.controller;

import com.siga.dto.VacunaAlertaDto;
import com.siga.entity.VacunaAlerta;
import com.siga.service.VacunaAlertaService;
import com.siga.config.AlertaScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class VacunaAlertaController {

    @Autowired
    private VacunaAlertaService vacunaAlertaService;

    @Autowired
    private AlertaScheduler alertaScheduler;

    @GetMapping("/animales/{animalId}/vacunas")
    public ResponseEntity<List<VacunaAlertaDto>> getVacunasByAnimal(@PathVariable Long animalId) {
        List<VacunaAlertaDto> list = vacunaAlertaService.findByAnimalId(animalId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/animales/{animalId}/vacunas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<VacunaAlertaDto> addVacuna(@PathVariable Long animalId, @RequestBody VacunaAlertaDto dto) {
        VacunaAlerta saved = vacunaAlertaService.create(
                animalId, 
                dto.getNombreVacuna(), 
                dto.getFechaAplicacion(), 
                dto.getFechaProxima()
        );
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/vacunas/{id}/completar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<VacunaAlertaDto> completeVacuna(@PathVariable Long id) {
        VacunaAlerta updated = vacunaAlertaService.complete(id);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/vacunas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteVacuna(@PathVariable Long id) {
        vacunaAlertaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vacunas/alertas/proximas")
    public ResponseEntity<List<VacunaAlertaDto>> getProximasAlertas() {
        // Obtenemos alertas pendientes para los próximos 30 días
        LocalDate limite = LocalDate.now().plusDays(30);
        List<VacunaAlertaDto> list = vacunaAlertaService.findPendingAlerts(limite).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/vacunas/alertas/procesar-manual")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<String> procesarAlertasManual() {
        int enviados = alertaScheduler.ejecutarSimuladorEnvio();
        return ResponseEntity.ok("Procesamiento de alertas completado. Correos enviados: " + enviados);
    }

    private VacunaAlertaDto toDto(VacunaAlerta entity) {
        VacunaAlertaDto dto = new VacunaAlertaDto();
        dto.setId(entity.getId());
        dto.setAnimalId(entity.getAnimal().getId());
        dto.setAnimalNombre(entity.getAnimal().getNombre());
        
        if (entity.getAnimal().getDuenio() != null) {
            dto.setDuenioNombre(entity.getAnimal().getDuenio().getNombre() + " " + entity.getAnimal().getDuenio().getApellido());
            dto.setDuenioEmail(entity.getAnimal().getDuenio().getEmail());
        }
        
        dto.setNombreVacuna(entity.getNombreVacuna());
        dto.setFechaAplicacion(entity.getFechaAplicacion());
        dto.setFechaProxima(entity.getFechaProxima());
        dto.setEstado(entity.getEstado());
        return dto;
    }
}
