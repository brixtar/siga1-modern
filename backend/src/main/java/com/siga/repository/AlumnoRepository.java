package com.siga.repository;

import com.siga.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    Optional<Alumno> findByUserId(Long userId);
    Optional<Alumno> findByDni(String dni);
}
