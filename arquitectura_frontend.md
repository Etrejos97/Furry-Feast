# Especificación de Arquitectura de Frontend - Furry Feast MVP

**Rol:** Ingeniero Frontend Sénior & Líder de Desarrollo React  
**Proyecto:** Furry Feast  
**Fecha:** 29 de mayo de 2026  
**Stack Principal:** React JS, Vite, React Router DOM v6, Context API  
**Objetivo:** Definir e implementar la estructura de carpetas, rutas, layouts y flujo de estado inicial para iniciar la maquetación (Fase 3) de manera limpia y modular, garantizando acoplamiento mínimo hacia la posterior integración del backend.

---

## 1. Estructura de Carpetas Recomendada (React + Vite)

Para garantizar la modularidad de un proyecto React moderno basado en Vite, implementamos una estructura por capas (*separation of concerns*). Esto facilita que el desarrollo visual no dependa directamente de la lógica de conexión API y permite un testing aislado de componentes:

```text
furry-feast-frontend/
├── public/                  # Archivos estáticos, logos, favicon
├── src/
│   ├── assets/              # Imágenes locales, ilustraciones y recursos CSS globales
│   ├── components/          # Componentes altamente reutilizables (sin estado de negocio complejo)
│   │   ├── common/          # Componentes transversales: Buttons, Inputs, Modals, Loaders
│   │   ├── layout/          # Estructuras principales: Navbar, Sidebar, Footer, Layouts
│   │   └── products/        # Tarjetas de productos, widgets del catálogo, etc.
│   ├── context/             # Proveedores de estado global mediante Context API
│   │   ├── AuthContext.jsx  # Control de inicio de sesión, token JWT y roles
│   │   └── VentaContext.jsx # Gestión local de la terminal de facturación y carrito de venta
│   ├── hooks/               # Custom Hooks reutilizables (ej. useFetch, useForm, useLocalStorage)
│   ├── pages/               # Vistas principales de la aplicación asociadas a rutas
│   │   ├── admin/           # Dashboard, Gestión de Productos, Formulario de Producto, Registro de Venta
│   │   ├── public/          # Catálogo de Clientes, Login, Registro, Acceso Denegado
│   │   └── Error404.jsx     # Pantalla para rutas inexistentes
│   ├── services/            # Capa de consumo HTTP (Axios/Fetch) encapsulado
│   │   ├── api.js           # Cliente Axios/Fetch configurado con interceptores para JWT
│   │   ├── authService.js   # Peticiones de login y registro
│   │   ├── productService.js# Peticiones CRUD y paginación del catálogo
│   │   └── salesService.js  # Petición de registro de transacciones de venta
│   ├── utils/               # Funciones auxiliares y formateadores (ej. formato de moneda, fechas)
│   ├── App.jsx              # Punto de entrada de la aplicación, configuración de rutas y proveedores
│   ├── index.css            # Estilos globales y tokens del sistema de diseño (colores, fuentes)
│   └── main.jsx             # Render inicial en el DOM
├── index.html               # Plantilla HTML principal
├── package.json             # Dependencias del frontend
└── vite.config.js           # Configuración de compilación de Vite
```

---

## 2. Definición del Enrutamiento (Rutas del Sistema)

El ruteo se gestiona de forma centralizada en `App.jsx` utilizando `react-router-dom` (versión 6). Separamos la navegación en tres áreas lógicas: rutas públicas abiertas, rutas de clientes autenticados y rutas protegidas exclusivas de administración.

```mermaid
graph TD
    A[Inicio de la App] --> B{¿Ruta Solicitada?}
    B -->|Públicas| C[Navbar Pública]
    C --> C1[/: Catálogo Público]
    C --> C2[/login: Login]
    C --> C3[/registro: Registro]
    
    B -->|Privadas Admin| D[Layout Administrativo]
    D -->|Filtro Rol === ADMIN| D1[/admin/dashboard: Dashboard + Alertas]
    D -->|Filtro Rol === ADMIN| D2[/admin/productos: CRUD Tabla]
    D -->|Filtro Rol === ADMIN| D3[/admin/ventas/nueva: Terminal]
    
    B -->|Cualquier otra| E[/404: No Encontrada]
```

### Tabla de Rutas

