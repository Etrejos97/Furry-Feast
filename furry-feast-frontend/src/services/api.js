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
  /*
  // COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
  // Habilita este bloque eliminando el código mock de abajo cuando la API REST esté lista.
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response.json();
  */
  
  throw new Error('Modo Mock Activo. Petición HTTP simulada localmente.');
};

// Initializer to load mock data into localStorage for state persistence
import initialProducts from './mockData/products.json';
import initialUsers from './mockData/users.json';
import initialSales from './mockData/sales.json';

export const initializeMockDatabase = () => {
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
