import React, { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services/productService';

export const CatalogoClientes = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(page, 12, search, category, false);
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Restablecer página a cero ante un nuevo filtro
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };

  const getStockBadge = (stockActual, stockMinimo) => {
    if (stockActual === 0) {
      return <span className="badge badge-danger">Agotado</span>;
    } else if (stockActual <= stockMinimo) {
      return <span className="badge badge-warning">Bajo Stock</span>;
    } else {
      return <span className="badge badge-success">Disponible</span>;
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
      {/* Banner / Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
        borderRadius: '16px',
        padding: '40px 30px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
      }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#ffffff' }}>Encuentra el alimento ideal para tu mascota 🐾</h1>
        <p style={{ fontSize: '1.05rem', color: '#c7d2fe', fontWeight: 500 }}>
          Explora la variedad de alimentos premium, accesorios de alta calidad, medicamentos y productos de cuidado para consentir a tus mejores amigos.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <div className="card-glass" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔎 Buscar productos por nombre..."
            value={search}
            onChange={handleSearchChange}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Categoría:</label>
          <select
            className="form-input"
            value={category}
            onChange={handleCategoryChange}
            style={{ width: '200px', padding: '10px 14px' }}
          >
            <option value="">Todas las categorías</option>
            <option value="ALIMENTOS">Alimentos 🍖</option>
            <option value="MEDICAMENTOS">Medicamentos 💊</option>
            <option value="ACCESORIOS">Accesorios 🐕</option>
            <option value="CUIDADO">Cuidado Higiene 🧼</option>
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: '#4f46e5' }}>
          Cargando catálogo de productos...
        </div>
      ) : products.length === 0 ? (
        <div className="card-glass" style={{ textAlign: 'center', padding: '60px 24px', color: '#64748b' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🔍</span>
          <h3>No se encontraron productos</h3>
          <p style={{ marginTop: '8px' }}>Intenta ajustando los términos de búsqueda o filtros aplicados.</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {products.map(product => (
              <div
                key={product.id}
                className="card-glass"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  backgroundColor: '#ffffff'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  {/* Category & Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#4f46e5',
                      backgroundColor: '#e0e7ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {product.categoria}
                    </span>
                    {getStockBadge(product.stockActual, product.stockMinimo)}
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#1e293b' }}>
                    {product.nombre}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    marginBottom: '20px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.descripcion}
                  </p>
                </div>

                {/* Price and Stock */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Precio</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>{formatPrice(product.precio)}</span>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Stock: <strong>{product.stockActual} u.</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
              >
                ◀ Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(i)}
                  style={{ minWidth: '35px' }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={page === totalPages - 1}
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogoClientes;
