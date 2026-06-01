import { delay } from './api';

export const authService = {
  /**
   * Autenticación de usuario.
   * COMENTARIO PARA INTEGRACIÓN FUTURA CON SPRING BOOT:
   * Reemplazar por:
   * return fetchWithAuth('/auth/login', {
   *   method: 'POST',
   *   body: JSON.stringify({ email, password })
   * });
   */
  login: async (email, password) => {
    await delay(500);

    const users = JSON.parse(localStorage.getItem('ff_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Credenciales incorrectas. Verifique su correo y contraseña.');
    }

    // Simulamos un JWT firmando de manera básica
    const mockToken = `mock-jwt-token-for-${user.email}-${user.role}`;
    
    return {
      token: mockToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        cedula: user.cedula
      }
    };
  }
};
