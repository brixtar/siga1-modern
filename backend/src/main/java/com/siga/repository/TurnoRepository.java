package com.siga.repository;

import com.siga.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByFechaHoraBetweenOrderByFechaHoraAsc(LocalDateTime start, LocalDateTime end);
    List<Turno> findByDoctorIdAndFechaHoraBetweenOrderByFechaHoraAsc(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Turno> findAllByOrderByFechaHoraAsc();
}
