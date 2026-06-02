# Análisis de Mapeo Funcional y Diseño de Interfaces - Furry Feast MVP

**Rol:** Arquitecto de Software Sénior & Líder Técnico  
**Proyecto:** Furry Feast  
**Fecha:** 29 de mayo de 2026  
**Objetivo:** Revisión cruzada entre el **PRD Refinado** y los mockups visuales para definir la estrategia de desarrollo "Frontend First" (React + Vite).

---

## 1. Resumen Ejecutivo

Este análisis técnico y funcional evalúa la coherencia entre el **Product Requirements Document (PRD)** y el set de mockups de diseño provisto bajo el directorio `stitch_furry_feast_management_system`. 

El enfoque metodológico aplicado es **"PRD-Driven Design"**: el PRD rige estrictamente el alcance académico del MVP, y los mockups actúan como guía visual secundaria. Se concluye que el set de mockups cubre satisfactoriamente el flujo principal del administrador y del cliente final, pero presenta algunas redundancias operativas (vistas duplicadas de catálogo) e inconsistencias técnicas menores que deben ser subsanadas en la fase de maquetación en React + Vite.

El proyecto está perfectamente acotado para un desarrollo ágil y modular, minimizando riesgos de crecimiento de alcance (*scope creep*) al excluir explícitamente e-commerce y facturación avanzada.

---

## 2. Tabla de Correspondencia Funcional de Carpetas

A continuación, se mapea cada directorio de diseño físico con su representación lógica, el módulo al que pertenece en el PRD y su estado de validez dentro del alcance del MVP.

| Carpeta de Mockups | Pantalla o Vista Representada | Módulo Funcional del PRD | Validez para el MVP | Observaciones de Arquitectura |
| :--- | :--- | :--- | :--- | :--- |
| `login_furry_feast` | Pantalla de inicio de sesión segura. | Módulo 1: Seguridad, Usuarios y Autenticación (RF-1.1) | **Válida (Must Have)** | Debe incluir validación de campos obligatorios en el cliente antes de disparar la consulta de autenticación. |
| `gesti_n_de_productos` | Listado y grilla de administración de productos con opciones de búsqueda, filtro, edición y eliminación. | Módulo 2: Gestión del Catálogo de Productos (RF-2.4) | **Válida (Must Have)** | Crucial para la administración. Debe invocar la eliminación lógica (`activo = false`) al presionar "Eliminar". |
| `formulario_de_producto` | Formulario dinámico para creación (Registro) y edición de productos. | Módulo 2: Gestión del Catálogo de Productos (RF-2.1 y RF-2.2) | **Válida (Must Have)** | Reutiliza el mismo componente visual en React tanto para Modo Creación como para Modo Edición. |
| `registro_de_ventas` | Terminal interactiva de facturación y cobro básico para el Administrador. | Módulo 4: Registro de Ventas (RF-4.1, RF-4.2 y RF-4.3) | **Válida (Must Have)** | Debe implementar el cálculo de totales en tiempo real en frontend y la validación transaccional de stock. |
| `alertas_de_stock_bajo` | Módulo de visualización de productos en estado crítico de abastecimiento. | Módulo 3: Inventario, Stock y Alertas (RF-3.3) | **Válida (Should Have)** | Es integrable en el dashboard general o como vista independiente protegida para administradores. |
| `dashboard_administrativo` | Panel de control de bienvenida para administradores con KPIs básicos. | Estructura / Integrador de Alertas y Navegación del Admin | **Válida (Must Have)** | Actúa como página principal (`/admin/dashboard`). Debe incrustar de forma destacada el componente de alertas de stock bajo. |
| `cat_logo_p_blico_clientes` | Catálogo de productos para clientes en vista de escritorio. | Módulo 5: Catálogo Público para Clientes (RF-5.1) | **Válida (Must Have)** | Vista principal de cara al usuario no administrador. Debe incorporar controles de paginación e inputs de búsqueda. |
| `cat_logo_p_blico_vista_escritorio` | Catálogo de productos para clientes (Posible duplicado). | Módulo 5: Catálogo Público para Clientes (RF-5.1) | **Redundante** | Representa exactamente la misma vista funcional que `cat_logo_p_blico_clientes`. Se consolidará en un único componente. |
| `cat_logo_p_blico_vista_m_vil` | Versión responsiva móvil del catálogo de clientes. | Módulo 5: Catálogo Público para Clientes (RF-5.1 / RNF-4) | **Consolidada (No requiere vista extra)** | **No es una pantalla distinta.** Es una adaptación responsive mediante media queries CSS de la vista de catálogo única. |

---

## 3. Listado de Pantallas Válidas para el MVP (React + Vite)

Para la implementación en React + Vite, estructuraremos la aplicación bajo las siguientes rutas y componentes limpios:

