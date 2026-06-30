package com.siga.service;

import com.siga.entity.Animal;
import com.siga.entity.VacunaAlerta;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.VacunaAlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class VacunaAlertaService {

    @Autowired
    private VacunaAlertaRepository vacunaAlertaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    public List<VacunaAlerta> findByAnimalId(Long animalId) {
        return vacunaAlertaRepository.findByAnimalIdOrderByFechaProximaAsc(animalId);
    }

    public List<VacunaAlerta> findPendingAlerts(LocalDate limitDate) {
        return vacunaAlertaRepository.findByFechaProximaLessThanEqualAndEstado(limitDate, "PENDIENTE");
    }

    @Transactional
    public VacunaAlerta create(Long animalId, String nombreVacuna, LocalDate fechaAplicacion, LocalDate fechaProxima) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));

        VacunaAlerta alerta = VacunaAlerta.builder()
                .animal(animal)
                .nombreVacuna(nombreVacuna)
                .fechaAplicacion(fechaAplicacion)
                .fechaProxima(fechaProxima)
                .estado("PENDIENTE")
                .build();

        return vacunaAlertaRepository.save(alerta);
    }

    @Transactional
    public VacunaAlerta complete(Long id) {
        VacunaAlerta alerta = vacunaAlertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta de vacuna no encontrada: " + id));
        alerta.setEstado("COMPLETADA");
        return vacunaAlertaRepository.save(alerta);
    }

    @Transactional
    public void delete(Long id) {
        VacunaAlerta alerta = vacunaAlertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta de vacuna no encontrada: " + id));
        vacunaAlertaRepository.delete(alerta);
    }
}
