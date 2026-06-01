# PRD refinado — Furry Feast MVP

**Estado:** Versión refinada para implementación  
**Fecha:** 28 de mayo de 2026  
**Proyecto:** Furry Feast  
**Tipo:** Proyecto académico orientado a MVP  
**Stack obligatorio:** React JS en frontend, Java con Spring Boot en backend bajo arquitectura API REST y H2 como base de datos para el entorno académico inicial [file:20][file:1][cite:12]

## Visión del producto

Furry Feast es una plataforma web para apoyar la operación básica de tiendas de mascotas mediante gestión de productos, inventario, ventas y consulta pública de catálogo [file:20][file:1]. El propósito del MVP es reemplazar procesos manuales o desorganizados con una solución simple, entendible y funcional que permita controlar existencias, registrar ventas y mostrar disponibilidad de productos de forma estructurada [file:20][file:2].

## Problema que resuelve

Las tiendas de mascotas suelen manejar inventario y ventas con cuadernos, hojas de cálculo o procesos manuales, lo que provoca errores de stock, pérdida de información y dificultades para saber qué productos están realmente disponibles [file:1][file:20]. Además, los clientes no siempre tienen una forma rápida de consultar si un producto existe antes de desplazarse a la tienda, lo que afecta la experiencia de compra [file:20][file:2].

## Objetivo del MVP

El MVP debe permitir que una tienda de mascotas administre sus productos, consulte su inventario, reciba alertas de bajo stock y registre ventas de manera confiable desde una aplicación web [file:1][file:20]. También debe ofrecer una vista de catálogo para clientes con búsqueda y paginación, manteniendo un alcance académico controlado y evitando módulos avanzados fuera de la primera entrega [file:20][file:2].

## Usuarios del sistema

| Usuario | Necesidad principal | Permisos principales |
|---|---|---|
| Administrador | Gestionar la operación diaria de la tienda [file:20] | Iniciar sesión, crear/editar/eliminar productos, ver alertas, registrar ventas, consultar catálogo interno [file:1][file:20] |
| Cliente | Consultar disponibilidad de productos [file:20] | Ver catálogo público, buscar productos, filtrar por categoría y navegar por páginas [file:20][file:2] |
| Evaluador académico | Revisar funcionamiento y coherencia técnica [file:20] | Ejecutar backend Spring Boot, revisar API REST, validar frontend React y persistencia en H2 [file:20][cite:12] |

## Alcance del MVP

### Incluido

- Autenticación e inicio de sesión para usuarios del sistema [file:1][file:20].
- Gestión de usuarios con roles, al menos administrador y cliente [file:1][file:20].
- CRUD de productos con campos esenciales: nombre, descripción, categoría, precio, stock actual, stock mínimo y estado activo [file:20].
- Consulta administrativa del catálogo [file:20].
- Control de inventario con decremento automático tras registrar ventas [file:1][file:20].
- Alertas de abastecimiento cuando el stock actual sea menor o igual al stock mínimo [file:1][file:20].
- Registro básico de ventas con detalle de productos, cantidades, cliente y total [file:1][file:20].
- Catálogo público para clientes con búsqueda, filtro por categoría y paginación [file:1][file:20].

### Excluido

- E-commerce completo y pagos en línea [file:20].
- Facturación electrónica [file:20].
- IA o recomendaciones automáticas [file:1][file:20].
- Reportería avanzada, exportación a PDF/Excel u OLAP [file:20].
- Aplicación móvil nativa [file:20].
- Multi-sucursal o multitienda [file:20].
- Integraciones externas con pasarelas, correo o servicios cloud [file:20].

## Funcionalidades priorizadas

| Prioridad | Funcionalidad | Justificación |
|---|---|---|
| Must Have | Login y control por roles [file:20] | Es la base para separar funciones de administrador y cliente [file:1][file:20] |
| Must Have | CRUD de productos [file:1][file:20] | Es el núcleo operativo del inventario [file:1] |
| Must Have | Registro de ventas con descuento de stock [file:1][file:20] | Sin esto el sistema no aporta valor real en la operación diaria [file:20] |
| Must Have | Catálogo público paginado [file:1][file:20] | Resuelve la consulta de disponibilidad para clientes [file:2][file:20] |
| Should Have | Alertas visuales de bajo stock [file:1][file:20] | Ayuda a prevenir desabastecimiento [file:1] |
| Should Have | Búsqueda y filtro por categoría [file:20] | Mejora la usabilidad del catálogo [file:20] |
| Could Have | Historial básico de ventas [file:20] | Aporta valor, pero no debe bloquear el MVP inicial [file:20] |

