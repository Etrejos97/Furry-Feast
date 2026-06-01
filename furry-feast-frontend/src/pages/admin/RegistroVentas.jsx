import React, { useState, useEffect } from 'react';
import { useVenta } from '../../context/VentaContext';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';

export const RegistroVentas = () => {
  const {
    cliente,
    items,
    total,
    setDatosCliente,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    vaciarVenta
  } = useVenta();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar productos activos con stock para la venta
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts(0, 1000, '', '', false);
        setAvailableProducts(data.content);
      } catch (err) {
        console.error('Error cargando catálogo para venta:', err);
      }
    };
    loadProducts();
  }, [successMsg]); // Recargar productos cuando se complete una venta

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente(
      name === 'nombre' ? value : cliente.nombre,
      name === 'cedula' ? value : cliente.cedula
    );
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAddProduct = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedProductId) {
      setErrorMsg('Seleccione un producto de la lista.');
      return;
    }

    const product = availableProducts.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    try {
      agregarProducto(product, parseInt(selectedQuantity));
      setSelectedProductId('');
      setSelectedQuantity(1);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleQtyChange = (productoId, qtyStr) => {
    setErrorMsg('');
    setSuccessMsg('');
    const qty = parseInt(qtyStr) || 0;
    
    try {
      actualizarCantidad(productoId, qty);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCompleteSale = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (items.length === 0) {
      setErrorMsg('Debe agregar al menos un producto a la venta.');
      return;
    }

    if (!cliente.nombre.trim() || !cliente.cedula.trim()) {
      setErrorMsg('Debe completar los datos del cliente (Nombre y Cédula).');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        clienteNombre: cliente.nombre.trim(),
        clienteCedula: cliente.cedula.trim(),
        items: items.map(item => ({
          productoId: item.productoId,
          nombre: item.nombre,
          precioUnitario: item.precioUnitario,
          cantidad: item.cantidad,
          subtotal: item.subtotal
        })),
        total: total
      };

      await salesService.createSale(saleData);
      setSuccessMsg(`¡Venta registrada con éxito por valor de ${formatPrice(total)}! El inventario ha sido descontado.`);
      vaciarVenta();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la transacción de venta.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Filtrar productos del select según buscador superior
  const filteredSelectProducts = availableProducts.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
      
      {/* Columna Izquierda: Configuración de la Venta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Datos del Cliente */}
        <section className="card-glass" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            👤 Datos del Cliente
          </h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="clienteNombre">Nombre Completo</label>
            <input
              type="text"
              id="clienteNombre"
              name="nombre"
              className="form-input"
              placeholder="Ej. Juan Pérez"
              value={cliente.nombre}
              onChange={handleClientChange}
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="clienteCedula">Número de Cédula</label>
            <input
              type="text"
              id="clienteCedula"
              name="cedula"
              className="form-input"
              placeholder="Ej. 1023456789"
              value={cliente.cedula}
              onChange={handleClientChange}
              disabled={loading}
            />
          </div>
        </section>

        {/* Adición de Productos */}
        <section className="card-glass" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            🍖 Buscar & Agregar Producto
          </h3>

          {/* Buscador de catálogo rápido */}
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Buscar por nombre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              disabled={loading}
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            />
          </div>

          {/* Selector de Producto */}
          <div className="form-group">
            <label className="form-label" htmlFor="selectProduct">Seleccionar Producto</label>
            <select
              id="selectProduct"
              className="form-input"
              value={selectedProductId}
              onChange={e => {
                setSelectedProductId(e.target.value);
                setErrorMsg('');
              }}
              disabled={loading}
            >
              <option value="">-- Elija un producto --</option>
              {filteredSelectProducts.map(p => (
                <option key={p.id} value={p.id} disabled={p.stockActual <= 0}>
                  {p.nombre} (${p.precio}) - Disp: {p.stockActual} u. {p.stockActual <= 0 ? '(AGOTADO)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad y botón */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label" htmlFor="qty">Cantidad</label>
              <input
                type="number"
                id="qty"
                className="form-input"
                min="1"
                value={selectedQuantity}
                onChange={e => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '12px 20px' }}
            >
              Añadir ➕
            </button>
          </div>
        </section>
      </div>

      {/* Columna Derecha: Detalle de Venta / Factura */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Alertas y confirmaciones */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
            ✔️ {successMsg}
          </div>
        )}

        <section className="card-glass" style={{ backgroundColor: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              🧾 Detalle de la Transacción
            </h3>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🛒</span>
                La lista de venta está vacía. Agregue productos para comenzar.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px', marginBottom: '20px' }}>
                {items.map(item => (
                  <div key={item.productoId} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ flex: 1, paddingRight: '15px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Precio: {formatPrice(item.precioUnitario)} | Disp: {item.stockDisponible} u.
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Control cantidad */}
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={e => handleQtyChange(item.productoId, e.target.value)}
                        disabled={loading}
                        style={{
                          width: '60px',
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          textAlign: 'center',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      />

                      <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                        {formatPrice(item.subtotal)}
                      </div>

                      <button
                        onClick={() => removerProducto(item.productoId)}
                        disabled={loading}
                        style={{ color: '#ef4444', fontSize: '1.1rem', padding: '4px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sumario y Botones de Compra */}
          <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569' }}>Total de la Venta:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5' }}>{formatPrice(total)}</span>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => {
                  vaciarVenta();
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                disabled={loading}
              >
                Cancelar Venta
              </button>
              <button
                onClick={handleCompleteSale}
                className="btn btn-primary"
                style={{ flex: 2, padding: '12px', justifyContent: 'center' }}
                disabled={loading || items.length === 0}
              >
                {loading ? 'Procesando...' : 'Completar Venta ✔'}
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default RegistroVentas;