1.  **`/login` (Login):** Interfaz para el ingreso de credenciales. Recibe el token JWT y redirige al dashboard administrativo o al catálogo según el rol.
2.  **`/` (Catálogo Público - Cliente):** Vista del catálogo público con buscador por texto, selector de categoría y controles de paginación (interfaz totalmente responsiva que cubre escritorio y móvil).
3.  **`/admin/dashboard` (Dashboard Administrativo):** Pantalla de inicio del administrador. Integra widgets informativos y el panel visual de alertas de bajo stock (`stock_actual <= stock_minimo`).
4.  **`/admin/productos` (Gestión de Productos):** Tabla administrativa con buscador de productos y botones de acción (Editar, Desactivar/Eliminar Lógico).
5.  **`/admin/productos/nuevo` y `/admin/productos/editar/:id` (Formulario de Producto):** Formulario dinámico reutilizable para capturar el modelo de datos de producto validado.
6.  **`/admin/ventas/nueva` (Registro de Ventas):** Interfaz interactiva de adición de productos, selección de cantidades, visualización de total y guardado transaccional.

---

## 4. Pantallas Redundantes, Duplicadas o Fuera de Alcance

*   **`cat_logo_p_blico_vista_escritorio` vs `cat_logo_p_blico_clientes`:** Son duplicados conceptuales. Deben desarrollarse como una única página de catálogo en el frontend.
*   **`cat_logo_p_blico_vista_m_vil`:** En la arquitectura web responsiva moderna, **no se construye una vista o archivo separado para móvil**. Se debe implementar un único componente en React utilizando CSS flexible (Flexbox, Grid) y Media Queries para garantizar una transición fluida entre dispositivos móviles y de escritorio.
*   **Exclusión de Funcionalidades Complejas en Vistas:** Si algún diseño de mockup muestra pasarelas de pago (ej. botones de Stripe/PayPal), carritos de compra persistentes complejos con envío a domicilio, o botones de facturación electrónica directa, **estos elementos se maquetarán únicamente como elementos estáticos o deshabilitados** para cumplir estrictamente con el límite del MVP académico.

---

## 5. Pantallas Faltantes o Componentes a Agregar (No cubiertos por los mockups)

Para que el frontend sea consistente y usable al interactuar con el backend real, se deben diseñar e incorporar las siguientes vistas auxiliares:

1.  **Vista `/registro` o Formulario de Creación de Clientes:** El PRD especifica el manejo de usuarios por rol (administrador y cliente) y el registro seguro. Si se permite el registro público, se requiere una interfaz simple para que nuevos clientes creen su cuenta (`ROLE_CUSTOMER` por defecto).
2.  **Pantalla de Acceso Denegado (Error 403):** Componente para redirigir a un usuario cliente (`ROLE_CUSTOMER`) si este intenta acceder de forma manual a una ruta protegida de administración (`/admin/*`).
3.  **Historial de Ventas (`/admin/ventas`):** Mencionada como funcionalidad "Could Have", es sumamente importante para contrastar los datos históricos. Se debe agregar una tabla simple que liste las ventas pasadas y permita abrir un modal interactivo con el detalle inmutable de cada transacción.

---

## 6. Recomendación de Orden de Implementación Frontend (React + Vite)

Para garantizar un flujo de trabajo continuo y eficiente de tipo **Frontend-First**, se recomienda estructurar la construcción de componentes en el siguiente orden de dependencia lógica:

### Fase 1: Configuración de Entorno e Infraestructura Visual
*   **Tarea:** Inicialización del proyecto con React + Vite, estructuración de carpetas (`components/`, `pages/`, `context/`, `hooks/`, `services/`), configuración de rutas dinámicas con `react-router-dom` y desarrollo del sistema de estilos base en CSS vanilla.

### Fase 2: Vistas de Acceso Público (Enfoque en el Cliente)
*   **Tarea:** Implementación del **Catálogo Público (`/`)** adaptando las guías de los mockups (escritorio y móvil de forma unificada y responsiva) con maquetación estática de filtros y paginación. Desarrollo de la **Pantalla de Login (`/login`)** con estados locales para guardar el rol del usuario de prueba.

### Fase 3: Gestión del Catálogo (Consola Administrativa)
*   **Tarea:** Construcción del Layout administrativo protegido, la pantalla de **Gestión de Productos (`/admin/productos`)** con su tabla interactiva, y el **Formulario de Producto (`/admin/productos/nuevo`)** configurado para soportar tanto creación como edición mediante paso de propiedades y hooks de formulario.

### Fase 4: Operaciones de Transacción e Inventario
*   **Tarea:** Implementación del **Dashboard Administrativo (`/admin/dashboard`)** que combine KPIs estáticos y el panel interactivo de alertas de stock bajo. Posteriormente, desarrollo de la **Terminal de Ventas (`/admin/ventas/nueva`)** con el carrito local, cálculo dinámico de totales e inputs de validación de cantidades de stock.

### Fase 5: Integración y Mocking de Servicios API
*   **Tarea:** Implementar un servicio de mocking de datos (usando archivos locales `.json` o un estado local de React) para emular en el frontend el comportamiento de la base de datos H2 y la API de Spring Boot, dejando el código de Fetch/Axios estructurado y listo para conectarse al backend real en la siguiente fase del proyecto.
