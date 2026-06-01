package com.furryfeast.controller;

import com.furryfeast.dto.producto.ProductoRequestDTO;
import com.furryfeast.dto.producto.ProductoResponseDTO;
import com.furryfeast.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductoResponseDTO>> getProducts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size,
            @RequestParam(name = "search", defaultValue = "") String search,
            @RequestParam(name = "category", defaultValue = "") String category,
            @RequestParam(name = "showAll", defaultValue = "false") boolean showAll
    ) {
        Page<ProductoResponseDTO> products = productoService.getProducts(page, size, search, category, showAll);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/alertas")
    public ResponseEntity<List<ProductoResponseDTO>> getLowStockAlerts() {
        List<ProductoResponseDTO> alerts = productoService.getLowStockAlerts();
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> getProductById(@PathVariable("id") Long id) {
        ProductoResponseDTO product = productoService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDTO> createProduct(@Valid @RequestBody ProductoRequestDTO request) {
        ProductoResponseDTO created = productoService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> updateProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductoRequestDTO request
    ) {
        ProductoResponseDTO updated = productoService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Map<String, String>> deactivateProduct(@PathVariable("id") Long id) {
        productoService.deactivateProduct(id);
        return ResponseEntity.ok(Map.of("message", "Producto desactivado correctamente"));
    }
}
