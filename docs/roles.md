# Roles y permisos — SIGA Modern

## Resumen de roles

El sistema define **3 roles** jerárquicos:

1. **ADMIN** — Administrador del sistema
2. **DOCTOR** — Médico veterinario / docente
3. **ALUMNO** — Estudiante / ayudante

---

## ADMIN (Administrador)

### Descripción
El administrador tiene control total sobre el sistema. Es el único rol que puede crear usuarios y asignar roles.

### Permisos

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| **Usuarios** | ✅ | ✅ | ✅ | ✅ |
| **Doctores** | ✅ | ✅ | ✅ | ✅ |
| **Alumnos** | ✅ | ✅ | ✅ | ✅ |
| **Dueños** | ✅ | ✅ | ✅ | ✅ |
| **Animales** | ✅ | ✅ | ✅ | ✅ |
| **Especies/Razas** | ✅ | ✅ | ✅ | ✅ |
| **Consultas** | ✅ | ✅ | ✅ | ✅ |
| **Derivaciones** | ✅ | ✅ | ✅ | ✅ |
| **Retornos** | ✅ | ✅ | ✅ | ✅ |
| **Exámenes** | ✅ | ✅ | ✅ | ✅ |
| **Reportes** | ✅ | ✅ | ✅ | ✅ |
| **Perfil propio** | ✅ | ✅ | — | — |

### Acciones específicas
- Registrar nuevos usuarios (`POST /api/v1/auth/register`)
- Ver lista de todos los usuarios (`GET /api/v1/users`)
- Eliminar cualquier registro del sistema
- Acceder a estadísticas globales

---

## DOCTOR (Médico Veterinario)

### Descripción
El doctor es el rol principal de atención clínica. Puede crear consultas, derivaciones, retornos y exámenes de laboratorio.

### Permisos

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |
| **Doctores** | ✅ (lista) | ❌ | ❌ (solo propio) | ❌ |
| **Alumnos** | ✅ (lista) | ❌ | ❌ | ❌ |
| **Dueños** | ✅ | ✅ | ✅ | ❌ |
| **Animales** | ✅ | ✅ | ✅ | ❌ |
| **Especies/Razas** | ✅ | ❌ | ❌ | ❌ |
| **Consultas** | ✅ | ✅ | ✅ | ❌ |
| **Derivaciones** | ✅ | ✅ | ✅ | ❌ |
| **Retornos** | ✅ | ✅ | ✅ | ❌ |
| **Exámenes** | ✅ | ✅ | ✅ | ❌ |
| **Reportes** | ✅ (propios) | ❌ | ❌ | ❌ |
| **Perfil propio** | ✅ | ✅ | — | — |

### Acciones específicas
- Crear fichas clínicas completas
- Solicitar exámenes de laboratorio
- Derivar casos a otros especialistas
- Registrar retornos de pacientes
- Ver estadísticas de sus propias consultas

### Restricciones
- No puede crear/eliminar usuarios del sistema
- No puede eliminar registros (solo editar)
- No puede modificar perfiles de otros doctores

---

## ALUMNO (Estudiante / Ayudante)

### Descripción
El alumno tiene acceso de lectura y puede asistir en la creación de consultas, pero no tiene permisos de eliminación.

### Permisos

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |
| **Doctores** | ✅ (lista) | ❌ | ❌ | ❌ |
| **Alumnos** | ✅ (lista) | ❌ | ❌ (solo propio) | ❌ |
| **Dueños** | ✅ | ❌ | ❌ | ❌ |
| **Animales** | ✅ | ❌ | ❌ | ❌ |
| **Especies/Razas** | ✅ | ❌ | ❌ | ❌ |
| **Consultas** | ✅ | ✅ (asistir) | ❌ | ❌ |
| **Derivaciones** | ✅ | ❌ | ❌ | ❌ |
| **Retornos** | ✅ | ❌ | ❌ | ❌ |
| **Exámenes** | ✅ | ❌ | ❌ | ❌ |
| **Reportes** | ❌ | ❌ | ❌ | ❌ |
| **Perfil propio** | ✅ | ✅ | — | — |

### Acciones específicas
- Ver consultas y apoyar en su creación
- Ver animales y dueños
- Editar su propio perfil

### Restricciones
- No puede eliminar ningún dato
- No puede modificar datos de otros usuarios
- No puede ver reportes estadísticos
- No puede registrar derivaciones o retornos por sí solo (debe estar asociado a un doctor)

---

## Implementación técnica

### En el backend (Spring Security)

```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createUser(...) { ... }

@PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
public ResponseEntity<?> createConsulta(...) { ... }

@PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'ALUMNO')")
public ResponseEntity<?> getConsultas(...) { ... }
```

### En el frontend (React)

```tsx
// Ocultar botón de eliminar si no es ADMIN
{userRole === 'ADMIN' && (
  <button onClick={handleDelete}>Eliminar</button>
)}

// Proteger ruta de usuarios solo para ADMIN
<Route path="/usuarios" element={
  <ProtectedRoute requiredRole="ADMIN">
    <Usuarios />
  </ProtectedRoute>
} />
```

### Tabla de acceso a rutas del frontend

| Ruta | ADMIN | DOCTOR | ALUMNO |
|------|-------|--------|--------|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/duenios` | ✅ | ✅ | ✅ (solo ver) |
| `/animales` | ✅ | ✅ | ✅ (solo ver) |
| `/consultas` | ✅ | ✅ | ✅ |
| `/consultas/:id` | ✅ | ✅ | ✅ |
| `/examenes` | ✅ | ✅ | ✅ (solo ver) |
| `/derivaciones` | ✅ | ✅ | ✅ (solo ver) |
| `/retornos` | ✅ | ✅ | ✅ (solo ver) |
| `/usuarios` | ✅ | ❌ | ❌ |
| `/reportes` | ✅ | ✅ | ❌ |
| `/perfil` | ✅ | ✅ | ✅ |

---

## Usuario por defecto

Al iniciar el sistema por primera vez, se crea automáticamente:

| Campo | Valor |
|-------|-------|
| Username | `admin` |
| Email | `admin@siga.local` |
| Password | `admin123` |
| Role | `ADMIN` |
| Enabled | `true` |

> **Importante**: Cambiar la contraseña por defecto en producción.
