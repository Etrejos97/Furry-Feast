package com.furryfeast.dto.producto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private Double precio;
    private Integer stockActual;
    private Integer stockMinimo;
    private Boolean activo;
    private String imagenUrl;
}
