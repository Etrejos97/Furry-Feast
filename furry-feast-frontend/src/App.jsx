import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VentaProvider } from './context/VentaContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import CatalogoClientes from './pages/public/CatalogoClientes';
import Login from './pages/public/Login';
import Forbidden from './pages/public/Forbidden';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionProductos from './pages/admin/GestionProductos';
import FormularioProducto from './pages/admin/FormularioProducto';
import RegistroVentas from './pages/admin/RegistroVentas';

// 404 Page
import Error404 from './pages/Error404';

function App() {
  return (
    <AuthProvider>
      <Router>
        <VentaProvider>
          <Routes>
            {/* Rutas Públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<CatalogoClientes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/denegado" element={<Forbidden />} />
            </Route>

            {/* Rutas Administrativas Protegidas */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/productos" element={<GestionProductos />} />
                <Route path="/admin/productos/nuevo" element={<FormularioProducto />} />
                <Route path="/admin/productos/editar/:id" element={<FormularioProducto />} />
                <Route path="/admin/ventas/nueva" element={<RegistroVentas />} />
              </Route>
            </Route>

            {/* Error 404 */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </VentaProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;