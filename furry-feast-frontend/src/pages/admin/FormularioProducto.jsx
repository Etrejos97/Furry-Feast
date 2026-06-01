import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';

export const FormularioProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stockActual: '',
    stockMinimo: '',
    imagenUrl: '' // Campo opcional
  });

  // Errors State
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpiar mensaje de error global automáticamente tras 5 segundos
  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  // Load product if editing
  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const product = await productService.getProductById(id);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        categoria: product.categoria,
        precio: product.precio.toString(),
        stockActual: product.stockActual.toString(),
        stockMinimo: product.stockMinimo.toString(),
        imagenUrl: product.imagenUrl || ''
      });
    } catch (error) {
      setGlobalError('Error cargando el producto. Verifique si el ID existe.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [isEditMode, loadProduct]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.';
    if (!formData.categoria) newErrors.categoria = 'Seleccione una categoría.';
    
    const precioNum = parseFloat(formData.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0.';
    }

    const stockActualNum = parseInt(formData.stockActual);
    if (isNaN(stockActualNum) || stockActualNum < 0) {
      newErrors.stockActual = 'El stock actual debe ser mayor o igual a 0.';
    }

    const stockMinimoNum = parseInt(formData.stockMinimo);
    if (isNaN(stockMinimoNum) || stockMinimoNum < 1) {
      newErrors.stockMinimo = 'El stock mínimo debe ser al menos 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Limpiar error al escribir
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
    setGlobalError('');
  };

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'ALIMENTOS': return '🍖';
      case 'MEDICAMENTOS': return '💊';
      case 'ACCESORIOS': return '🦮';
      case 'CUIDADO': return '🛁';
      default: return '🐾';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGlobalError('');

    const parsedData = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      stockActual: parseInt(formData.stockActual),
      stockMinimo: parseInt(formData.stockMinimo),
      imagenUrl: formData.imagenUrl.trim() || null,
      activo: true
    };

    try {
      if (isEditMode) {
        await productService.updateProduct(id, parsedData);
      } else {
        await productService.createProduct(parsedData);
      }
      navigate('/admin/productos');
    } catch (error) {
      setGlobalError(error.message || 'Ocurrió un error al procesar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin/productos" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          ← Volver al Inventario
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginTop: '10px', color: '#1e293b' }}>
          {isEditMode ? '✏️ Editar Producto' : '➕ Registrar Producto'}
        </h1>
        <p style={{ color: '#64748b' }}>
          {isEditMode ? 'Actualiza los datos del producto seleccionado.' : 'Completa el formulario para agregar un producto al catálogo.'}
        </p>
      </div>

      {globalError && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#b91c1c',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '20px',
          fontWeight: 500,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {globalError}</span>
          <button
            onClick={() => setGlobalError('')}
            style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      <div className="card-glass" style={{ backgroundColor: '#ffffff', padding: '32px' }}>
        {loading && isEditMode && formData.nombre === '' ? (
          <div style={{ textAlign: 'center', color: '#4f46e5' }}>Cargando datos del producto...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                className="form-input"
                placeholder="Ej. Concentrado para Cachorros 10kg"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.nombre && <span className="form-error-msg">{errors.nombre}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label" htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                className="form-input"
                placeholder="Detalla los beneficios y composición del producto..."
                value={formData.descripcion}
                onChange={handleChange}
                disabled={loading}
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
              {errors.descripcion && <span className="form-error-msg">{errors.descripcion}</span>}
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="form-label" htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                className="form-input"
                value={formData.categoria}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">-- Seleccione una categoría --</option>
                <option value="ALIMENTOS">Alimentos 🍖</option>
                <option value="MEDICAMENTOS">Medicamentos 💊</option>
                <option value="ACCESORIOS">Accesorios 🐕</option>
                <option value="CUIDADO">Cuidado Higiene 🧼</option>
              </select>
              {errors.categoria && <span className="form-error-msg">{errors.categoria}</span>}
            </div>

            {/* Fila: Precio, Stock Actual, Stock Mínimo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              marginTop: '10px'
            }}>
              {/* Precio */}
              <div className="form-group">
                <label className="form-label" htmlFor="precio">Precio de Venta ($) *</label>
                <input
                  type="number"
                  id="precio"
                  className="form-input"
                  placeholder="0.00"
                  step="any"
                  value={formData.precio}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.precio && <span className="form-error-msg">{errors.precio}</span>}
              </div>

              {/* Stock Actual */}
              <div className="form-group">
                <label className="form-label" htmlFor="stockActual">Stock Inicial *</label>
                <input
                  type="number"
                  id="stockActual"
                  className="form-input"
                  placeholder="0"
                  value={formData.stockActual}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.stockActual && <span className="form-error-msg">{errors.stockActual}</span>}
              </div>

              {/* Stock Mínimo */}
              <div className="form-group">
                <label className="form-label" htmlFor="stockMinimo">Stock Mínimo *</label>
                <input
                  type="number"
                  id="stockMinimo"
                  className="form-input"
                  placeholder="1"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.stockMinimo && <span className="form-error-msg">{errors.stockMinimo}</span>}
              </div>
            </div>

            {/* URL de Imagen (Opcional) */}
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label className="form-label" htmlFor="imagenUrl">URL de la Imagen (opcional)</label>
              <input
                type="text"
                id="imagenUrl"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imagenUrl}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Vista previa de la imagen */}
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="form-label">Vista Previa:</span>
              <div style={{
                width: '200px',
                height: '130px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1.5px solid #e2e8f0',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
              }}>
                {formData.imagenUrl.trim() ? (
                  <img 
                    src={formData.imagenUrl.trim()} 
                    alt="Vista previa del producto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  display: formData.imagenUrl.trim() ? 'none' : 'flex',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  backgroundColor: '#e2e8f0'
                }}>
                  {getCategoryEmoji(formData.categoria)}
                </div>
              </div>
            </div>

            {/* Botones de Envío */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '15px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '24px',
              marginTop: '24px'
            }}>
              <Link to="/admin/productos" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Producto ✔'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormularioProducto;
