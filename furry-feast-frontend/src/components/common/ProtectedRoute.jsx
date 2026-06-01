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
    // Si no está autenticado, redirige a Login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    // Si no cuenta con el rol requerido, redirige a acceso denegado
    return <Navigate to="/denegado" replace />;
  }

  // Renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
