import { fetchWithAuth } from './api';

export const productService = {
  /**
   * Obtiene la lista de productos paginada y filtrada desde la API real de Spring Boot.
   */
  getProducts: async (page = 0, size = 12, search = '', category = '', showAll = false) => {
    const searchParam = encodeURIComponent(search);
    const categoryParam = encodeURIComponent(category);
    
    return fetchWithAuth(
      `/productos?page=${page}&size=${size}&search=${searchParam}&category=${categoryParam}&showAll=${showAll}`
    );
  },

  /**
   * Obtiene un producto específico por ID.
   */
  getProductById: async (id) => {
    return fetchWithAuth(`/productos/${id}`);
  },

  /**
   * Registra un nuevo producto en la base de datos H2.
   * El backend valida que el nombre sea único entre los productos activos.
   */
  createProduct: async (productData) => {
    return fetchWithAuth('/productos', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  /**
   * Actualiza un producto existente en la base de datos H2.
   */
  updateProduct: async (id, productData) => {
    return fetchWithAuth(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  /**
   * Desactiva lógicamente un producto (activo = false).
   */
  deactivateProduct: async (id) => {
    return fetchWithAuth(`/productos/${id}/desactivar`, {
      method: 'PATCH'
    });
  },

  /**
   * Obtiene la lista de alertas de stock bajo (stockActual <= stockMinimo).
   */
  getLowStockAlerts: async () => {
    return fetchWithAuth('/productos/alertas');
  }
};
