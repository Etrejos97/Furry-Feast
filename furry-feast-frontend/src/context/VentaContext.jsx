import React, { createContext, useState, useContext, useEffect } from 'react';

const VentaContext = createContext(null);

export const VentaProvider = ({ children }) => {
  const [cliente, setCliente] = useState({ nombre: '', cedula: '' });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Calcular total automáticamente cada vez que cambien los items
  useEffect(() => {
    const nuevoTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  }, [items]);

  const setDatosCliente = (nombre, cedula) => {
    setCliente({ nombre, cedula });
  };

  const agregarProducto = (producto, cantidad = 1) => {
    setItems(prevItems => {
      const index = prevItems.findIndex(item => item.productoId === producto.id);
      
      if (index > -1) {
        // El producto ya existe en la lista de venta, actualizamos su cantidad
        const nuevaCantidad = prevItems[index].cantidad + cantidad;
        
        // Validar stock disponible
        if (nuevaCantidad > producto.stockActual) {
          throw new Error(`No se puede agregar más. Stock disponible: ${producto.stockActual}`);
        }

        const updated = [...prevItems];
        updated[index] = {
          ...updated[index],
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * producto.precio
        };
        return updated;
      } else {
        // Es un producto nuevo en la lista
        if (cantidad > producto.stockActual) {
          throw new Error(`No hay suficiente stock. Stock disponible: ${producto.stockActual}`);
        }

        return [
          ...prevItems,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad: cantidad,
            stockDisponible: producto.stockActual,
            subtotal: cantidad * producto.precio
          }
        ];
      }
    });
  };

  const removerProducto = (productoId) => {
    setItems(prevItems => prevItems.filter(item => item.productoId !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removerProducto(productoId);
      return;
    }

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.productoId === productoId) {
          if (nuevaCantidad > item.stockDisponible) {
            throw new Error(`No se puede exceder el stock disponible (${item.stockDisponible})`);
          }
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precioUnitario
          };
        }
        return item;
      });
    });
  };

  const vaciarVenta = () => {
    setCliente({ nombre: '', cedula: '' });
    setItems([]);
    setTotal(0);
  };

  return (
    <VentaContext.Provider
      value={{
        cliente,
        items,
        total,
        setDatosCliente,
        agregarProducto,
        removerProducto,
        actualizarCantidad,
        vaciarVenta
      }}
    >
      {children}
    </VentaContext.Provider>
  );
};

export const useVenta = () => {
  const context = useContext(VentaContext);
  if (!context) {
    throw new Error('useVenta debe usarse dentro de un VentaProvider');
  }
  return context;
};
