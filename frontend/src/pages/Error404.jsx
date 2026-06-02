import React from 'react';
import { Link } from 'react-router-dom';

export const Error404 = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      fontFamily: 'Outfit, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div className="card-glass" style={{ maxWidth: '500px', padding: '40px' }}>
        <span style={{ fontSize: '5rem', display: 'block', marginBottom: '15px' }}>🐾❓</span>
        <h1 style={{ fontSize: '2.5rem', color: '#4f46e5', marginBottom: '10px' }}>404</h1>
        <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Página no encontrada</h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.5' }}>
          El enlace que has seguido puede estar roto o la página puede haber sido eliminada de Furry Feast.
        </p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          🏠 Volver a la Tienda
        </Link>
      </div>
    </div>
  );
};

export default Error404;
