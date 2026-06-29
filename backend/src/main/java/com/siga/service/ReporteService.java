package com.siga.service;

import com.siga.dto.EstadisticaDto;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.DerivacionRepository;
import com.siga.repository.RetornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private DerivacionRepository derivacionRepository;

    @Autowired
    private RetornoRepository retornoRepository;

    public List<EstadisticaDto> estadisticas(LocalDateTime start, LocalDateTime end) {
        // Simplified aggregation: count all consultas in range
        long consultas = consultaRepository.findByFechaBetween(start, end).size();
        long derivaciones = derivacionRepository.findAll().stream()
                .filter(d -> d.getFecha() != null && !d.getFecha().isBefore(start) && !d.getFecha().isAfter(end)).count();
        long retornos = retornoRepository.findAll().stream()
                .filter(r -> r.getFecha() != null && !r.getFecha().isBefore(start) && !r.getFecha().isAfter(end)).count();

        EstadisticaDto dto = new EstadisticaDto();
        dto.setCantidadConsultas(consultas);
        dto.setCantidadDerivaciones(derivaciones);
        dto.setCantidadRetornos(retornos);
        List<EstadisticaDto> list = new ArrayList<>();
        list.add(dto);
        return list;
    }
}
