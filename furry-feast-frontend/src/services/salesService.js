import { fetchWithAuth } from './api';

export const salesService = {
  /**
   * Registra una venta en el backend de Spring Boot.
   * El servicio del backend valida el stock, lo descuenta y guarda la transacción de forma transaccional.
   */
  createSale: async (saleData) => {
    return fetchWithAuth('/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData)
    });
  },

  /**
   * Obtiene la lista histórica de ventas ordenadas por fecha descendente.
   */
  getSales: async () => {
    return fetchWithAuth('/ventas');
  }
};
