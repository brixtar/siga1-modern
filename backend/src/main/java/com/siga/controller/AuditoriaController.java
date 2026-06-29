package com.siga.controller;

import com.siga.entity.Auditoria;
import com.siga.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auditorias")
@PreAuthorize("hasRole('ADMIN') or (hasRole('DOCTOR') and principal.puedeVerAuditoria)")
public class AuditoriaController {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @GetMapping
    public List<Auditoria> getAuditorias() {
        return auditoriaRepository.findAllByOrderByFechaDesc();
    }
}
