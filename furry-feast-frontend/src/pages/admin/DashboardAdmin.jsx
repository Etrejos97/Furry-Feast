import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';

export const DashboardAdmin = () => {
  const [alerts, setAlerts] = useState([]);
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    salesCount: 0,
    criticalCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Cargar alertas de bajo stock
        const lowStock = await productService.getLowStockAlerts();
        setAlerts(lowStock);

        // Cargar todos los productos para contar los activos
        const productsData = await productService.getProducts(0, 1000, '', '', true);
        const activeProducts = productsData.content.filter(p => p.activo).length;

        // Cargar ventas para los KPIs
        const sales = await salesService.getSales();
        
        // Productos críticamente agotados (stock === 0)
        const critical = productsData.content.filter(p => p.activo && p.stockActual === 0).length;

        setKpis({
          totalProducts: activeProducts,
          salesCount: sales.length,
          criticalCount: critical
        });
      } catch (error) {
        console.error('Error cargando métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Resumen Operativo</h1>
        <p style={{ color: '#64748b' }}>Monitoreo en tiempo real del inventario y alertas críticas.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#4f46e5' }}>
          Cargando datos del panel...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* SECCIÓN PRINCIPAL: Alertas de Stock Bajo */}
          <section className="card-glass" style={{
            borderLeft: '5px solid #f59e0b',
            backgroundColor: '#ffffff'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>⚠️</span>
                <div>
                  <h2 style={{ fontSize: '1.3rem', color: '#1e293b' }}>Alertas de Abastecimiento</h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Productos con inventario igual o inferior al mínimo configurado.</p>
                </div>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                {alerts.length} Por reabastecer
              </span>
            </div>

            {alerts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: '#10b981',
                fontWeight: 600
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🎉</span>
                Todos los productos tienen stock suficiente. No hay alertas vigentes.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {alerts.map(product => (
                  <div key={product.id} style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: product.stockActual === 0 ? '#fee2e2' : '#fef3c7',
                    border: `1.5px solid ${product.stockActual === 0 ? '#fca5a5' : '#fde68a'}`,
                    transition: 'transform 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.005)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 250px' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {product.stockActual === 0 ? '❌' : '⏳'}
                      </span>
                      <div>
                        <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>{product.nombre}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
                          Categoría: {product.categoria}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        Stock Actual: <strong style={{ color: product.stockActual === 0 ? '#ef4444' : '#d97706' }}>{product.stockActual} u.</strong>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        Stock Mínimo: <strong>{product.stockMinimo} u.</strong>
                      </div>
                      <div style={{
                        color: product.stockActual === 0 ? '#b91c1c' : '#b45309',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        backgroundColor: product.stockActual === 0 ? '#fecaca' : '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {product.stockActual === 0 ? 'Agotado Crítico' : 'Reabastecer con prioridad'}
                      </div>
                      <Link to={`/admin/productos/editar/${product.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
                        ✏️ Abastecer
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECCIÓN SECUNDARIA: KPIs de Control */}
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* KPI 1 */}
            <div className="card-glass" style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '2.2rem',
                backgroundColor: '#e0e7ff',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📦
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Catálogo Activo</span>
                <h3 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#1e293b' }}>{kpis.totalProducts}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Productos visibles al público</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="card-glass" style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '2.2rem',
                backgroundColor: '#fee2e2',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🚨
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Agotados Críticos</span>
                <h3 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#ef4444' }}>{kpis.criticalCount}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Productos con stock en cero</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="card-glass" style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '2.2rem',
                backgroundColor: '#d1fae5',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                💰
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Ventas Registradas</span>
                <h3 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#10b981' }}>{kpis.salesCount}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transacciones totales del MVP</span>
              </div>
            </div>
          </section>

          {/* Accesos rápidos */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/admin/ventas/nueva" className="btn btn-primary">
              🛒 Ir a la Terminal de Ventas
            </Link>
            <Link to="/admin/productos" className="btn btn-secondary">
              📦 Gestionar Inventario Completo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
