package com.siga.repository;

import com.siga.entity.Hemograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HemogramaRepository extends JpaRepository<Hemograma, Long> {
    List<Hemograma> findByAnimalId(Long animalId);
}
