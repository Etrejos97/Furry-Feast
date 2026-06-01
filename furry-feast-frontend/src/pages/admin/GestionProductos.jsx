import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';

export const GestionProductos = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Cargamos todos los productos (showAll = true) para administración
      const data = await productService.getProducts(0, 1000, search, '', true);
      setProducts(data.content);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDeactivate = async (id, nombre) => {
    const confirm = window.confirm(`¿Está seguro de que desea desactivar el producto "${nombre}"?\nEsta acción lo ocultará del catálogo público para clientes.`);
    if (confirm) {
      try {
        await productService.deactivateProduct(id);
        loadProducts(); // Recargar listado
      } catch (error) {
        alert(error.message || 'Error al desactivar el producto.');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Control Panel Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>CRUD de catálogo para control de productos e inventarios.</p>
        </div>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          ➕ Registrar Nuevo Producto
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar productos por nombre en el inventario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Tabular Data View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#4f46e5' }}>
          Cargando inventario de productos...
        </div>
      ) : products.length === 0 ? (
        <div className="card-glass" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b', backgroundColor: '#ffffff' }}>
          No se encontraron productos registrados en el catálogo.
        </div>
      ) : (
        <div className="card-glass" style={{ padding: '0', overflowX: 'auto', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.92rem'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                color: '#475569',
                fontWeight: 700
              }}>
                <th style={{ padding: '16px 20px' }}>Nombre del Producto</th>
                <th style={{ padding: '16px 20px' }}>Categoría</th>
                <th style={{ padding: '16px 20px' }}>Precio</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Stock Actual</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Stock Mínimo</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const isLowStock = product.stockActual <= product.stockMinimo;
                const isOutOfStock = product.stockActual === 0;

                return (
                  <tr key={product.id} style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.2s',
                    backgroundColor: !product.activo ? '#f8fafc' : 'transparent'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = !product.activo ? '#f8fafc' : 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: product.activo ? '#1e293b' : '#94a3b8' }}>
                      {product.nombre}
                    </td>
                    <td style={{ padding: '16px 20px', color: product.activo ? '#475569' : '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>
                      {product.categoria}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: product.activo ? '#1e293b' : '#94a3b8' }}>
                      {formatPrice(product.precio)}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: !product.activo ? '#94a3b8' : isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981'
                    }}>
                      {product.stockActual} u.
                      {product.activo && isLowStock && (
                        <span style={{ fontSize: '11px', display: 'block', fontWeight: 500 }}>
                          {isOutOfStock ? '⚠️ Agotado' : '⏳ Bajo Stock'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: product.activo ? '#475569' : '#94a3b8' }}>
                      {product.stockMinimo} u.
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {product.activo ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Activo</span>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Inactivo</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        >
                          ✏️ Editar
                        </button>
                        
                        {product.activo ? (
                          <button
                            onClick={() => handleDeactivate(product.id, product.nombre)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          >
                            🚫 Desactivar
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: 0.5, cursor: 'not-allowed' }}
                            disabled
                          >
                            Desactivado
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
