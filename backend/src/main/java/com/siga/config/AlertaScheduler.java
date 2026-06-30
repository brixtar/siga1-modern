package com.siga.config;

import com.siga.entity.VacunaAlerta;
import com.siga.repository.VacunaAlertaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
public class AlertaScheduler {

    @Autowired
    private VacunaAlertaRepository vacunaAlertaRepository;

    // Se ejecuta todos los días a las 00:00 (medianoche)
    @Scheduled(cron = "0 0 0 * * ?")
    public void procesarAlertasVacunas() {
        ejecutarSimuladorEnvio();
    }

    public int ejecutarSimuladorEnvio() {
        log.info("[AlertaScheduler] Iniciando escaneo diario de vacunas próximas a vencer...");
        // Alertas programadas para hoy, mañana o pasado mañana (próximos 3 días)
        LocalDate limite = LocalDate.now().plusDays(3);
        List<VacunaAlerta> alertas = vacunaAlertaRepository.findByFechaProximaLessThanEqualAndEstado(limite, "PENDIENTE");

        int correosEnviados = 0;
        for (VacunaAlerta alerta : alertas) {
            String duenioEmail = (alerta.getAnimal().getDuenio() != null) 
                    ? alerta.getAnimal().getDuenio().getEmail() 
                    : null;
            String duenioNombre = (alerta.getAnimal().getDuenio() != null)
                    ? alerta.getAnimal().getDuenio().getNombre() + " " + alerta.getAnimal().getDuenio().getApellido()
                    : "Propietario";

            if (duenioEmail != null && !duenioEmail.trim().isEmpty()) {
                log.info("==========================================================================");
                log.info("📧 [SIMULADOR DE EMAIL] Enviando correo de alerta de vacunación...");
                log.info("Para: {} <{}>", duenioNombre, duenioEmail);
                log.info("Asunto: Recordatorio de Vacunación para {}", alerta.getAnimal().getNombre());
                log.info("Mensaje: Estimado/a {}, le recordamos que la próxima fecha de aplicación " +
                        "para la vacuna '{}' de su mascota '{}' es el {}.",
                        duenioNombre, alerta.getNombreVacuna(), alerta.getAnimal().getNombre(), alerta.getFechaProxima());
                log.info("==========================================================================");

                alerta.setEstado("ENVIADO");
                vacunaAlertaRepository.save(alerta);
                correosEnviados++;
            }
        }
        log.info("[AlertaScheduler] Escaneo finalizado. Correos simulados enviados: {}", correosEnviados);
        return correosEnviados;
    }
}
