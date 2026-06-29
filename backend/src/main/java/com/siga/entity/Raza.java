package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lista_raza")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Raza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "especie_id", nullable = false)
    private Especie especie;

    @Column(nullable = false)
    private String raza;
}