## Requisitos funcionales

### 1. Seguridad y usuarios

- El sistema debe permitir autenticación mediante correo y contraseña para usuarios registrados [file:20].
- El sistema debe manejar al menos dos roles: administrador y cliente [file:1][file:20].
- El administrador debe acceder a vistas protegidas de gestión [file:20].
- El registro público, si se habilita, debe crear usuarios con rol cliente por defecto [file:20].

### 2. Catálogo de productos

- El administrador debe crear productos con nombre, descripción, categoría, precio, stock actual y stock mínimo [file:20].
- El administrador debe editar productos existentes [file:1][file:20].
- El administrador debe desactivar productos sin borrarlos físicamente cuando ya existan ventas asociadas [file:20].
- El sistema debe listar productos para administración y para consulta pública, respetando permisos [file:1][file:20].

### 3. Inventario y alertas

- El sistema debe descontar stock automáticamente al confirmar una venta [file:1][file:20].
- El sistema debe impedir ventas con cantidades superiores al stock disponible [file:20].
- El sistema debe mostrar alertas para productos cuyo stock actual sea menor o igual al mínimo configurado [file:1][file:20].

### 4. Ventas

- El administrador debe registrar una venta seleccionando uno o varios productos y cantidades [file:1][file:20].
- El sistema debe calcular subtotales y total antes de confirmar la venta [file:20].
- La venta debe almacenar datos básicos del cliente y el precio histórico de cada producto vendido [file:20].
- Si falla una validación de stock, la venta completa no debe guardarse parcialmente [file:20].

### 5. Catálogo cliente

- El cliente debe consultar productos disponibles desde una vista pública [file:1][file:20].
- El catálogo debe incluir búsqueda por nombre y filtro por categoría [file:20].
- El catálogo debe usar paginación del lado del servidor para no cargar todos los productos al mismo tiempo [file:20].

## Requisitos no funcionales

- El frontend debe estar construido en React JS y consumir una API REST [file:20][cite:12].
- El backend debe estar construido en Java con Spring Boot y exponer endpoints JSON desacoplados del frontend [file:20][cite:12].
- La persistencia inicial debe usar H2 por simplicidad académica, pero el backend debe quedar preparado para migración futura mediante JPA/Hibernate y configuración externa [file:20].
- La autenticación debe proteger contraseñas con hash seguro y controlar acceso por rol [file:1][file:20].
- La interfaz debe ser usable y responsive para escritorio y móvil [file:1][file:20].
- Las operaciones principales de catálogo y ventas deben responder de manera ágil y con paginación cuando aplique [file:1][file:20].

## Reglas de negocio

- No se deben registrar dos productos activos con el mismo nombre exacto [file:20].
- El stock mínimo debe ser al menos de una unidad [file:20].
- No se puede vender un producto si la cantidad solicitada supera el stock actual [file:20].
- Los cambios de precio de un producto no deben modificar ventas históricas [file:20].
- Un producto inactivo no debe aparecer en el catálogo público ni seleccionarse en nuevas ventas [file:20].
- Si un producto tiene historial de ventas, su eliminación debe ser lógica y no física [file:20].

## Flujos principales

### Flujo 1: creación y monitoreo de producto

1. El administrador inicia sesión [file:20].
2. Registra un nuevo producto con datos básicos y stock mínimo [file:1][file:20].
3. El sistema valida unicidad y consistencia [file:20].
4. El producto queda disponible en el catálogo si está activo [file:20].
5. Si el stock cae por debajo del mínimo después de ventas, el sistema lo incluye en alertas [file:1][file:20].

### Flujo 2: consulta de catálogo por cliente

1. El cliente entra al catálogo público [file:20].
2. Ve la primera página de productos disponibles [file:20].
3. Usa buscador o filtro por categoría [file:20].
4. El frontend consulta el backend con parámetros de paginación y filtros [file:20].
5. El sistema devuelve resultados y metadatos para navegar entre páginas [file:20].

