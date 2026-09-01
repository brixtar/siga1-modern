package com.siga.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {
            "/login",
            "/dashboard",
            "/animales",
            "/animales/**",
            "/duenios",
            "/duenios/**",
            "/turnos",
            "/turnos/**",
            "/consultas",
            "/consultas/**",
            "/farmacia",
            "/farmacia/**",
            "/examenes",
            "/examenes/**",
            "/usuarios",
            "/usuarios/**",
            "/auditoria",
            "/auditoria/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
