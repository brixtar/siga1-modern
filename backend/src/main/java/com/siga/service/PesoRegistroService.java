package com.siga.service;

import com.siga.entity.Animal;
import com.siga.entity.PesoRegistro;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.PesoRegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PesoRegistroService {

    @Autowired
    private PesoRegistroRepository pesoRegistroRepository;

    @Autowired
    private AnimalRepository animalRepository;

    public List<PesoRegistro> findByAnimalId(Long animalId) {
        return pesoRegistroRepository.findByAnimalIdOrderByFechaAsc(animalId);
    }

    @Transactional
    public PesoRegistro create(Long animalId, Double peso, LocalDate fecha) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));

        PesoRegistro registro = PesoRegistro.builder()
                .animal(animal)
                .peso(peso)
                .fecha(fecha)
                .build();

        PesoRegistro saved = pesoRegistroRepository.save(registro);

        // Actualizar el peso estático en la ficha del animal
        updateLatestAnimalWeight(animal);

        return saved;
    }

    @Transactional
    public void delete(Long id) {
        PesoRegistro registro = pesoRegistroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de peso no encontrado: " + id));
        Animal animal = registro.getAnimal();
        pesoRegistroRepository.delete(registro);

        // Volver a calcular y actualizar el peso del animal
        updateLatestAnimalWeight(animal);
    }

    private void updateLatestAnimalWeight(Animal animal) {
        List<PesoRegistro> registros = pesoRegistroRepository.findByAnimalIdOrderByFechaAsc(animal.getId());
        if (!registros.isEmpty()) {
            Double ultimoPeso = registros.get(registros.size() - 1).getPeso();
            animal.setPeso(ultimoPeso);
            animalRepository.save(animal);
        }
    }
}
