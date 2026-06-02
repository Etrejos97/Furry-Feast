import React from 'react';
import { Link } from 'react-router-dom';

export const Forbidden = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
        <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '15px' }}>🚫</span>
        <h1 style={{ color: '#ef4444', marginBottom: '10px' }}>Acceso Denegado</h1>
        <h4 style={{ color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Error 403 - No Autorizado</h4>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.5' }}>
          Lo sentimos, tu usuario no cuenta con los permisos y privilegios requeridos para acceder a la administración del sistema.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            🏠 Volver a la Tienda
          </Link>
          <Link to="/login" className="btn btn-secondary">
            🔑 Iniciar con otra cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
