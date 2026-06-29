package com.siga.repository;

import com.siga.entity.Especie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EspecieRepository extends JpaRepository<Especie, Long> {
    Optional<Especie> findByEspecie(String especie);
}