### Flujo 3: registro de venta

1. El administrador accede a la pantalla de ventas [file:20].
2. Busca productos y define cantidades [file:20].
3. El sistema calcula el total en tiempo real [file:20].
4. Al confirmar, el backend valida stock y registra la venta de manera transaccional [file:20].
5. El sistema descuenta inventario y actualiza alertas si corresponde [file:1][file:20].
6. Si un producto no tiene stock suficiente, se cancela toda la operación y se informa el error [file:20].

## Casos de uso prioritarios

| Caso de uso | Actor | Resultado esperado |
|---|---|---|
| Iniciar sesión | Administrador o cliente | Acceso según rol y permisos [file:1][file:20] |
| Crear producto | Administrador | Producto activo en catálogo si cumple validaciones [file:1][file:20] |
| Editar producto | Administrador | Información actualizada sin romper historial [file:1][file:20] |
| Eliminar lógicamente producto | Administrador | Producto oculto del catálogo público pero conservado en BD [file:20] |
| Registrar venta | Administrador | Venta guardada y stock actualizado [file:1][file:20] |
| Consultar alertas | Administrador | Visualización de productos en estado crítico [file:1][file:20] |
| Consultar catálogo | Cliente | Navegación rápida y filtrable de productos disponibles [file:1][file:20] |

## Criterios de aceptación

### Autenticación

- Si un usuario no autenticado intenta entrar a una ruta administrativa, el sistema debe impedir el acceso [file:20].
- Si las credenciales son válidas, el sistema debe iniciar sesión y habilitar el menú correspondiente al rol [file:20].

### Productos

- Si se intenta crear un producto con nombre ya existente, el sistema debe rechazarlo [file:20].
- Si un producto con ventas previas se elimina, debe quedar inactivo y no borrarse físicamente [file:20].

### Inventario

- Si un producto con stock 10 y stock mínimo 5 vende 6 unidades, el nuevo stock debe ser 4 y el producto debe aparecer en alertas [file:20].

### Ventas

- Si una venta incluye varios productos y uno falla por stock insuficiente, no debe guardarse ningún cambio parcial [file:20].

### Catálogo cliente

- Si existen más de 100 productos, la vista pública debe cargar solo la primera página por defecto y permitir avanzar con controles de paginación [file:20].

## Supuestos y restricciones

- El sistema será ejecutado principalmente en entorno local para evaluación académica [file:20].
- Frontend y backend correrán en puertos distintos, por lo que el backend deberá habilitar CORS [file:20].
- La base H2 en memoria perderá los datos al reiniciar la aplicación si no se cargan datos semilla [file:20].
- El proyecto debe mantenerse simple y enfocado en el MVP, evitando módulos empresariales avanzados en esta fase [file:20][file:2].

## Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Pérdida de datos por reinicio de H2 en memoria [file:20] | Alto | Cargar datos semilla con `data.sql` o considerar modo persistente solo si el profesor lo permite [file:20] |
| Sobrecarga del catálogo en frontend [file:20] | Medio | Paginación estricta desde backend y consultas filtradas [file:20] |
| Inconsistencias en ventas simultáneas [file:20] | Alto | Manejo transaccional y estrategia de concurrencia en backend [file:20] |
| Crecimiento del alcance [file:20] | Alto | Respetar priorización Must/Should/Could y no desarrollar exclusiones del MVP [file:20] |

## Evolución futura

Una vez validado el MVP, el proyecto podría migrar a PostgreSQL o MySQL, incorporar carga de imágenes, pagos en línea, notificaciones y módulos de reportes, pero ninguna de esas capacidades debe condicionar la implementación inicial [file:20][file:2]. La arquitectura debe prepararse para evolucionar, pero la entrega actual debe priorizar claridad funcional, separación por capas y facilidad de evaluación académica [file:20][file:1].

## Uso del PRD para prompts

Este documento refinado puede usarse como base maestra para construir prompts específicos de implementación [file:20]. El orden recomendado es: modelo de datos, seguridad y autenticación, CRUD de productos, lógica de ventas e inventario, catálogo público y finalmente frontend React con integración a la API REST de Spring Boot [file:20][cite:7].
