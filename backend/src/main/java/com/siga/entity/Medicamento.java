package com.siga.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicamento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "cantidad_stock", nullable = false)
    private Integer cantidadStock = 0;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 5;

    @Column(name = "precio_unidad")
    private Double precioUnidad;

    @Column(name = "unidad_medida")
    private String unidadMedida;
}
