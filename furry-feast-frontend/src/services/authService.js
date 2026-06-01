const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authService = {
  /**
   * Autentica al usuario en el backend de Spring Boot.
   * Guarda el token JWT y los datos del usuario en localStorage.
   */
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas.');
    }

    const data = await response.json();
    
    // Guardar tokens y perfil en localStorage
    localStorage.setItem('ff_token', data.token);
    localStorage.setItem('ff_user', JSON.stringify(data.user));

    return data;
  },

  /**
   * Remueve las credenciales locales de la sesión.
   */
  logout: () => {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
  },

  /**
   * Obtiene el perfil del usuario autenticado actualmente de forma síncrona.
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('ff_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};
