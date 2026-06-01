import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #334155',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>🐾 Furry Feast</span>
          </Link>
          <span style={{
            display: 'inline-block',
            marginTop: '5px',
            fontSize: '0.75rem',
            padding: '2px 8px',
            backgroundColor: '#4f46e5',
            borderRadius: '4px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            Administrador
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/admin/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: isActive('/admin/dashboard') ? '#ffffff' : '#94a3b8',
            backgroundColor: isActive('/admin/dashboard') ? '#4f46e5' : 'transparent',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}>
            📊 Dashboard
          </Link>

          <Link to="/admin/productos" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: isActive('/admin/productos') || location.pathname.startsWith('/admin/productos/') ? '#ffffff' : '#94a3b8',
            backgroundColor: isActive('/admin/productos') || location.pathname.startsWith('/admin/productos/') ? '#4f46e5' : 'transparent',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}>
            📦 Inventario
          </Link>

          <Link to="/admin/ventas/nueva" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: isActive('/admin/ventas/nueva') ? '#ffffff' : '#94a3b8',
            backgroundColor: isActive('/admin/ventas/nueva') ? '#4f46e5' : 'transparent',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}>
            🛒 Nueva Venta
          </Link>

          <hr style={{ border: '0', borderTop: '1px solid #334155', margin: '15px 0' }} />

          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#94a3b8',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.target.style.color = '#ffffff'}
          onMouseOut={e => e.target.style.color = '#94a3b8'}
          >
            🏠 Ver Tienda Pública
          </Link>
        </nav>

        {/* Sidebar Footer / User actions */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
              {auth.user?.nombre || 'Administrador'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {auth.user?.email}
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{
            backgroundColor: '#334155',
            color: '#ffffff',
            border: 'none',
            justifyContent: 'center',
            padding: '8px'
          }}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Topbar */}
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <h2 style={{ fontSize: '1.4rem', color: '#1e293b' }}>
            {isActive('/admin/dashboard') && 'Dashboard de Control'}
            {isActive('/admin/productos') && 'Gestión de Catálogo e Inventario'}
            {location.pathname === '/admin/productos/nuevo' && 'Nuevo Producto'}
            {location.pathname.startsWith('/admin/productos/editar') && 'Editar Producto'}
            {isActive('/admin/ventas/nueva') && 'Terminal de Registro de Ventas'}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Sesión activa: <span style={{ fontWeight: 600, color: '#10b981' }}>Estable ✔</span>
            </span>
          </div>
        </header>

        {/* Dynamic Admin Body Content */}
        <main style={{ padding: '32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