| Ruta del Frontend | Vista / Página | Layout Aplicado | Rol Requerido | Propósito Funcional |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `CatalogoClientes` | `PublicLayout` | Cualquiera (Público) | Consulta interactiva, paginada y filtrable de productos. |
| `/login` | `Login` | `PublicLayout` | Cualquiera (No logueado) | Autenticación y obtención del token JWT. |
| `/registro` | `RegistroCliente` | `PublicLayout` | Cualquiera (No logueado) | Formulario de registro para nuevos clientes finales. |
| `/denegado` | `Forbidden` | `PublicLayout` | Cualquiera | Mensaje de advertencia HTTP 403 (Acceso Denegado). |
| `/admin/dashboard` | `DashboardAdmin` | `AdminLayout` | `ROLE_ADMIN` | KPIs globales y panel prioritario de Alertas de Stock Bajo. |
| `/admin/productos` | `GestionProductos` | `AdminLayout` | `ROLE_ADMIN` | Listado tabular de productos con buscador y botones CRUD. |
| `/admin/productos/nuevo` | `FormularioProducto` | `AdminLayout` | `ROLE_ADMIN` | Formulario en blanco para registrar un nuevo producto. |
| `/admin/productos/editar/:id` | `FormularioProducto`| `AdminLayout` | `ROLE_ADMIN` | Carga de datos de producto existente para su actualización. |
| `/admin/ventas/nueva` | `RegistroVentas` | `AdminLayout` | `ROLE_ADMIN` | Terminal interactiva de facturación y adición de productos. |
| `*` | `Error404` | Ninguno (Limpio) | Cualquiera | Pantalla de redirección para rutas no especificadas. |

---

## 3. Estructura de Layouts

Para evitar la repetición de código visual (como barras de navegación o barras laterales), la aplicación encapsula las páginas en dos plantillas estructurales utilizando `<Outlet />` de `react-router-dom`:

### A. Layout Público (`PublicLayout.jsx`)
Provee la cabecera estándar de navegación para clientes y visitantes generales.
*   **Encabezado (Navbar):** Logo de *Furry Feast*, barra de búsqueda rápida, enlaces al catálogo, y un botón contextual que cambia entre "Iniciar Sesión" (si está anónimo) y "Panel Admin" / "Cerrar Sesión" (si está logueado).
*   **Contenido Dinámico (`<Outlet />`):** Renderiza el catálogo, login o formulario de registro.
*   **Pie de Página (Footer):** Información básica del local de mascotas, horarios y copyright académico.

### B. Layout Administrativo (`AdminLayout.jsx`)
Exclusivo para la gestión interna de la tienda de mascotas.
*   **Menú Lateral (Sidebar):** Estructura fija y responsiva con enlaces de navegación a:
    *   Dashboard (`/admin/dashboard`)
    *   Gestión de Inventario (`/admin/productos`)
    *   Terminal de Ventas (`/admin/ventas/nueva`)
    *   Cerrar Sesión (Limpia tokens locales y redirige).
*   **Barra Superior (Topbar):** Muestra el perfil del administrador autenticado, notificaciones de stock bajo de forma resumida, y un botón para volver rápidamente al catálogo público.
*   **Área de Trabajo (`<Outlet />`):** Contenedor principal donde se despliegan los formularios y las tablas operativas de administración.

---

## 4. Estrategia de Gestión de Estado Global (Context API)

En lugar de sobrecargar la aplicación con dependencias pesadas como Redux, utilizaremos **Context API** nativo de React, el cual es ideal para la complejidad controlada de un MVP académico.

### A. `AuthContext.jsx` (Autenticación e Identidad)
Centraliza el estado del usuario logueado en la aplicación:
```javascript
// Estructura del Estado de Autenticación
const initialAuthState = {
  isAuthenticated: false,
  token: null,          // JWT persistido localmente
  user: {
    email: "",
    role: ""            // 'ROLE_ADMIN' o 'ROLE_CUSTOMER'
  },
  loading: true         // Evita parpadeos de redirección en refresh
};
```
**Funciones expuestas:**
*   `login(email, password)`: Dispara la llamada HTTP, almacena el token devuelto en `localStorage` y actualiza el estado.
*   `logout()`: Remueve el JWT de `localStorage` y limpia el estado redirigiendo a `/`.

