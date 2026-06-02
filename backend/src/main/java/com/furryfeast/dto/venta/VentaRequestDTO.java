package com.furryfeast.dto.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaRequestDTO {

    @NotNull(message = "El nombre del cliente es obligatorio")
    private String clienteNombre;

    @NotNull(message = "La cédula del cliente es obligatoria")
    private String clienteCedula;

    @NotEmpty(message = "La venta debe contener al menos un producto")
    @Valid
    private List<ItemVentaDTO> items;

    @NotNull(message = "El total es obligatorio")
    private Double total;
}
