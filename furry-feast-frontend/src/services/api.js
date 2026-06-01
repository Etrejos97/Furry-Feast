const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Realiza peticiones HTTP autenticadas agregando el token JWT.
 * Si recibe un error 401 (No Autorizado), invalida la sesión local y recarga la página.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ff_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Si no está autorizado (401), invalidar sesión y forzar recarga
  if (response.status === 401) {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    window.location.reload();
    throw new Error('Sesión expirada. Por favor inicie sesión de nuevo.');
  }

  // Si la respuesta no es exitosa, procesar el error JSON enviado por el backend
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Ocurrió un error en el servidor.');
  }

  // Devolver el JSON parseado
  return response.json();
};
