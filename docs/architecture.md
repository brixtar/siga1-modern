# Arquitectura SIGA Modern

## Visión general

SIGA Modern sigue una arquitectura **cliente-servidor** con separación clara entre frontend, backend y base de datos.

```
┌─────────────────────────────────────────┐
│           Capa de Presentación          │
│         React 18 + TypeScript          │
│         Tailwind CSS + Vite            │
│              (Nginx)                    │
└─────────────────────────────────────────┘
                   │
                   │ HTTP / REST / JSON
                   │
┌─────────────────────────────────────────┐
│           Capa de Aplicación           │
│       Spring Boot 3 (Java 21)          │
│    Spring Security + JWT + JPA         │
│              (Tomcat)                   │
└─────────────────────────────────────────┘
                   │
                   │ JDBC / SQL
                   │
┌─────────────────────────────────────────┐
│           Capa de Datos               │
│              MySQL 8                   │
│         (InnoDB / Docker)             │
└─────────────────────────────────────────┘
```

## Principios de diseño

1. **Separación de responsabilidades**: Cada capa tiene una única responsabilidad
2. **Seguridad por diseño**: JWT, BCrypt, CORS, role-based access control
3. **API RESTful**: Stateless, JSON, HTTP status codes semánticos
4. **Containerización**: Docker Compose para orquestación local
5. **Sin estado en el servidor**: La sesión vive en el JWT del cliente

## Capas del backend

```
Controller → DTO → Service → Repository → Entity → DB
   │                              │
   └───── Exception Handler ──────┘
   │
   └───── Spring Security (JWT Filter)
```

| Capa | Responsabilidad |
|------|-----------------|
| **Controller** | Recibir peticiones HTTP, validar DTOs, devolver ResponseEntity |
| **DTO** | Definir la forma de los datos que entran/salen de la API |
| **Service** | Lógica de negocio, transacciones, validaciones de dominio |
| **Repository** | Acceso a datos mediante Spring Data JPA |
| **Entity** | Mapeo objeto-relacional con Hibernate |
| **Security** | Autenticación JWT, autorización por roles |

## Modelo de datos (simplificado)

```
[users] ───┬─── [doctor]
           ├─── [alumno]
           │
[duenio] ──┬─── [animal] ───┬─── [consulta] ───┬─── [derivacion]
           │     │          │                   │
           │     │          ├─── [retorno]      │
           │     │          │                   │
           │     │          ├─── [urianalisis]  │
           │     │          ├─── [quimica_clinica]│
           │     │          └─── [hemograma]     │
           │     │                              │
           │   [especie] ─── [raza]             │
```

## Seguridad

- **Autenticación**: JWT con expiración de 24h
- **Autorización**: `@PreAuthorize("hasRole('ADMIN')")` en endpoints sensibles
- **Contraseñas**: BCrypt con fuerza 10
- **CORS**: Configurado para orígenes `localhost:5173` (dev) y `localhost` (prod)
- **SQL Injection**: Eliminada mediante JPA/Hibernate (no hay SQL crudo)

## Escalabilidad futura

- El backend es stateless, permite horizontal scaling
- El frontend es un SPA estático, sirve desde CDN
- La base de datos puede migrarse a RDS/Cloud SQL sin cambios de código
- Se puede agregar un API Gateway (Spring Cloud Gateway) en el futuro
