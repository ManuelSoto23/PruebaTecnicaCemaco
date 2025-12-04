# Plataforma de Gestión de Productos - Cemaco

Plataforma completa para gestión de productos con dos vistas: administrador y usuario público. Proyecto desarrollado siguiendo las mejores prácticas de Clean Code, con arquitectura por capas y diseño Pixel Perfect.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Documentación Swagger](#documentación-swagger)
- [Roles y Permisos](#roles-y-permisos)
- [Características del Producto](#características-del-producto)
- [Mejoras Futuras](#mejoras-futuras)
- [Notas del Proyecto](#notas-del-proyecto)

---

## 🎯 Características

### Backend (Node.js + Express + SQL Server)

- ✅ API RESTful con arquitectura por capas
- ✅ Autenticación JWT basada en roles
- ✅ CRUD completo de productos
- ✅ Sistema de roles: Administrador y Colaborador
- ✅ Subida de imágenes para productos (múltiples imágenes por producto)
- ✅ Base de datos SQL Server
- ✅ Documentación Swagger/OpenAPI
- ✅ Manejo de errores global
- ✅ Validación de datos
- ✅ Protección contra SQL Injection
- ✅ Servicios reutilizables (productImageService, fileService)

### Frontend (React)

- ✅ Vista pública de productos (solo productos con inventario > 5)
- ✅ Panel de administración con CRUD de productos
- ✅ Sistema de autenticación con Context API
- ✅ Header y Footer estilo Cemaco
- ✅ Diseño responsive con colores corporativos (#101e8d y #91d202)
- ✅ Diseño Pixel Perfect implementado
- ✅ Paginación y búsqueda
- ✅ Validación de formularios con Yup
- ✅ Hooks personalizados para lógica reutilizable
- ✅ Manejo de errores centralizado

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web
- **SQL Server** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Swagger/OpenAPI** - Documentación de API

### Frontend

- **React** - Biblioteca de UI
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento
- **Yup** - Validación de formularios

---

## 🏗️ Arquitectura

### Arquitectura del Backend

El backend sigue una **arquitectura por capas (Layered Architecture)**:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← Definición de endpoints y Swagger
├─────────────────────────────────────┤
│      Middleware Layer               │  ← Autenticación, autorización, errores
├─────────────────────────────────────┤
│      Controllers Layer              │  ← Lógica de negocio y orquestación
├─────────────────────────────────────┤
│        Services Layer               │  ← Lógica reutilizable (imágenes, archivos)
├─────────────────────────────────────┤
│        Database Layer               │  ← Acceso a datos (SQL Server)
└─────────────────────────────────────┘
```

**Flujo de datos:**

1. **Routes** → Define endpoints y documentación Swagger
2. **Middleware** → Valida autenticación y autorización
3. **Controllers** → Orquesta la lógica de negocio
4. **Services** → Ejecuta operaciones reutilizables
5. **Database** → Accede a SQL Server con queries parametrizadas

**Principios aplicados:**

- ✅ Separación de responsabilidades (SRP)
- ✅ DRY (Don't Repeat Yourself)
- ✅ Protección contra SQL Injection
- ✅ Manejo de errores centralizado

### Arquitectura del Frontend

El frontend sigue una **arquitectura basada en componentes con hooks personalizados**:

```
┌─────────────────────────────────────┐
│         Pages Layer                  │  ← Páginas principales (AdminProducts, PublicProducts)
├─────────────────────────────────────┤
│      Components Layer                │  ← Componentes reutilizables (Header, Footer, ProductForm)
├─────────────────────────────────────┤
│        Hooks Layer                   │  ← Lógica de negocio reutilizable (useProducts, useProductForm)
├─────────────────────────────────────┤
│        Services Layer                │  ← Comunicación con API (api.js)
├─────────────────────────────────────┤
│        Utils Layer                   │  ← Utilidades (productUtils, productValidation)
├─────────────────────────────────────┤
│        Context Layer                 │  ← Estado global (AuthContext)
└─────────────────────────────────────┘
```

**Flujo de datos:**

1. **Pages** → Renderiza componentes y usa hooks
2. **Components** → Presentación y UI
3. **Hooks** → Lógica de negocio y estado
4. **Services** → Llamadas a API
5. **Utils** → Funciones auxiliares
6. **Context** → Estado global (autenticación)

**Principios aplicados:**

- ✅ Componentes funcionales con Hooks
- ✅ Custom Hooks para lógica reutilizable
- ✅ Context API para estado global
- ✅ Separación de concerns
- ✅ Validación centralizada

---

## 📁 Estructura del Proyecto

### Estructura del Backend

```
server/
├── config/                    # Configuración
│   ├── constants.js          # Constantes centralizadas (PRODUCT, PAGINATION, FILE_UPLOAD)
│   ├── database.js           # Configuración de conexión a SQL Server
│   └── database.init.js      # Inicialización de tablas y usuarios por defecto
├── controllers/              # Controladores (Lógica de negocio)
│   ├── auth.controller.js    # Autenticación (login, getCurrentUser)
│   ├── product.controller.js # CRUD de productos (admin)
│   └── public.controller.js  # Productos públicos
├── middleware/                # Middlewares
│   ├── auth.middleware.js    # Autenticación JWT y autorización por roles
│   └── errorHandler.js       # Manejo global de errores
├── routes/                    # Rutas de la API
│   ├── auth.routes.js        # Rutas de autenticación
│   ├── product.routes.js     # Rutas de productos (admin) con Swagger
│   └── public.routes.js      # Rutas públicas con Swagger
├── services/                  # Servicios reutilizables
│   ├── productImageService.js # Lógica de imágenes de productos
│   └── fileService.js        # Manejo de archivos
├── uploads/                  # Archivos subidos (imágenes)
├── index.js                  # Punto de entrada del servidor
├── database.sql              # Script SQL manual (opcional)
├── env.example               # Ejemplo de variables de entorno
└── package.json              # Dependencias del proyecto
```

### Estructura del Frontend

```
client/
├── public/                   # Archivos estáticos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── BCorpSection.js  # Sección B Corp
│   │   ├── Footer.js        # Footer de la aplicación
│   │   ├── Header.js        # Header con navegación y búsqueda
│   │   ├── ImageDropBox.js  # Componente drag & drop para imágenes
│   │   ├── PrivateRoute.js  # Ruta protegida
│   │   ├── ProductForm.js   # Formulario de productos
│   │   ├── ProductFormFields.js # Campos del formulario
│   │   └── ProductList.js   # Lista de productos
│   ├── constants/           # Constantes centralizadas
│   │   └── config.js       # API_BASE_URL, PAGINATION, VALIDATION
│   ├── context/             # Context API
│   │   └── AuthContext.js   # Context de autenticación
│   ├── hooks/               # Custom Hooks
│   │   ├── useErrorHandler.js # Manejo de errores
│   │   ├── usePagination.js  # Lógica de paginación
│   │   ├── useProductForm.js # Lógica del formulario de productos
│   │   └── useProducts.js   # Lógica de productos (fetch, delete, etc.)
│   ├── pages/               # Páginas principales
│   │   ├── AdminProducts.js # Panel de administración
│   │   ├── Login.js         # Página de login
│   │   ├── ProductDetail.js # Detalle de producto
│   │   └── PublicProducts.js # Vista pública de productos
│   ├── services/            # Servicios
│   │   └── api.js           # Configuración de Axios
│   ├── utils/               # Utilidades
│   │   ├── productUtils.js  # Utilidades de productos (imágenes, URLs)
│   │   └── productValidation.js # Schema de validación Yup
│   ├── App.js               # Componente principal con rutas
│   ├── App.css              # Estilos globales
│   ├── index.js             # Punto de entrada
│   └── index.css            # Estilos base
└── package.json             # Dependencias del proyecto
```

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** (v14 o superior) - [Descargar Node.js](https://nodejs.org/)
- **SQL Server** (MSSMS) - [Descargar SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads)
- **npm** o **yarn** (incluido con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

   ```bash
   git clone <repository-url>
   cd PruebaTecniaCemaco
   ```

2. **Instalar dependencias del proyecto**

   ```bash
   # Instalar dependencias de backend y frontend simultáneamente
   npm run install-all
   ```

   O instalar por separado:

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Configurar base de datos**

   - Crear una base de datos en SQL Server llamada `CemacoDB`
   - Copiar `server/env.example` a `server/.env`
   - Editar `server/.env` con tus credenciales:

   ```env
   DB_SERVER=localhost
   DB_DATABASE=CemacoDB
   DB_PORT=1433
   DB_USER=sa
   DB_PASSWORD=TuContraseña
   DB_ENCRYPT=true
   DB_TRUST_CERT=true
   JWT_SECRET=tu-secret-key-segura-y-muy-larga-cambiar-en-produccion
   JWT_EXPIRES_IN=24h
   PORT=5000
   NODE_ENV=development
   ```

   **Nota:** Si usas Windows Authentication, puedes omitir `DB_USER` y `DB_PASSWORD`.

4. **Inicializar la base de datos**

   - El servidor creará automáticamente las tablas al iniciar
   - Se crearán usuarios por defecto:
     - **Administrador:**
       - Usuario: `admin`
       - Contraseña: `admin123`
     - **Colaborador:**
       - Usuario: `colaborador`
       - Contraseña: `colaborador123`

5. **Configurar variables de entorno del Frontend (Opcional)**

   El archivo `.env` en la raíz de `client/` puede contener:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   **Nota:** Si no se configura, el frontend usará `http://localhost:5000` por defecto.

---

## ▶️ Ejecución

### Desarrollo (Backend y Frontend simultáneamente)

```bash
npm run dev
```

Esto iniciará:

- Backend en `http://localhost:5000`
- Frontend en `http://localhost:3000`

### Solo Backend

```bash
npm run server
# O desde la carpeta server:
cd server
npm run dev
```

### Solo Frontend

```bash
npm run client
# O desde la carpeta client:
cd client
npm start
```

### Producción

```bash
# Backend
cd server
npm start

# Frontend (construir)
cd client
npm run build
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Autenticación

| Método | Endpoint      | Descripción                        | Autenticación     |
| ------ | ------------- | ---------------------------------- | ----------------- |
| `POST` | `/auth/login` | Iniciar sesión y obtener token JWT | No                |
| `GET`  | `/auth/me`    | Obtener usuario actual             | Sí (Bearer Token) |

### Productos (Admin - Requieren Autenticación)

| Método   | Endpoint        | Descripción                           | Autenticación | Roles              |
| -------- | --------------- | ------------------------------------- | ------------- | ------------------ |
| `GET`    | `/products`     | Listar todos los productos (paginado) | Sí            | Admin, Colaborador |
| `GET`    | `/products/:id` | Obtener producto por ID               | Sí            | Admin, Colaborador |
| `POST`   | `/products`     | Crear nuevo producto                  | Sí            | Admin, Colaborador |
| `PUT`    | `/products/:id` | Actualizar producto                   | Sí            | Admin, Colaborador |
| `DELETE` | `/products/:id` | Eliminar producto                     | Sí            | Solo Admin         |

**Query Parameters (GET /products):**

- `page` (opcional): Número de página (default: 1)
- `pageSize` (opcional): Productos por página (default: 8)
- `q` (opcional): Búsqueda por nombre o SKU

### Productos Públicos (No requieren autenticación)

| Método | Endpoint               | Descripción                                | Autenticación |
| ------ | ---------------------- | ------------------------------------------ | ------------- |
| `GET`  | `/public/products`     | Listar productos públicos (inventario > 5) | No            |
| `GET`  | `/public/products/:id` | Obtener detalle de producto público        | No            |

**Query Parameters (GET /public/products):**

- `page` (opcional): Número de página (default: 1)
- `pageSize` (opcional): Productos por página (default: 8)
- `q` (opcional): Búsqueda por nombre o SKU

### Health Check

| Método | Endpoint      | Descripción                   |
| ------ | ------------- | ----------------------------- |
| `GET`  | `/api/health` | Verificar estado del servidor |

---

## 📚 Documentación Swagger

El proyecto incluye documentación completa de la API usando **Swagger/OpenAPI 3.0**.

### Acceder a Swagger UI

Una vez que el servidor esté ejecutándose, accede a:

```
http://localhost:5000/api-docs
```

### Características de Swagger

- ✅ Documentación interactiva de todos los endpoints
- ✅ Pruebas de endpoints directamente desde el navegador
- ✅ Esquemas de request/response
- ✅ Autenticación Bearer Token integrada
- ✅ Ejemplos de uso
- ✅ Tags organizados por funcionalidad:
  - Autenticación
  - Productos (admin)
  - Productos públicos

### Uso de Swagger

1. Abre `http://localhost:5000/api-docs` en tu navegador
2. Para probar endpoints protegidos:
   - Primero ejecuta `/api/auth/login` para obtener un token
   - Haz clic en el botón "Authorize" (🔒) en la parte superior
   - Ingresa: `Bearer <tu-token>`
   - Ahora puedes probar los endpoints protegidos

---

## 👥 Roles y Permisos

### Administrador

**Permisos completos:**

- ✅ Crear productos
- ✅ Actualizar productos
- ✅ Eliminar productos
- ✅ Ver todos los productos (incluso con inventario ≤ 5)
- ✅ Gestionar imágenes de productos

**Usuario por defecto:**

- Usuario: `admin`
- Contraseña: `admin123`

### Colaborador

**Permisos limitados:**

- ✅ Crear productos
- ✅ Actualizar productos
- ✅ Ver todos los productos (incluso con inventario ≤ 5)
- ❌ **NO puede eliminar productos**

**Usuario por defecto:**

- Usuario: `colaborador`
- Contraseña: `colaborador123`

### Usuario Público (Sin autenticación)

**Permisos de solo lectura:**

- ✅ Ver productos con inventario > 5
- ✅ Ver detalle de productos públicos
- ❌ No puede crear, editar o eliminar productos

---

## 🎨 Características del Producto

Cada producto incluye:

- **Nombre** (requerido, 3-255 caracteres)
- **Descripción** (requerida, 15-2000 caracteres)
- **Precio** (requerido, máximo 999,999.99)
- **SKU** (requerido, único, 3-15 caracteres, solo números)
- **Inventario** (requerido, 0-10,000 unidades)
- **Imágenes** (opcional, hasta 10 imágenes por producto)
  - Formatos permitidos: jpeg, jpg, png, gif, webp
  - Tamaño máximo: 5MB por imagen
  - Se puede definir una imagen principal

---

## 🚀 Mejoras Futuras

### 1. UI/UX - Material-UI (MUI)

**Recomendación:** Implementar Material-UI para mejorar la consistencia visual y reducir el código CSS.

**Beneficios:**

- Componentes pre-construidos y accesibles
- Temas personalizables
- Mejor experiencia de usuario
- Menos código CSS personalizado

### 2. Optimización de Rendimiento

#### Memoización (React.memo, useMemo, useCallback)

**Áreas a optimizar:**

- Componentes de lista (`ProductList`, `ProductCard`)
- Funciones de cálculo costosas
- Callbacks que se pasan como props

#### Debounce en Búsqueda

Retrasar las peticiones de búsqueda hasta que el usuario termine de escribir, reduciendo llamadas innecesarias a la API y mejorando el rendimiento.

#### Lazy Loading de Componentes

Cargar componentes solo cuando son necesarios, reduciendo el tiempo de carga inicial de la aplicación y mejorando el rendimiento.

#### Code Splitting

- Separar rutas en chunks
- Cargar componentes bajo demanda
- Reducir bundle inicial

### 3. Plan de Optimización

#### Frontend

1. **Bundle Analysis**

   ```bash
   npm install --save-dev webpack-bundle-analyzer
   ```

2. **Image Optimization**

   - Implementar lazy loading de imágenes
   - Usar formatos modernos (WebP, AVIF)
   - Compresión de imágenes

3. **Caching**

   - Service Workers para cache offline
   - Cache de API responses
   - LocalStorage para datos frecuentes

4. **Virtual Scrolling**
   - Para listas grandes de productos
   - Usar `react-window` o `react-virtualized`

#### Backend

1. **Caching**

   - Redis para cache de queries frecuentes
   - Cache de imágenes procesadas

2. **Database Optimization**

   - Índices en columnas frecuentemente consultadas
   - Query optimization
   - Connection pooling (ya implementado)

3. **Compression**

   - Gzip/Brotli compression
   - Optimización de respuestas JSON

4. **Rate Limiting**
   - Protección contra abuso de API
   - Límites por usuario/IP

---

## 📝 Notas del Proyecto

### Diseño Pixel Perfect

✅ **Implementado:** El diseño ha sido desarrollado siguiendo las especificaciones de diseño Pixel Perfect, asegurando que cada elemento visual coincida exactamente con el diseño proporcionado.

**Características implementadas:**

- Colores corporativos exactos (#101e8d y #91d202)
- Espaciado y tipografía precisos
- Componentes alineados según especificaciones
- Responsive design manteniendo fidelidad al diseño

### Clean Code

✅ **Aplicado:** El proyecto sigue los principios de Clean Code:

- ✅ **DRY (Don't Repeat Yourself)** - Servicios y hooks reutilizables
- ✅ **Single Responsibility** - Cada archivo tiene una responsabilidad única
- ✅ **Nombres descriptivos** - Código auto-documentado
- ✅ **Funciones pequeñas** - Funciones enfocadas y manejables
- ✅ **Separación de concerns** - Lógica separada de presentación

### Arquitectura

✅ **Backend:** Arquitectura por capas bien definida
✅ **Frontend:** Arquitectura basada en componentes con hooks personalizados
✅ **Servicios reutilizables** en ambos lados
✅ **Manejo de errores centralizado**

### Puertos

- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:5000`
- **Swagger:** `http://localhost:5000/api-docs`

---
