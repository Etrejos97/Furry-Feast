package com.furryfeast.dto.producto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoRequestDTO {

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    private String descripcion;

    @NotBlank(message = "La categoría del producto es obligatoria")
    private String categoria; // Se convertirá a Categoria enum en el Service

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser un número mayor a 0")
    private Double precio;

    @NotNull(message = "El stock inicial es obligatorio")
    @Min(value = 0, message = "El stock actual debe ser mayor o igual a 0")
    private Integer stockActual;

    @NotNull(message = "El stock mínimo es obligatorio")
    @Min(value = 1, message = "El stock mínimo debe ser al menos 1")
    private Integer stockMinimo;

    @Size(max = 2048, message = "La URL de la imagen no puede superar los 2048 caracteres")
    private String imagenUrl;
}
