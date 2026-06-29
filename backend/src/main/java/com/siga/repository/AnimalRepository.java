package com.siga.repository;

import com.siga.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByDuenioId(Long duenioId);
    List<Animal> findByNombreContainingIgnoreCase(String nombre);
    List<Animal> findByNombre(String nombre);
}
