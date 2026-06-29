package com.siga.service;

import com.siga.dto.AnimalDto;
import com.siga.entity.Animal;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AnimalRepository;
import com.siga.repository.DuenioRepository;
import com.siga.repository.EspecieRepository;
import com.siga.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private DuenioRepository duenioRepository;

    @Autowired
    private EspecieRepository especieRepository;

    @Autowired
    private RazaRepository razaRepository;

    public List<AnimalDto> findAll() {
        return animalRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public AnimalDto findById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + id));
        return toDto(animal);
    }

    public List<AnimalDto> findByDuenioId(Long duenioId) {
        return animalRepository.findByDuenioId(duenioId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public AnimalDto create(AnimalDto dto) {
        Animal animal = new Animal();
        animal.setNombre(dto.getNombre());
        animal.setTipo(dto.getTipo());
        animal.setEspecie(especieRepository.findById(dto.getEspecieId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + dto.getEspecieId())));
        animal.setRaza(razaRepository.findById(dto.getRazaId())
                .orElseThrow(() -> new ResourceNotFoundException("Raza not found: " + dto.getRazaId())));
        animal.setPeso(dto.getPeso());
        animal.setNacimiento(dto.getNacimiento());
        animal.setSexo(dto.getSexo());
        animal.setColor(dto.getColor());
        animal.setDuenio(duenioRepository.findById(dto.getDuenioId())
                .orElseThrow(() -> new ResourceNotFoundException("Duenio not found: " + dto.getDuenioId())));
        animal.setVivo(dto.getVivo() != null ? dto.getVivo() : true);
        return toDto(animalRepository.save(animal));
    }

    @Transactional
    public AnimalDto update(Long id, AnimalDto dto) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + id));
        animal.setNombre(dto.getNombre());
        animal.setTipo(dto.getTipo());
        animal.setEspecie(especieRepository.findById(dto.getEspecieId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie not found: " + dto.getEspecieId())));
        animal.setRaza(razaRepository.findById(dto.getRazaId())
                .orElseThrow(() -> new ResourceNotFoundException("Raza not found: " + dto.getRazaId())));
        animal.setPeso(dto.getPeso());
        animal.setNacimiento(dto.getNacimiento());
        animal.setSexo(dto.getSexo());
        animal.setColor(dto.getColor());
        animal.setDuenio(duenioRepository.findById(dto.getDuenioId())
                .orElseThrow(() -> new ResourceNotFoundException("Duenio not found: " + dto.getDuenioId())));
        animal.setVivo(dto.getVivo());
        return toDto(animalRepository.save(animal));
    }

    @Transactional
    public void delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + id));
        animalRepository.delete(animal);
    }

    private AnimalDto toDto(Animal animal) {
        AnimalDto dto = new AnimalDto();
        dto.setId(animal.getId());
        dto.setNombre(animal.getNombre());
        dto.setTipo(animal.getTipo());
        dto.setEspecieId(animal.getEspecie().getId());
        dto.setEspecieNombre(animal.getEspecie().getEspecie());
        dto.setRazaId(animal.getRaza().getId());
        dto.setRazaNombre(animal.getRaza().getRaza());
        dto.setPeso(animal.getPeso());
        dto.setNacimiento(animal.getNacimiento());
        dto.setSexo(animal.getSexo());
        dto.setColor(animal.getColor());
        dto.setDuenioId(animal.getDuenio().getId());
        dto.setDuenioNombreCompleto(animal.getDuenio().getNombre() + " " + animal.getDuenio().getApellido());
        dto.setVivo(animal.getVivo());
        return dto;
    }
}
