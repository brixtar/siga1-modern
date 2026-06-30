package com.siga.repository;

import com.siga.entity.PesoRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PesoRegistroRepository extends JpaRepository<PesoRegistro, Long> {
    List<PesoRegistro> findByAnimalIdOrderByFechaAsc(Long animalId);
}
