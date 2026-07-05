<div align="center">

# AutoPart Pro 🔧

**Sistema web de gestión de inventario y ventas para repuestos automotrices, con módulo de e-commerce integrado.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[English version below ⬇️](#english)

</div>

---

## 📑 Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Roadmap](#pendiente-roadmap)

---

## Español

### Tecnologías

| Capa | Stack |
|---|---|
| **Backend** | Node.js · Express · MySQL · JWT |
| **Frontend** | React · Vite · Tailwind CSS |
| **Arquitectura** | REST API desacoplada · Patrón MVC · Autenticación por roles |

### Funcionalidades

- 🔐 Autenticación con JWT y roles (`admin`, `employee`, `client`)
- 📦 CRUD completo de productos con alertas de stock mínimo configurable
- 🛒 Carrito de compras y checkout con registro real de ventas
- 📉 Descuento automático de stock al completar una compra
- 📊 Historial de ventas con detalle por producto
- 👥 Gestión de usuarios y roles desde panel de administrador
- ⚡ Notificaciones de stock bajo en tiempo real (`EventEmitter`)
- 🖥️ Panel diferenciado por rol (admin/empleado/cliente)

### Instalación local

**Requisitos:** Node.js 18+, MySQL 8+

```bash
# Clonar el repositorio
git clone https://github.com/JFKoryy/autopart-pro.git
cd autopart-pro

# Backend
cd backend
npm install
# Crear archivo .env con las variables de entorno (ver abajo)
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

### Variables de entorno

**`/backend/.env`**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=autopart_pro
JWT_SECRET=tu_clave_secreta
FRONTEND_URL=http://localhost:5173
```

**`/frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Estructura del proyecto

```text
backend/src/
  config/        → conexión a MySQL
  models/        → queries SQL
  controllers/   → lógica de negocio
  middleware/    → auth, roles, validación
  routes/        → endpoints de la API
  events/        → EventEmitter para stock bajo

frontend/src/
  components/    → componentes reutilizables
  pages/         → vistas por módulo
  services/      → llamadas a la API
  context/       → AuthContext, CartContext
```

### Pendiente (roadmap)

- [ ] Despliegue en AWS (Elastic Beanstalk + RDS + S3 + CloudFront)
- [ ] Pipeline CI/CD con GitHub Actions
- [ ] Integración con pasarela de pagos (Wompi / Mercado Pago)
- [ ] Notificaciones en tiempo real al frontend (Socket.io + AWS Lambda)
- [ ] Monitoreo con CloudWatch y alertas de costos con AWS Budgets

---

## English

### Tech Stack

| Layer | Stack |
|---|---|
| **Backend** | Node.js · Express · MySQL · JWT |
| **Frontend** | React · Vite · Tailwind CSS |
| **Architecture** | Decoupled REST API · MVC pattern · Role-based authentication |

### Features

- 🔐 JWT authentication with roles (`admin`, `employee`, `client`)
- 📦 Full product CRUD with configurable minimum stock alerts
- 🛒 Shopping cart and checkout with real sales recording
- 📉 Automatic stock deduction on purchase completion
- 📊 Sales history with product-level detail
- 👥 User and role management from admin panel
- ⚡ Real-time low stock notifications (`EventEmitter`)
- 🖥️ Role-based dashboard (admin/employee/client)

### Local Setup

**Requirements:** Node.js 18+, MySQL 8+

```bash
# Clone the repository
git clone https://github.com/JFKoryy/autopart-pro.git
cd autopart-pro

# Backend
cd backend
npm install
# Create .env file with environment variables (see below)
npm run dev

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

**`/backend/.env`**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=autopart_pro
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

**`/frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Project Structure

```text
backend/src/
  config/        → MySQL connection
  models/        → SQL queries
  controllers/   → business logic
  middleware/    → auth, roles, validation
  routes/        → API endpoints
  events/        → EventEmitter for low stock

frontend/src/
  components/    → reusable components
  pages/         → module views
  services/      → API calls
  context/       → AuthContext, CartContext
```

### Roadmap

- [ ] AWS deployment (Elastic Beanstalk + RDS + S3 + CloudFront)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Payment gateway integration (Wompi / Mercado Pago)
- [ ] Real-time frontend notifications (Socket.io + AWS Lambda)
- [ ] Monitoring with CloudWatch and cost alerts with AWS Budgets
