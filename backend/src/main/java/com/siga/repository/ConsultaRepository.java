package com.siga.repository;

import com.siga.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByAnimalId(Long animalId);
    List<Consulta> findByDoctorId(Long doctorId);
    List<Consulta> findByFechaBetween(LocalDateTime start, LocalDateTime end);
}
