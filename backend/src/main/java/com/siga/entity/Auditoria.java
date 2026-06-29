package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria", indexes = {
    @Index(name = "idx_auditoria_fecha", columnList = "fecha"),
    @Index(name = "idx_auditoria_username", columnList = "username")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "accion", nullable = false)
    private String accion;

    @Column(name = "tabla", nullable = false)
    private String tabla;

    @Column(name = "registro_id")
    private Long registroId;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;
}
