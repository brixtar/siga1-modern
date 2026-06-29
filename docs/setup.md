# Guía de instalación y despliegue — SIGA Modern

## Requisitos del sistema

- **Docker** (v20.10+) y **Docker Compose** (v2.0+)
- O alternativamente:
  - **Java 21** (JDK) + **Maven 3.9+**
  - **Node.js 20+** + **npm**
  - **MySQL 8**

---

## Opción 1: Docker Compose (recomendada, 5 minutos)

Desde la raíz del proyecto (`Siga1-modern/`):

```bash
docker-compose up --build
```

Esto construye y levanta 3 contenedores:
- **MySQL** en el puerto `3307` (interno `3306`)
- **Backend** en el puerto `8080`
- **Frontend** en el puerto `80` (Nginx)

### Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost | — |
| Backend API | http://localhost:8080/api/v1 | JWT requerido |
| MySQL | localhost:3307 | root / root |

### Primer login

Usuario: `admin`  
Contraseña: `admin123`

### Detener

```bash
docker-compose down
```

### Eliminar datos

```bash
docker-compose down -v
```

---

## Opción 2: Desarrollo local (Backend)

### 1. Crear la base de datos

```sql
CREATE DATABASE siga_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar variables

Editar `backend/src/main/resources/application.yml` si es necesario:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/siga_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Argentina/Buenos_Aires
    username: root
    password: tu_password
```

### 3. Ejecutar

```bash
cd backend
mvn spring-boot:run
```

El backend estará en: http://localhost:8080

---

## Opción 3: Desarrollo local (Frontend)

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

El frontend estará en: http://localhost:5173

### 3. Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para servir con Nginx.

---

## Estructura de archivos de configuración

### Backend (`application.yml`)

| Propiedad | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `spring.datasource.url` | URL JDBC de MySQL | `jdbc:mysql://localhost:3306/siga_db` |
| `spring.datasource.username` | Usuario MySQL | `root` |
| `spring.datasource.password` | Contraseña MySQL | `root` |
| `siga.jwt.secret` | Clave secreta JWT | `sigaSecretKey` |
| `siga.jwt.expiration` | Expiración del token (ms) | `86400000` (24h) |
| `cors.allowed-origins` | Orígenes permitidos CORS | `http://localhost:5173,http://localhost` |

### Frontend (`vite.config.ts`)

El proxy para desarrollo apunta a `http://localhost:8080`.

### Docker Compose

```yaml
services:
  db:
    image: mysql:8.0
    ports: 3307:3306
  backend:
    build: ./backend
    ports: 8080:8080
  frontend:
    build: ./frontend
    ports: 80:80
```

---

## Solución de problemas

### Error: "Connection refused" al backend

Verifica que el backend esté corriendo y que el CORS permita el origen del frontend.

### Error: "Access denied" en MySQL

Verifica que las credenciales en `application.yml` coincidan con tu instancia de MySQL.

### Error: "Table doesn't exist"

`spring.jpa.hibernate.ddl-auto` está en `update` en `application.yml`. Si necesitas recrear todo, cámbialo a `create` (pero **no en producción**).

### Error: "Invalid JWT"

El token expiró (24h). Vuelve a iniciar sesión en el frontend.

### Puerto 3307 en lugar de 3306

Se usa `3307` externo para evitar conflictos con una instalación local de MySQL. Si no tienes MySQL local, puedes cambiarlo a `3306:3306`.

---

## Despliegue en producción (checklist)

1. [ ] Cambiar `siga.jwt.secret` a un valor aleatorio largo (32+ caracteres)
2. [ ] Cambiar contraseña del admin por defecto
3. [ ] Usar `ddl-auto: validate` o Flyway en lugar de `update`
4. [ ] Configurar SSL/TLS en Nginx
5. [ ] Cambiar credenciales de MySQL
6. [ ] Usar variables de entorno en lugar de hardcodear secrets
7. [ ] Desactivar `show-sql: true` en JPA
8. [ ] Configurar backups automáticos de la base de datos
