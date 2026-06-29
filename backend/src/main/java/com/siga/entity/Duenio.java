package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "duenio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Duenio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dni;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    private String email;
    private String facebook;
    private String domicilio;
    private String ciudad;

    @Column(name = "telefono_fijo")
    private String telefonoFijo;

    @Column(name = "telefono_celular")
    private String telefonoCelular;
}
