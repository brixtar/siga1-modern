# API Reference — SIGA Modern

Base URL: `http://localhost:8080/api/v1`

Todas las peticiones (excepto auth) requieren header:
```
Authorization: Bearer <jwt_token>
```

---

## Autenticación

### POST /auth/login
Iniciar sesión.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "username": "admin",
  "roles": ["ADMIN"]
}
```

### POST /auth/register
Registrar un nuevo usuario (solo ADMIN).

**Request:**
```json
{
  "username": "nuevo_usuario",
  "email": "user@email.com",
  "password": "password123",
  "role": "DOCTOR"
}
```

**Response 200:**
```json
{
  "message": "User registered successfully: nuevo_usuario"
}
```

---

## Usuarios (ADMIN only)

### GET /users
Listar todos los usuarios.

### GET /users/{id}
Obtener un usuario por ID.

### PUT /users/{id}
Actualizar un usuario.

### DELETE /users/{id}
Eliminar un usuario.

---

## Doctores

### GET /doctores
Listar doctores.

### POST /doctores
Crear doctor.

**Request:**
```json
{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@vet.com",
  "matricula": "VET-1234",
  "domicilio": "Calle Falsa 123",
  "ciudad": "Buenos Aires",
  "telefonoCelular": "+54 9 11 1234 5678",
  "telefonoFijo": "+54 11 1234 5678"
}
```

### GET /doctores/{id}
Obtener doctor.

### PUT /doctores/{id}
Actualizar doctor.

### DELETE /doctores/{id}
Eliminar doctor.

---

## Alumnos

Misma estructura que Doctores.

### GET /alumnos
### POST /alumnos
### GET /alumnos/{id}
### PUT /alumnos/{id}
### DELETE /alumnos/{id}

---

## Dueños

### GET /duenios
### POST /duenios

**Request:**
```json
{
  "dni": "87654321",
  "nombre": "María",
  "apellido": "García",
  "email": "maria@email.com",
  "facebook": "facebook.com/maria",
  "domicilio": "Av. Siempre Viva 742",
  "ciudad": "Córdoba",
  "telefonoFijo": "+54 351 123 4567",
  "telefonoCelular": "+54 9 351 123 4567"
}
```

### GET /duenios/{id}
### PUT /duenios/{id}
### DELETE /duenios/{id}

---

## Especies

### GET /especies
### POST /especies

**Request:**
```json
{ "especie": "Canino" }
```

### GET /especies/{id}
### PUT /especies/{id}
### DELETE /especies/{id}

---

## Razas

### GET /razas
### GET /razas?especieId={id}
Obtener razas por especie.

### POST /razas

**Request:**
```json
{
  "especieId": 1,
  "raza": "Labrador"
}
```

### GET /razas/{id}
### PUT /razas/{id}
### DELETE /razas/{id}

---

## Animales

### GET /animales
### GET /animales?duenioId={id}
Filtrar por dueño.

### POST /animales

**Request:**
```json
{
  "nombre": "Toby",
  "tipo": "PEQUENIO",
  "especieId": 1,
  "razaId": 3,
  "peso": "12.5 kg",
  "nacimiento": "2020-05-15",
  "sexo": "Macho",
  "color": "Negro",
  "duenioId": 1,
  "vivo": true
}
```

### GET /animales/{id}
### PUT /animales/{id}
### DELETE /animales/{id}

---

## Consultas

### GET /consultas
### GET /consultas?animalId={id}&doctorId={id}&fechaDesde={date}&fechaHasta={date}

### POST /consultas

**Request:** (simplified)
```json
{
  "casoClinico": "CC-2024-001",
  "fecha": "2024-06-01T10:00:00",
  "animalId": 1,
  "doctorId": 1,
  "alumnoId": 2,
  "motivo": "Vómitos y diarrea",
  "anamnesis": "El paciente presenta vómitos desde ayer...",
  "temperatura": "38.5°C",
  "fc": "120 lpm",
  "fr": "24 rpm",
  "diagnosticoPresuntivo": "Gastroenteritis",
  "tratamiento": "Fluidoterapia + antibióticos",
  "indicaciones": "Reposo, dieta blanda"
}
```

> Nota: La entidad `Consulta` tiene más de 100 campos. El DTO incluye todos, pero en la UI se organizan por tabs.

### GET /consultas/{id}
### PUT /consultas/{id}
### DELETE /consultas/{id}

---

## Derivaciones

### GET /derivaciones
### POST /derivaciones

**Request:**
```json
{
  "fecha": "2024-06-01",
  "animalId": 1,
  "doctorId": 1,
  "alumnoId": 2,
  "anamnesis": "...",
  "sistema": "Dermatológico",
  "indicaciones": "..."
}
```

### GET /derivaciones/{id}
### PUT /derivaciones/{id}
### DELETE /derivaciones/{id}

---

## Retornos

### GET /retornos
### POST /retornos

**Request:**
```json
{
  "consultaId": 1,
  "fecha": "2024-06-08",
  "animalId": 1,
  "doctorId": 1,
  "alumnoId": 2,
  "anamnesis": "...",
  "temperatura": "38.2°C",
  "indicaciones": "Continuar tratamiento"
}
```

### GET /retornos/{id}
### PUT /retornos/{id}
### DELETE /retornos/{id}

---

## Exámenes de Laboratorio

### Urianálisis

#### GET /examenes/urianalisis
#### POST /examenes/urianalisis
#### GET /examenes/urianalisis/{id}
#### PUT /examenes/urianalisis/{id}
#### DELETE /examenes/urianalisis/{id}

### Química Clínica

#### GET /examenes/quimica
#### POST /examenes/quimica
#### GET /examenes/quimica/{id}
#### PUT /examenes/quimica/{id}
#### DELETE /examenes/quimica/{id}

### Hemograma

#### GET /examenes/hemograma
#### POST /examenes/hemograma
#### GET /examenes/hemograma/{id}
#### PUT /examenes/hemograma/{id}
#### DELETE /examenes/hemograma/{id}

---

## Reportes

### GET /reportes/estadisticas?fechaDesde={date}&fechaHasta={date}&doctorId={id}&alumnoId={id}

**Response:**
```json
{
  "totalConsultas": 45,
  "totalDerivaciones": 12,
  "totalRetornos": 8,
  "totalExamenes": 20,
  "porDoctor": [
    { "doctorId": 1, "nombre": "Juan Pérez", "cantidad": 25 }
  ],
  "porAlumno": [
    { "alumnoId": 2, "nombre": "Carlos López", "cantidad": 15 }
  ]
}
```

---

## Códigos de estado HTTP

| Código | Significado |
|--------|-------------|
| 200 OK | Petición exitosa |
| 201 Created | Recurso creado |
| 400 Bad Request | Datos de entrada inválidos |
| 401 Unauthorized | Falta token JWT o es inválido |
| 403 Forbidden | Token válido pero sin permisos (rol insuficiente) |
| 404 Not Found | Recurso no encontrado |
| 500 Internal Server Error | Error del servidor |
