---
title: Sistema SIGA Modern
type: overview
tags: [architecture, overview, system]
created: 2026-07-01
updated: 2026-07-01
sources:
  - "[[AGENT_SPEC.md]]"
  - "[[README.md]]"
---

# Sistema SIGA Modern 🩺🐴🐾

**SIGA Modern** es una plataforma web veterinaria moderna diseñada para gestionar de forma integral una clínica veterinaria universitaria. Se trata de la reconstrucción y modernización de la aplicación de escritorio heredada Java Swing "Siga1" en una arquitectura web multicapa segura.

---

## 🏛️ Arquitectura del Sistema (Capas Core)

El sistema se divide en tres capas fundamentales, cada una de ellas documentada detalladamente:

1. **[[backend_architecture|Backend Layer]]**: Java 21, Spring Boot 3, Hibernate/JPA, y Spring Security + JWT. Controla la lógica de negocio y expone el API REST bajo `/api/v1`.
2. **[[frontend_architecture|Frontend Layer]]**: React 18, TypeScript, Vite, React Router DOM y Tailwind CSS. Proporciona una interfaz web premium y responsiva adaptada a diferentes roles.
3. **[[database_architecture|Database Layer]]**: Servidor MySQL 8 que gestiona la persistencia de relaciones clínicas y datos de usuarios/roles.

---

## 🧠 Módulos Funcionales (Estructura Cruzada)

El sistema está dividido en módulos lógicos que conectan la base de datos, el backend y el frontend:

*   **[[modulo_seguridad|Módulo de Seguridad y Control]]**: Autenticación JWT, cookies HttpOnly, sesiones inactivas y Rate Limiting.
*   **[[modulo_farmacia|Módulo de Farmacia y Medicamentos]]**: CRUD de inventario farmacéutico y deducción automática de stock en prescripciones.
*   **[[modulo_consultas|Módulo de Consultas y Fichas Clínicas]]**: Consultas, derivaciones, archivos de estudios médicos subidos, y línea de tiempo (historia clínica).
*   **[[modulo_animales_duenios|Módulo de Pacientes y Clientes]]**: Gestión multi-mascota, especies, razas, restricciones estrictas para alumnos.
*   **[[modulo_turnos|Módulo de Agenda y Turnos]]**: Calendario interactivo semanal y reserva de turnos por veterinario.
*   **[[modulo_examenes|Módulo de Exámenes de Laboratorio]]**: Resultados analíticos de Hemogramas, Química Clínica y Urianálisis.
*   **[[modulo_auditoria|Módulo de Logs y Auditoría]]**: Registro automatizado mediante AOP (AspectJ) y delegación granular de permisos.

---

## 🚦 Roles y Control de Acceso
El sistema implementa restricciones de roles a nivel de frontend (bloqueo de vistas) y backend (anotaciones `@PreAuthorize`):
*   **`ADMIN`**: Control total sobre el sistema, gestión de usuarios, edición de especies/razas, y visualización de auditorías.
*   **`DOCTOR`**: Control clínico. Puede gestionar consultas, recetas, turnos y ver inventario.
*   **`ALUMNO`**: Rol de consulta y asistencia. Acceso de **solo lectura** para animales y dueños, y creación asistida de consultas/turnos.
