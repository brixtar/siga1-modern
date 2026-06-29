package com.siga.repository;

import com.siga.entity.Duenio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DuenioRepository extends JpaRepository<Duenio, Long> {
    List<Duenio> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);
    java.util.Optional<Duenio> findByDni(String dni);
}
