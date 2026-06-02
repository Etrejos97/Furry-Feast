# 🐾 Furry Feast — Sistema de Gestión para Tienda de Mascotas

> MVP académico desarrollado con **Spring Boot 3** + **React + Vite**, implementando arquitectura cliente-servidor con autenticación JWT, CRUD completo de inventario y registro de ventas.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Credenciales de Acceso](#-credenciales-de-acceso)
- [Funcionalidades](#-funcionalidades)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints API](#-endpoints-api)
- [Documentación](#-documentación)

---

## 📖 Descripción

**Furry Feast** es un sistema web de gestión para una tienda de productos para mascotas. Permite al administrador controlar el inventario, registrar ventas en una terminal de punto de venta y monitorear alertas de stock bajo, mientras los clientes pueden explorar el catálogo público sin necesidad de autenticación.

---

## 🛠 Tecnologías

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.2.5 | Framework principal |
| Spring Security | 6 | Autenticación y autorización |
| Spring Data JPA | 3.2.5 | Persistencia de datos |
| H2 Database | Runtime | Base de datos embebida (modo archivo) |
| JWT (jjwt) | 0.12.5 | Tokens de autenticación |
| Lombok | Latest | Reducción de boilerplate |
| SpringDoc OpenAPI | 2.5.0 | Documentación Swagger |
| Maven | 3+ | Gestión de dependencias |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI library |
| Vite | 6 | Build tool y dev server |
| React Router DOM | 7 | Navegación SPA |
| JavaScript ES6+ | — | Lenguaje principal |

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────┐
│              CLIENTE (Browser)              │
│         React + Vite  :5173                 │
│                                             │
│  Catálogo Público ──► Sin autenticación     │
│  Panel Admin       ──► JWT Bearer Token     │
└────────────────────┬────────────────────────┘
                     │ HTTP REST (JSON)
                     │ CORS habilitado
┌────────────────────▼────────────────────────┐
│           SERVIDOR (Spring Boot)            │
│                  :8080                      │
│                                             │
│  /api/auth      ──► Autenticación JWT       │
│  /api/productos ──► CRUD + Alertas stock    │
│  /api/ventas    ──► Registro transacciones  │
└────────────────────┬────────────────────────┘
                     │ JPA / Hibernate
┌────────────────────▼────────────────────────┐
│           H2 Database (modo archivo)        │
│         ./data/furryfeast.mv.db             │
└─────────────────────────────────────────────┘
```

---

## ✅ Requisitos Previos

- **Java 21** — [Descargar](https://adoptium.net/)
- **Maven 3.8+** — [Descargar](https://maven.apache.org/)
- **Node.js 18+** — [Descargar](https://nodejs.org/)
- **Git** — [Descargar](https://git-scm.com/)

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Etrejos97/Furry-Feast.git
cd Furry-Feast
```

### 2. Iniciar el Backend

```bash
cd backend
mvn spring-boot:run
```

> El servidor arranca en `http://localhost:8080`
> La base de datos H2 se crea automáticamente en `backend/data/furryfeast.mv.db`
> Los datos de prueba se cargan automáticamente desde `data.sql`

### 3. Iniciar el Frontend

En una **nueva terminal**:

```bash
cd frontend
npm install
npm run dev
```

> La aplicación abre en `http://localhost:5173`

---

## 🔑 Credenciales de Acceso

| Rol | Email | Contraseña |
|---|---|---|
| 👑 Administrador | `admin@furryfeast.com` | `admin123Password` |
| 👤 Cliente | `cliente@correo.com` | `cliente123Password` |
| 👤 Cliente 2 | `maria@correo.com` | `maria123Password` |

---

## ✨ Funcionalidades

### Catálogo Público (sin login)
- 🛍️ Visualización de productos activos con imagen, precio y descripción
- 🔍 Filtrado por categoría (Alimentos, Medicamentos, Accesorios, Cuidado)
- 🔎 Búsqueda por nombre de producto
- 📄 Paginación de resultados

### Panel Administrador
- 📊 **Dashboard** — KPIs en tiempo real: productos activos, agotados críticos, ventas totales
- ⚠️ **Alertas de stock** — Lista de productos con inventario igual o inferior al mínimo configurado
- 📦 **Inventario** — CRUD completo de productos con vista previa de imagen
- 🛒 **Terminal de Ventas** — Registro de ventas con descuento automático de stock
- 🔒 Rutas protegidas por rol con JWT

---

## 📁 Estructura del Proyecto

```
Furry-Feast/
├── backend/                        # Spring Boot API
│   └── src/main/java/com/furryfeast/
│       ├── config/                 # CORS, JWT, Security
│       ├── controller/             # REST Controllers
│       ├── dto/                    # Data Transfer Objects
│       ├── exception/              # Manejo global de errores
│       ├── model/                  # Entidades JPA
│       ├── repository/             # Spring Data Repositories
│       ├── security/               # Filtros JWT
│       └── service/                # Lógica de negocio
│   └── src/main/resources/
│       ├── application.properties  # Configuración
│       └── data.sql                # Datos semilla
│
├── frontend/                       # React + Vite SPA
│   └── src/
│       ├── components/             # Componentes reutilizables
│       ├── context/                # AuthContext (JWT)
│       ├── layouts/                # AdminLayout, PublicLayout
│       ├── pages/
│       │   ├── admin/              # Dashboard, Inventario, Ventas
│       │   └── public/             # Catálogo, Login
│       └── services/               # Clientes API REST
│
└── docs/                           # Documentación del proyecto
    ├── mockups/                    # Diseños iniciales (Stitch)
    ├── arquitectura_frontend_v2.md
    ├── fase4_validacion.md
    └── furry-feast-prd.md
```

---

## 🔌 Endpoints API

### Autenticación
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión, retorna JWT | ❌ |

### Productos
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/productos` | Listar productos (paginado, filtros) | ❌ |
| GET | `/api/productos/{id}` | Obtener producto por ID | ❌ |
| POST | `/api/productos` | Crear producto | 👑 Admin |
| PUT | `/api/productos/{id}` | Actualizar producto | 👑 Admin |
| PATCH | `/api/productos/{id}/desactivar` | Desactivar producto | 👑 Admin |
| GET | `/api/productos/alertas` | Productos con stock bajo | 👑 Admin |

### Ventas
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/ventas` | Listar todas las ventas | 👑 Admin |
| POST | `/api/ventas` | Registrar nueva venta | 👑 Admin |

> 📖 Documentación interactiva completa disponible en: `http://localhost:8080/swagger-ui.html`

---

## 📚 Documentación

| Documento | Descripción |
|---|---|
| [`docs/furry-feast-prd.md`](docs/furry-feast-prd.md) | Product Requirements Document |
| [`docs/arquitectura_frontend_v2.md`](docs/arquitectura_frontend_v2.md) | Arquitectura detallada del frontend |
| [`docs/fase4_validacion.md`](docs/fase4_validacion.md) | Plan de validación y pruebas |
| [`docs/mockups/`](docs/mockups/) | Mockups del diseño inicial |

---

<div align="center">
  <p>Desarrollado como proyecto académico — 2025</p>
  <p>🐶 🐱 🐾</p>
</div>
