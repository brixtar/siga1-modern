package com.siga.repository;

import com.siga.entity.ConsultaMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaMedicamentoRepository extends JpaRepository<ConsultaMedicamento, Long> {
    List<ConsultaMedicamento> findByConsultaId(Long consultaId);
}
