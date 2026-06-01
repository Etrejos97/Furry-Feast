import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1.2rem',
        color: '#4F46E5'
      }}>
        Cargando sesión de Furry Feast...
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    // Soporta role como string ("ROLE_ADMIN") o como array (["ROLE_ADMIN"])
    const userRoles = Array.isArray(auth.user?.roles)
      ? auth.user.roles
      : [auth.user?.role];

    const hasRole = allowedRoles.some(r => userRoles.includes(r));

    if (!hasRole) {
      return <Navigate to="/denegado" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;