import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      padding: '20px'
    }}>
      <div className="card-glass" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px' }}>Bienvenido</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ingresa tus credenciales para acceder a Furry Feast</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 500
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            disabled={submitting}
          >
            {submitting ? 'Verificando...' : 'Iniciar Sesión 🔐'}
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
          <p style={{ fontWeight: 600, marginBottom: '6px' }}>Credenciales de prueba:</p>
          <p>• Admin: <code>admin@furryfeast.com</code> / <code>admin123Password</code></p>
          <p>• Cliente: <code>cliente@correo.com</code> / <code>cliente123Password</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
