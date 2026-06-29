# SIGA Modern — Agent Specification

## User Goal
Rebuild the legacy Java Swing desktop app "Siga1" (veterinary clinic management system) into a modern web application with:
- Java Spring Boot 3 backend + React TypeScript frontend
- MySQL database
- Docker Compose deployment
- Role-based access control: **ADMIN**, **DOCTOR**, **ALUMNO** (student)
- All features documented

## Non-Goals
- Do not modify the original project at `C:\Users\Leo\Downloads\CDIEM\Siga1`
- No mobile native app (web responsive only)
- No real-time notifications for now

## Shared Contract

### Stack
- **Backend**: Java 21, Spring Boot 3.2+, Maven, Spring Security + JWT, Spring Data JPA, MySQL 8
- **Frontend**: React 18 + TypeScript + Vite, React Router DOM, Axios, Tailwind CSS
- **Database**: MySQL 8 (dockerized)
- **Container**: Docker Compose (app + db)

### Database Schema (simplified from original)
Tables to implement:
- `users` (id, username, email, password, role, enabled, created_at) — shared login table
- `doctor` (id, user_id, dni, nombre, apellido, email, matricula, domicilio, ciudad, telefono_celular, telefono_fijo)
- `alumno` (id, user_id, dni, nombre, apellido, email, matricula, domicilio, ciudad, telefono_celular, telefono_fijo)
- `duenio` (id, dni, nombre, apellido, email, facebook, domicilio, ciudad, telefono_fijo, telefono_celular)
- `lista_especie` (id, especie)
- `lista_raza` (id, especie_id, raza)
- `animal_pequenio` / `animal_grande` (id, nombre, especie_id, raza_id, peso, nacimiento, sexo, color, duenio_id, vivo)
- `consulta` (id, caso_clinico, fecha, animal_id, doctor_id, alumno_id, motivo, anamnesis, signos vitales, exploración por sistemas, diagnostico_presuntivo, diagnostico_diferencial, diagnostico_pronostico, tratamiento, indicaciones)
- `derivacion` (id, fecha, animal_id, doctor_id, alumno_id, anamnesis, sistema, indicaciones)
- `retorno` (id, consulta_id, fecha, animal_id, doctor_id, alumno_id, anamnesis, signos vitales, indicaciones)
- `urianalisis` (id, protocolo_lab, fecha, consulta_id, animal_id, doctor_id, color, aspecto, densidad, ph, proteina, urobilinogeno, glucosa, c_cetonicos, leucocitos, nitritos, sangre_oculta, pig_biliares, observaciones, sedimento fields)
- `quimica_clinica` (id, protocolo_lab, fecha, consulta_id, animal_id, doctor_id, glucemia, uremia, creatininemia, fosfatemia, albuminemia, got, gpt, cpk, ldh, observaciones)
- `hemograma` (id, protocolo_lab, fecha, consulta_id, animal_id, doctor_id, eritrocitos, hemoglobina, hematocrito, vcm, hcm, chcm, reticulocitos, ipr, leucocitos, formula leucocitaria, observaciones)

### API Contract
Base path: `/api/v1`
- Auth: `POST /api/v1/auth/login`, `POST /api/v1/auth/register` (ADMIN only registers users)
- Users: CRUD under `/api/v1/users` (ADMIN)
- Doctores: `/api/v1/doctores`
- Alumnos: `/api/v1/alumnos`
- Duenios: `/api/v1/duenios`
- Animales (pequenios + grandes): `/api/v1/animales`
- Especies/Razas: `/api/v1/especies`, `/api/v1/razas`
- Consultas: `/api/v1/consultas`
- Derivaciones: `/api/v1/derivaciones`
- Retornos: `/api/v1/retornos`
- Examenes: `/api/v1/examenes/urianalisis`, `/api/v1/examenes/quimica`, `/api/v1/examenes/hemograma`
- Reportes: `/api/v1/reportes/estadisticas`

### Roles & Permissions
- **ADMIN**: full access to everything. Can create users. Can view all data.
- **DOCTOR**: can create/edit consultations, derivaciones, retornos, examenes. Can view all animals and duenios. Can edit their own profile.
- **ALUMNO**: can view consultations and assist in creating them. Can edit their own profile. Cannot delete data.

### JWT Contract
- Issued at login. Header: `Authorization: Bearer <token>`
- Claims: `sub` (username), `roles` (array), `iat`, `exp` (24h)

### Frontend Routes
- `/login` — Login page
- `/dashboard` — Admin dashboard (stats, quick actions)
- `/duenios` — CRUD dueños
- `/animales` — CRUD animales
- `/consultas` — List and create consultations
- `/consultas/:id` — Consulta detail
- `/examenes` — List examenes (tabs: hemograma, quimica, urianalisis)
- `/derivaciones` — List derivaciones
- `/retornos` — List retornos
- `/usuarios` — User management (ADMIN only)
- `/reportes` — Statistics and reports
- `/perfil` — Own profile

## Task Slices

### Worker 1: Backend (Java Spring Boot)
**Owner**: Backend subagent
**Path**: `C:\Users\Leo\Downloads\CDIEM\Siga1-modern\backend\`
**Allowed edits**: Everything under `backend/`
**Forbidden**: Do not edit `frontend/`, `docs/`, `docker-compose.yml`
**Deliverables**:
- `pom.xml` with all dependencies
- `application.yml` with DB config, JWT secret, CORS
- Entity classes (JPA) for all tables above
- Repository interfaces (Spring Data JPA)
- DTOs (request/response)
- Service layer with business logic
- REST Controllers for all endpoints
- Spring Security config with JWT filter
- Global exception handler
- `Dockerfile` for backend

**Validation**: `mvn clean compile` should succeed. No need to run tests (no DB in worktree).

### Worker 2: Frontend (React + TypeScript + Vite)
**Owner**: Frontend subagent
**Path**: `C:\Users\Leo\Downloads\CDIEM\Siga1-modern\frontend/`
**Allowed edits**: Everything under `frontend/`
**Forbidden**: Do not edit `backend/`, `docs/`, `docker-compose.yml`
**Deliverables**:
- `package.json` with dependencies
- `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`
- `index.html`
- Main `App.tsx` with React Router and route guards
- Auth context (login, JWT storage, role checks)
- API service layer (Axios, base URL `/api/v1`)
- Pages: Login, Dashboard, Duenios, Animales, Consultas, ConsultaDetail, Examenes, Derivaciones, Retornos, Usuarios, Reportes, Perfil
- Shared components: Layout, Navbar, Sidebar, ProtectedRoute, DataTable
- `Dockerfile` for frontend (nginx serve)

**Validation**: `npm install` + `npm run build` should succeed.

## Integration Order
1. Backend worker finishes first (data contract is source of truth).
2. Frontend worker builds against the API contract above.
3. Main agent merges both, writes `docker-compose.yml`, `README.md`, and `docs/`.
4. Final validation: docker-compose file structure is valid.

## Notes
- Use Spanish for UI labels (user is Spanish-speaking), but code in English.
- Keep it functional over pretty. The goal is a working system, not a design award.
- Do not implement the full 100+ fields of `consulta` as separate UI inputs unless trivial. Group them logically in tabs or sections.
