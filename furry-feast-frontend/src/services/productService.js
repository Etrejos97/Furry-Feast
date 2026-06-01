import { delay } from './api';

export const productService = {
  /**
   * Obtiene la lista de productos paginada y filtrada.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth(`/productos?page=${page}&size=${size}&search=${search}&category=${category}&showAll=${showAll}`);
   */
  getProducts: async (page = 0, size = 12, search = '', category = '', showAll = false) => {
    await delay(300);

    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    
    // Filtrar por estado activo
    let filtered = products;
    if (!showAll) {
      filtered = filtered.filter(p => p.activo);
    }

    // Filtrar por categoría
    if (category) {
      filtered = filtered.filter(p => p.categoria === category);
    }

    // Filtrar por búsqueda de nombre
    if (search) {
      filtered = filtered.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
    }

    // Paginación lógica
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    return {
      content,
      totalPages: Math.ceil(filtered.length / size),
      totalElements: filtered.length,
      size,
      number: page
    };
  },

  /**
   * Obtiene un producto específico por ID.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth(`/productos/${id}`);
   */
  getProductById: async (id) => {
    await delay(200);
    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  /**
   * Registra un nuevo producto.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth('/productos', {
   *   method: 'POST',
   *   body: JSON.stringify(productData)
   * });
   */
  createProduct: async (productData) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');

    // Validar nombre único entre productos activos
    const nameExists = products.some(
      p => p.activo && p.nombre.toLowerCase().trim() === productData.nombre.toLowerCase().trim()
    );

    if (nameExists) {
      throw new Error('Ya existe un producto activo con este nombre.');
    }

    const newProduct = {
      ...productData,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      activo: true
    };

    products.push(newProduct);
    localStorage.setItem('ff_products', JSON.stringify(products));
    return newProduct;
  },

  /**
   * Actualiza un producto existente.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth(`/productos/${id}`, {
   *   method: 'PUT',
   *   body: JSON.stringify(productData)
   * });
   */
  updateProduct: async (id, productData) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Producto no encontrado para actualizar.');
    }

    // Validar nombre único entre otros productos activos
    const nameExists = products.some(
      p => p.id !== parseInt(id) && p.activo && p.nombre.toLowerCase().trim() === productData.nombre.toLowerCase().trim()
    );

    if (nameExists) {
      throw new Error('Ya existe otro producto activo con este nombre.');
    }

    products[index] = {
      ...products[index],
      ...productData
    };

    localStorage.setItem('ff_products', JSON.stringify(products));
    return products[index];
  },

  /**
   * Desactiva lógicamente un producto (activo = false).
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth(`/productos/${id}/desactivar`, { method: 'PATCH' });
   */
  deactivateProduct: async (id) => {
    await delay(200);
    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Producto no encontrado para desactivar.');
    }

    products[index].activo = false;
    localStorage.setItem('ff_products', JSON.stringify(products));
    return products[index];
  },

  /**
   * Obtiene la lista de alertas de stock bajo.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth('/productos/alertas');
   */
  getLowStockAlerts: async () => {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('ff_products') || '[]');
    // Un producto entra en alerta si es activo y stockActual <= stockMinimo
    return products.filter(p => p.activo && p.stockActual <= p.stockMinimo);
  }
};
