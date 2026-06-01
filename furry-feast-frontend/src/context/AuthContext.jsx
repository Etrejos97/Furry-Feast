import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_token');
    const userStr = localStorage.getItem('ff_user');

    if (token && userStr) {
      try {
        setAuth({
          isAuthenticated: true,
          token,
          user: JSON.parse(userStr)
        });
      } catch (e) {
        localStorage.removeItem('ff_token');
        localStorage.removeItem('ff_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAuth({
      isAuthenticated: true,
      token: data.token,
      user: data.user
    });
    return data.user;
  };

  const logout = () => {
    authService.logout();
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};