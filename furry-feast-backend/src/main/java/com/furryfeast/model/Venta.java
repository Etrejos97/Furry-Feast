package com.furryfeast.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "cliente_nombre", nullable = false)
    private String clienteNombre;

    @Column(name = "cliente_cedula", nullable = false)
    private String clienteCedula;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItemVenta> items = new ArrayList<>();

    @Column(nullable = false)
    private Double total;

    // Helper method to link bidirectional relationship
    public void addItem(ItemVenta item) {
        items.add(item);
        item.setVenta(this);
    }
}
