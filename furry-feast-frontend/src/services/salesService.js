import { delay } from './api';

export const salesService = {
  /**
   * Registra una venta, descuenta stock y guarda el registro.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth('/ventas', {
   *   method: 'POST',
   *   body: JSON.stringify(saleData)
   * });
   */
  createSale: async (saleData) => {
    await delay(500);

    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    const sales = JSON.parse(localStorage.getItem('ff_sales') || '[]');

    // Validar stock antes de realizar descuento
    for (const item of saleData.items) {
      const product = products.find(p => p.id === item.productoId);
      if (!product) {
        throw new Error(`El producto "${item.nombre}" no existe en el catálogo.`);
      }
      if (!product.activo) {
        throw new Error(`El producto "${item.nombre}" no está activo.`);
      }
      if (product.stockActual < item.cantidad) {
        throw new Error(`Stock insuficiente para "${product.nombre}". Disponible: ${product.stockActual}, Solicitado: ${item.cantidad}`);
      }
    }

    // Descontar stock
    for (const item of saleData.items) {
      const productIndex = products.findIndex(p => p.id === item.productoId);
      products[productIndex].stockActual -= item.cantidad;
    }

    // Registrar la venta
    const newSale = {
      id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
      fecha: new Date().toISOString(),
      clienteNombre: saleData.clienteNombre,
      clienteCedula: saleData.clienteCedula,
      items: saleData.items,
      total: saleData.total
    };

    sales.push(newSale);
    
    // Guardar cambios persistentes
    localStorage.setItem('ff_products', JSON.stringify(products));
    localStorage.setItem('ff_sales', JSON.stringify(sales));

    return newSale;
  },

  /**
   * Obtiene la lista histórica de ventas.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth('/ventas');
   */
  getSales: async () => {
    await delay(300);
    return JSON.parse(localStorage.getItem('ff_sales') || '[]');
  }
};
