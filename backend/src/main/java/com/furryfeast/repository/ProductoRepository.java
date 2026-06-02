package com.furryfeast.repository;

import com.furryfeast.model.Producto;
import com.furryfeast.model.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    @Query("SELECT p FROM Producto p WHERE " +
           "(:showAll = true OR p.activo = true) AND " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Producto> searchProducts(
            @Param("search") String search,
            @Param("categoria") Categoria categoria,
            @Param("showAll") boolean showAll,
            Pageable pageable
    );

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stockActual <= p.stockMinimo")
    List<Producto> findLowStockAlerts();

    boolean existsByActivoTrueAndNombreIgnoreCase(String nombre);
    
    boolean existsByActivoTrueAndNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
