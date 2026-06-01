package com.furryfeast.controller;

import com.furryfeast.dto.venta.VentaRequestDTO;
import com.furryfeast.dto.venta.VentaResponseDTO;
import com.furryfeast.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> getAllSales() {
        List<VentaResponseDTO> sales = ventaService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @PostMapping
    public ResponseEntity<VentaResponseDTO> createSale(@Valid @RequestBody VentaRequestDTO request) {
        VentaResponseDTO created = ventaService.createSale(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
