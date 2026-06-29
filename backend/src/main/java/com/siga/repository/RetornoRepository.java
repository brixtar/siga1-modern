package com.siga.repository;

import com.siga.entity.Retorno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetornoRepository extends JpaRepository<Retorno, Long> {
    List<Retorno> findByConsultaId(Long consultaId);
}
