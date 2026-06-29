package com.siga.repository;

import com.siga.entity.QuimicaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuimicaClinicaRepository extends JpaRepository<QuimicaClinica, Long> {
    List<QuimicaClinica> findByAnimalId(Long animalId);
}
