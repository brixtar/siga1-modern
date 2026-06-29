package com.siga.repository;

import com.siga.entity.Derivacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DerivacionRepository extends JpaRepository<Derivacion, Long> {
    List<Derivacion> findByAnimalId(Long animalId);
}
