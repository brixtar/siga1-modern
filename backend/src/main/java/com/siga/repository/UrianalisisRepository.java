package com.siga.repository;

import com.siga.entity.Urianalisis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrianalisisRepository extends JpaRepository<Urianalisis, Long> {
    List<Urianalisis> findByAnimalId(Long animalId);
}
