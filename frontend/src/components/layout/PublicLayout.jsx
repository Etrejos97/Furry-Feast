import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PublicLayout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Public Navbar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#1e293b'
          }}>
            <span style={{
              fontSize: '1.8rem',
              background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>
              🐾 Furry Feast
            </span>
          </Link>

          {/* Navigation Options */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{
              fontWeight: 600,
              fontSize: '1rem',
              color: '#475569',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.target.style.color = '#4f46e5'}
            onMouseOut={e => e.target.style.color = '#475569'}
            >
              Catálogo
            </Link>

            {auth.isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {auth.user.role === 'ROLE_ADMIN' && (
                  <Link to="/admin/dashboard" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                    ⚙️ Panel Admin
                  </Link>
                )}
                
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                  Hola, <strong>{auth.user.nombre || auth.user.email}</strong>
                </span>

                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                🔑 Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        padding: '30px 24px',
        borderTop: '1px solid #334155',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontWeight: 600, color: '#f8fafc' }}>🐾 Furry Feast - Sistema de Gestión de Tienda de Mascotas</p>
          <p>Proyecto Académico MVP • React JS & Spring Boot</p>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>&copy; 2026 Furry Feast. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
