package com.furryfeast.dto.venta;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private String clienteNombre;
    private String clienteCedula;
    private List<ItemVentaDTO> items;
    private Double total;
}
