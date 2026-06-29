# SIGA Modern — Sistema de Gestión Veterinaria

> Reconstrucción moderna del sistema SIGA (Sistema de Gestión de Animales) original, migrado de Java Swing desktop a una **aplicación web full-stack** con Spring Boot + React.

---

## 📋 Índice

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Roles y permisos](#roles-y-permisos)
- [Cómo ejecutar](#cómo-ejecutar)
- [Documentación](#documentación)
- [Autenticación](#autenticación)
- [Licencia](#licencia)

---

## Arquitectura

```
┌─────────────┐      HTTP       ┌─────────────┐      JDBC      ┌─────────────┐
│   Navegador  │ ◄────────────► │  React +    │                │             │
│  (Usuario)   │   (Puerto 80)  │   Vite      │                │             │
└─────────────┘                └─────────────┘                │   MySQL 8   │
                              │  Frontend   │                │  (Puerto    │
                              │   (Nginx)   │                │   3307)     │
                              └─────────────┘                └─────────────┘
                                     │
                                     │ HTTP (API REST)
                                     │
                              ┌─────────────┐
                              │ Spring Boot │
                              │   (Java 21) │
                              │  JWT + JPA  │
                              │ (Puerto 8080)│
                              └─────────────┘
```

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Java + Spring Boot | 3.2.5 / Java 21 |
| **Seguridad** | Spring Security + JWT | jjwt 0.12.5 |
| **Persistencia** | Spring Data JPA + Hibernate | — |
| **Base de datos** | MySQL | 8.0 |
| **Frontend** | React + TypeScript + Vite | 18 / 5 |
| **Estilos** | Tailwind CSS | 3.x |
| **Contenedores** | Docker + Docker Compose | — |
| **Build** | Maven (backend) / npm (frontend) | — |

---

## Estructura del proyecto

```
Siga1-modern/
├── backend/                 # Spring Boot 3 (Java 21)
│   ├── src/main/java/com/siga/
│   │   ├── config/          # SecurityConfig, JWT, CORS
│   │   ├── controller/      # REST Controllers (API v1)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities
│   │   ├── exception/       # GlobalExceptionHandler
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── security/        # UserDetails, UserDetailsService
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── data.sql         # Admin seed
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Layout, Sidebar, Navbar, DataTable, ProtectedRoute
│   │   ├── context/         # AuthContext (JWT, roles, Axios interceptor)
│   │   ├── pages/           # Login, Dashboard, CRUDs, Reportes, Perfil
│   │   ├── services/        # Axios API services
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml       # Orquesta: MySQL + Backend + Frontend
├── iniciar.bat              # 🚀 Inicia SIGA Modern
├── reconstruir.bat          # 🔄 Reconstruye todo sin cache
├── monitoreo.bat            # 📊 Verifica salud de servicios
├── ver-logs.bat             # 📋 Muestra logs en tiempo real
├── health-check.ps1         # PowerShell: health check automatico
├── instalar-dependencias.bat # 🔧 Script: instala Docker, Java, Node, Maven
├── actualizar-dependencias.bat # 🔄 Script: verifica y actualiza dependencias
├── verificar-e-instalar.ps1  # PowerShell: logica de instalacion
├── actualizar-dependencias.ps1 # PowerShell: logica de actualizacion
├── AGENT_SPEC.md            # Especificacion de arquitectura
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── setup.md
│   ├── roles.md
│   └── MONITOREO.md
└── README.md                # Este archivo
```

---

## Roles y permisos

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **ADMIN** | Administrador del sistema | Usuarios, doctores, alumnos, dueños, animales, consultas, derivaciones, retornos, exámenes, reportes |
| **DOCTOR** | Médico veterinario | Crear/editar consultas, derivaciones, retornos, exámenes. Ver animales y dueños. Editar su perfil. |
| **ALUMNO** | Estudiante / ayudante | Ver consultas y asistir en creación. Editar su perfil. No puede eliminar datos. |

> El primer usuario (`admin` / `admin123`) se crea automáticamente al iniciar la base de datos.

---

## Cómo ejecutar (Automático - Recomendado)

### 🚀 Opción 1: Todo automático (Primera vez)

Haz **doble clic** en:

```
instalar-dependencias.bat
```

Este script verifica e instala **todo automáticamente**:
- Docker Desktop (descarga + instala + configura WSL 2)
- Java 21 JDK (OpenJDK Temurin)
- Maven 3.9
- Node.js 20 LTS
- Git (opcional)

> **Nota**: Requiere permisos de Administrador. Si pide reiniciar, hazlo y luego ejecuta `iniciar.bat`.

### 🔄 Opción 2: Actualizar dependencias

Si ya tienes todo instalado y quieres verificar actualizaciones:

```
actualizar-dependencias.bat
```

### ▶️ Opción 3: Iniciar SIGA Modern (ya instalado)

```
iniciar.bat
```

Hace todo solo:
1. Verifica que Docker Desktop esté corriendo
2. Construye el backend Java + frontend React
3. Levanta MySQL, backend y frontend
4. Espera 15 segundos a que Spring Boot arranque
5. Abre automáticamente tu navegador en `http://localhost`
6. Muestra las credenciales en pantalla

> **Primera vez**: Tarda 5-10 minutos. No cierres la ventana.

### 🐳 Opción 4: Manual (Docker Compose)

Si prefieres hacerlo manualmente:

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

Acceso:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api/v1
- MySQL: localhost:3307 (root / root)

### 💻 Opción 5: Desarrollo local

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

---

## Documentación

Consulta la carpeta `docs/` para documentación detallada:

- [`docs/architecture.md`](docs/architecture.md) — Arquitectura y diseño técnico
- [`docs/api.md`](docs/api.md) — Referencia completa de la API REST
- [`docs/setup.md`](docs/setup.md) — Guía paso a paso de instalación y despliegue
- [`docs/roles.md`](docs/roles.md) — Matriz de roles y permisos detallada
- [`docs/MONITOREO.md`](docs/MONITOREO.md) — Sistema de monitoreo y health check

## Monitoreo

- **Manual**: Ejecutá `monitoreo.bat` para verificar el estado de todos los servicios
- **Logs**: Ejecutá `ver-logs.bat` para ver logs en tiempo real
- **Automático**: Un cron job revisa cada 5 minutos y te avisa si hay problemas
- **Local**: Programá `health-check.ps1` con Windows Task Scheduler

---

## Autenticación

El sistema utiliza **JWT (JSON Web Tokens)**.

1. **Login**: `POST /api/v1/auth/login` con `username` y `password`
2. **Token**: El backend devuelve un token JWT válido por 24 horas
3. **Uso**: Incluir el token en el header `Authorization: Bearer <token>` en todas las peticiones protegidas
4. **Roles**: El token contiene el rol del usuario. El frontend usa esto para mostrar/ocultar elementos de la UI

---

## Licencia

Este proyecto es una reconstrucción con fines educativos basada en el sistema original SIGA.

---

> **Nota**: El proyecto original se conserva intacto en `C:\Users\Leo\Downloads\CDIEM\Siga1`. Este nuevo proyecto (`Siga1-modern`) es una reescritura completa con tecnologías actuales.