### B. `VentaContext.jsx` (Terminal de Facturación)
Mantiene de forma volátil la lista de productos pre-seleccionados por el administrador para procesar una venta:
```javascript
// Estructura de la venta activa
const initialVentaState = {
  cliente: { nombre: "", cedula: "" },
  items: [],            // Array de { productoId, nombre, precioUnitario, cantidad, stockDisponible }
  total: 0
};
```
**Funciones expuestas:**
*   `agregarProducto(producto, cantidad)`: Agrega o suma cantidades validando dinámicamente contra el stock disponible en frontend.
*   `removerProducto(productoId)`: Quita un elemento de la lista.
*   `actualizarCantidad(productoId, nuevaCantidad)`: Modifica las cantidades y recalcula el total acumulado en tiempo real.
*   `vaciarVenta()`: Restablece el estado tras una venta exitosa o cancelación voluntaria.

---

## 5. Protección de Rutas (Guardias de Navegación)

Para impedir accesos no autorizados a URLs administrativas o flujos restringidos, se implementa un componente envoltorio reutilizable llamado `<ProtectedRoute />`:

```jsx
// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth'; // Custom hook

export const ProtectedRoute = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  if (!auth.isAuthenticated) {
    // Redirige al login si no ha iniciado sesión
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    // Redirige a pantalla de acceso prohibido si el rol no coincide
    return <Navigate to="/denegado" replace />;
  }

  // Renderiza el componente de la ruta si cumple las condiciones
  return <Outlet />;
};
```

**Uso en el enrutador (`App.jsx`):**
```jsx
<Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<DashboardAdmin />} />
    <Route path="/admin/productos" element={<GestionProductos />} />
  </Route>
</Route>
```

---

## 6. Preparación para API REST y Estrategia de Mock Data

Para asegurar el enfoque **Frontend-First**, la arquitectura incluye una abstracción de servicios (`src/services/`) desacoplada del origen real de los datos.

### A. Configuración de API (`api.js`)
Se crea un cliente HTTP base (usando `fetch` o `axios`) parametrizado con un interceptor de peticiones automáticas para incluir el JWT:
```javascript
// Ejemplo conceptual de interceptor en src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response.json();
};
```

### B. Mocking de Datos (Desarrollo Aislado)
Durante la Fase 3 y 4 de maquetación, los servicios importarán un set de datos semilla local en lugar de disparar consultas a la red. Esto permite depurar el frontend al 100% de manera estática.

```javascript
// src/services/productService.js (Versión Mocking para fase inicial)
import mockProducts from './mockData/products.json';

export const getProducts = async (page = 0, size = 10, search = '', category = '') => {
  // Simulamos delay de red de 300ms
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = mockProducts.filter(p => p.activo);
  
  if (category) {
    filtered = filtered.filter(p => p.categoria === category);
  }
  if (search) {
    filtered = filtered.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
  }

  // Paginación lógica simulada
  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return {
    content,
    totalPages: Math.ceil(filtered.length / size),
    totalElements: filtered.length,
    size,
    number: page
  };
};
```

*   **Acción de Migración Futura:** Cuando el backend en Spring Boot esté listo, únicamente se reemplazará la lógica del archivo `productService.js` por llamadas reales de `fetchWithAuth('/productos?page=...')`. **Las páginas de React que consumen el servicio no sufrirán ningún cambio en su estructura o JSX.**

---

## 7. Plan de Acción Técnico para Fase 3 (Maquetación)

Con esta arquitectura aprobada, el orden de construcción física sugerido es el siguiente:
1.  **Semana 1 - Configuración & Layouts:** Escribir los archivos CSS globales, implementar la estructura de ruteo en `App.jsx` y maquetar los layouts estructurales (`PublicLayout` y `AdminLayout`).
2.  **Semana 2 - Vistas Públicas:** Diseñar la vista responsiva de `CatalogoClientes` con filtros funcionales locales y la pantalla de `Login`.
3.  **Semana 3 - Consola Admin:** Maquetar la tabla de `GestionProductos` y acoplar el `FormularioProducto` con soporte interactivo para validaciones.
4.  **Semana 4 - Operaciones Críticas:** Implementar el componente de alertas dentro de `DashboardAdmin` y construir la terminal transaccional de `RegistroVentas` integrando el `VentaContext`.
