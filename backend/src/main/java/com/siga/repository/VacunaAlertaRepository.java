package com.siga.repository;

import com.siga.entity.VacunaAlerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VacunaAlertaRepository extends JpaRepository<VacunaAlerta, Long> {
    List<VacunaAlerta> findByAnimalIdOrderByFechaProximaAsc(Long animalId);
    List<VacunaAlerta> findByFechaProximaLessThanEqualAndEstado(LocalDate fechaLimit, String estado);
}
