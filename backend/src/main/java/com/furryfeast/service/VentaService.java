package com.furryfeast.service;

import com.furryfeast.dto.venta.ItemVentaDTO;
import com.furryfeast.dto.venta.VentaRequestDTO;
import com.furryfeast.dto.venta.VentaResponseDTO;
import com.furryfeast.exception.BusinessException;
import com.furryfeast.model.ItemVenta;
import com.furryfeast.model.Producto;
import com.furryfeast.model.Venta;
import com.furryfeast.repository.ProductoRepository;
import com.furryfeast.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    public List<VentaResponseDTO> getAllSales() {
        return ventaRepository.findAllByOrderByFechaDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VentaResponseDTO createSale(VentaRequestDTO request) {
        Venta venta = Venta.builder()
                .fecha(LocalDateTime.now()) // Fecha asignada automáticamente por el backend
                .clienteNombre(request.getClienteNombre())
                .clienteCedula(request.getClienteCedula())
                .total(request.getTotal())
                .build();

        for (ItemVentaDTO itemDTO : request.getItems()) {
            Producto producto = productoRepository.findById(itemDTO.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("El producto con ID " + itemDTO.getProductoId() + " no existe."));

            // 1. Validar que esté activo
            if (!producto.getActivo()) {
                throw new BusinessException("El producto '" + producto.getNombre() + "' no está activo.");
            }

            // 2. Validar que stockActual >= cantidad solicitada
            if (producto.getStockActual() < itemDTO.getCantidad()) {
                throw new BusinessException("Stock insuficiente para '" + producto.getNombre() + 
                        "'. Disponible: " + producto.getStockActual() + 
                        ", Solicitado: " + itemDTO.getCantidad());
            }

            // 3. Descontar stock de cada producto
            producto.setStockActual(producto.getStockActual() - itemDTO.getCantidad());
            productoRepository.save(producto);

            // 4. Crear ItemVenta vinculando precio histórico y nombre al momento de la venta
            ItemVenta itemVenta = ItemVenta.builder()
                    .productoId(producto.getId())
                    .nombre(producto.getNombre())
                    .precioUnitario(producto.getPrecio()) // Snapshot inmutable del precio actual
                    .cantidad(itemDTO.getCantidad())
                    .subtotal(producto.getPrecio() * itemDTO.getCantidad())
                    .build();

            venta.addItem(itemVenta);
        }

        Venta saved = ventaRepository.save(venta);
        return mapToResponseDTO(saved);
    }

    private VentaResponseDTO mapToResponseDTO(Venta v) {
        return VentaResponseDTO.builder()
                .id(v.getId())
                .fecha(v.getFecha())
                .clienteNombre(v.getClienteNombre())
                .clienteCedula(v.getClienteCedula())
                .total(v.getTotal())
                .items(v.getItems().stream()
                        .map(item -> ItemVentaDTO.builder()
                                .productoId(item.getProductoId())
                                .nombre(item.getNombre())
                                .precioUnitario(item.getPrecioUnitario())
                                .cantidad(item.getCantidad())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
