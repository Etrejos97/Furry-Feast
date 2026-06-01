package com.furryfeast.service;

import com.furryfeast.dto.producto.ProductoRequestDTO;
import com.furryfeast.dto.producto.ProductoResponseDTO;
import com.furryfeast.exception.BusinessException;
import com.furryfeast.model.Categoria;
import com.furryfeast.model.Producto;
import com.furryfeast.repository.ProductoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public Page<ProductoResponseDTO> getProducts(int page, int size, String search, String category, boolean showAll) {
        Pageable pageable = PageRequest.of(page, size);
        
        Categoria parsedCategory = null;
        if (category != null && !category.trim().isEmpty()) {
            try {
                parsedCategory = Categoria.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Categoría inválida: " + category);
            }
        }

        Page<Producto> products = productoRepository.searchProducts(search, parsedCategory, showAll, pageable);
        return products.map(this::mapToResponseDTO);
    }

    public List<ProductoResponseDTO> getLowStockAlerts() {
        return productoRepository.findLowStockAlerts().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ProductoResponseDTO getProductById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
        return mapToResponseDTO(producto);
    }

    @Transactional
    public ProductoResponseDTO createProduct(ProductoRequestDTO request) {
        if (productoRepository.existsByActivoTrueAndNombreIgnoreCase(request.getNombre())) {
            throw new BusinessException("Ya existe un producto activo con este nombre.");
        }

        Categoria parsedCategory;
        try {
            parsedCategory = Categoria.valueOf(request.getCategoria().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Categoría inválida: " + request.getCategoria());
        }

        Producto product = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .categoria(parsedCategory)
                .precio(request.getPrecio())
                .stockActual(request.getStockActual())
                .stockMinimo(request.getStockMinimo())
                .imagenUrl(request.getImagenUrl())
                .activo(true)
                .build();

        Producto saved = productoRepository.save(product);
        return mapToResponseDTO(saved);
    }

    @Transactional
    public ProductoResponseDTO updateProduct(Long id, ProductoRequestDTO request) {
        Producto existing = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        if (productoRepository.existsByActivoTrueAndNombreIgnoreCaseAndIdNot(request.getNombre(), id)) {
            throw new BusinessException("Ya existe otro producto activo con este nombre.");
        }

        Categoria parsedCategory;
        try {
            parsedCategory = Categoria.valueOf(request.getCategoria().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Categoría inválida: " + request.getCategoria());
        }

        existing.setNombre(request.getNombre());
        existing.setDescripcion(request.getDescripcion());
        existing.setCategoria(parsedCategory);
        existing.setPrecio(request.getPrecio());
        existing.setStockActual(request.getStockActual());
        existing.setStockMinimo(request.getStockMinimo());
        existing.setImagenUrl(request.getImagenUrl());

        Producto updated = productoRepository.save(existing);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void deactivateProduct(Long id) {
        Producto existing = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
        existing.setActivo(false);
        productoRepository.save(existing);
    }

    private ProductoResponseDTO mapToResponseDTO(Producto p) {
        return ProductoResponseDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .categoria(p.getCategoria().name())
                .precio(p.getPrecio())
                .stockActual(p.getStockActual())
                .stockMinimo(p.getStockMinimo())
                .activo(p.getActivo())
                .imagenUrl(p.getImagenUrl())
                .build();
    }
}
