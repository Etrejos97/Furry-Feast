// Client configuration and API helpers.
// Currently serves as a bridge for localStorage mocking to ensure session persistence.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to simulate delay
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to fetch with JWT authentication header.
 * Under production/integration, this will contact the Spring Boot REST API.
 * Currently, it throws errors if endpoints are not integrated.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  throw new Error('Modo Mock Activo. Petición HTTP simulada localmente.');
};

// Initializer to load mock data into localStorage for state persistence
import initialProducts from './mockData/products.json';
import initialUsers from './mockData/users.json';
import initialSales from './mockData/sales.json';

export const initializeMockDatabase = () => {
  // Comprobar si la base de datos de productos en localStorage es vieja y carece del campo imagenUrl
  const existingProducts = localStorage.getItem('ff_products');
  if (existingProducts) {
    try {
      const parsed = JSON.parse(existingProducts);
      // Forzar reset si la base de datos vieja no tiene la clave 'imagenUrl'
      if (parsed.length > 0 && !('imagenUrl' in parsed[0])) {
        localStorage.removeItem('ff_products');
      }
    } catch (e) {
      localStorage.removeItem('ff_products');
    }
  }

  if (!localStorage.getItem('ff_products')) {
    localStorage.setItem('ff_products', JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem('ff_users')) {
    localStorage.setItem('ff_users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('ff_sales')) {
    localStorage.setItem('ff_sales', JSON.stringify(initialSales));
  }
};

// Run initialization immediately
initializeMockDatabase();
