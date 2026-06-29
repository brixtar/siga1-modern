package com.siga.repository;

import com.siga.entity.Raza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RazaRepository extends JpaRepository<Raza, Long> {
    List<Raza> findByEspecieId(Long especieId);
    java.util.Optional<Raza> findByRazaAndEspecieId(String raza, Long especieId);
}
