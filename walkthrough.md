# Walkthrough — Correcciones, Seguridad, Módulo de Farmacia y Puesta en Marcha de SIGA Modern

Este documento resume los problemas identificados y solucionados, el nuevo módulo de control de farmacia, las medidas de seguridad avanzadas implementadas, los datos de prueba enriquecidos sembrados en la base de datos, y los 5 módulos avanzados de seguridad y control recientemente integrados.

---

## 🛠️ Errores de Infraestructura y Base de Datos Resueltos

### 1. Error de Creación de Tabla (Row size too large en `Consulta`)
* **Problema**: El backend fallaba al iniciar porque Hibernate no podía crear la tabla `consulta` debido a que contenía más de 70 campos `String`. El tamaño máximo acumulado superaba con creces el límite de 65,535 bytes de MySQL.
* **Solución**: Añadimos el atributo `@Column(length = 100)` a todas las columnas de texto estándar de la entidad [Consulta.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/entity/Consulta.java), manteniendo como `columnDefinition = "TEXT"` únicamente los campos narrativos extensos.

### 2. Conflictos de Puerto y Caché de Compilación Anterior
* Se resolvieron puertos locales bloqueados por Kubernetes y caché de Docker obsoleta para asegurar que se ejecutara el código Java real del workspace.
* Se configuró una clave JWT segura de 256 bits (`sigaSecretKeySuperSecureAndVeryLong32Chars!`) para evitar fallos de inicialización en la firma de tokens con JJWT 0.12+.

---

## 🔐 Seguridad Avanzada Implementada

### 1. Cookies HttpOnly para JWT
* Modificamos [AuthController.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/controller/AuthController.java) y [JwtAuthenticationFilter.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/config/JwtAuthenticationFilter.java) para que el token JWT se almacene y envíe a través de una cookie segura `HttpOnly` llamada `siga_token`.
* Esto protege el token de ataques XSS al hacer que no sea accesible mediante JavaScript en el frontend.
* Se implementó un endpoint `/auth/logout` en el backend para limpiar la cookie de manera segura al cerrar sesión.

### 2. Control de Inactividad de 10 Minutos
* Se implementó un escuchador de eventos de interacción del usuario en el [AuthContext.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/context/AuthContext.tsx) del frontend.
* Si no se registra actividad durante 10 minutos continuos, la sesión se expira automáticamente, se notifica al usuario y se le redirige al login tras limpiar el token en el servidor y localmente.

### 3. Seguridad a Nivel de Métodos (`@PreAuthorize`)
* Protegimos los controladores de [EspecieController.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/controller/EspecieController.java) y [RazaController.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/controller/RazaController.java) con anotaciones `@PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")`.
* Esto garantiza que los alumnos (`ALUMNO`) solo tengan acceso de lectura, bloqueando de forma segura cualquier intento de inyección o manipulación de especies/razas por su parte.

---

## 💊 Módulo de Farmacia y Control de Stock

### 1. Gestión de Medicamentos (CRUD Seguro)
* Creamos la entidad `Medicamento.java`, el repositorio, servicio, y [MedicamentoController.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/controller/MedicamentoController.java) con control de roles (`ADMIN` y `DOCTOR` pueden modificar inventario; `ALUMNO` solo tiene acceso de lectura).
* Implementamos alertas visuales de stock mínimo en el Dashboard y la página de Farmacia.

### 2. Integración de Recetas en Consultas (Deducción Automática)
* En [ConsultaDetail.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/ConsultaDetail.tsx), añadimos la sección **"Medicamentos Prescritos"** dentro de la pestaña de Tratamiento.
* El doctor/alumno puede añadir múltiples medicamentos con sus dosis a la consulta.
* Al guardar la consulta, el backend ([ConsultaService.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/service/ConsultaService.java)) deduce automáticamente las cantidades del stock del medicamento. Si se actualiza o elimina la prescripción, el stock se restaura o ajusta automáticamente en consecuencia.

---

## 🚀 Nuevos Módulos Avanzados Implementados

### 1. Logs de Auditoría (Audit Logs)
* **Backend**: Añadimos soporte AOP (AspectJ) y creamos el interceptor [AuditAspect.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/aspect/AuditAspect.java) que captura de forma automática y transparente cualquier creación (`create*`), modificación (`update*`) o eliminación (`delete*`) en las clases de servicio.
* **Frontend**: Creada la página [Auditorias.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/Auditorias.tsx), protegida solo para el rol `ADMIN` y `DOCTOR` con permiso de auditoría. Permite filtrar, buscar y ver detalles de auditoría en un modal técnico dedicado.

### 2. Carga y Descarga de Archivos de Estudios Médicos
* **Backend**: Creados la entidad `EstudioMedico.java` y el controlador `EstudioMedicoController.java`, integrados con `StorageService.java` para subir archivos multiparte de forma segura. Los archivos se renombran usando un identificador UUID único y se guardan localmente bajo el directorio `uploads`.
* **Frontend**: Añadido la pestaña **"Estudios / Archivos"** en [ConsultaDetail.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/ConsultaDetail.tsx), permitiendo a veterinarios y alumnos adjuntar radiografías, informes PDF o análisis clínicos directamente a la consulta y descargarlos con un solo clic.

### 3. Línea de Tiempo de Historia Clínica (Timeline)
* **Frontend**: En la página de listado de [Animales.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/Animales.tsx), se agregó una acción **"Ver"** en cada fila. Al hacer clic, se abre una ficha completa del animal que contiene sus datos generales, información del dueño, y una pestaña de **Línea de Tiempo Clínica**.
* Esta línea de tiempo compila y ordena cronológicamente descendente todas las consultas, controles de retorno, derivaciones a especialistas y análisis clínicos (hemogramas, químicas clínicas, urianálisis), permitiendo además navegar a los detalles de cada consulta.

### 4. Calendario y Agenda de Turnos
* **Backend**: Creamos la entidad `Turno.java` y su respectivo CRUD en `TurnoController.java` para agendar citas asignando un animal, un doctor veterinario, fecha/hora, motivo y estado de reserva.
* **Frontend**: Diseñamos un componente de agenda semanal interactivo en [Turnos.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/Turnos.tsx). Permite avanzar y retroceder por semanas, ver turnos asignados por día y horario, cambiar su estado (RESERVADO, COMPLETADO, CANCELADO) y reservar nuevos turnos desde un modal emergente.

### 5. Limitación de Peticiones (Rate Limiting)
* **Backend**: Implementamos un control de flujo Token Bucket seguro e independiente en [TokenBucket.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/config/TokenBucket.java) por dirección IP de origen.
* Añadimos el servlet filter [RateLimitingFilter.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/config/RateLimitingFilter.java) que restringe intentos de fuerza bruta sobre el login `/api/v1/auth/login` (máximo 5 peticiones por minuto) y limita peticiones generales al API (máximo 100 peticiones por minuto), respondiendo con código HTTP `429 Too Many Requests`.

---

## 🎨 Mejoras de Usabilidad y Límites por Rol del Sistema

### 1. Edición de Perfiles por el Administrador
* La página de [Usuarios.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/Usuarios.tsx) dejó de ser estática. Ahora conecta directamente con el backend `/users` permitiendo al administrador editar la información de los usuarios (nombre de usuario, email, rol, cambiar contraseña y habilitar/inhabilitar cuentas).

### 2. Delegación de Auditorías
* Solo los administradores pueden autorizar de manera granular el acceso a las auditorías de seguridad a médicos específicos.
* En el formulario de edición de usuarios de la pantalla de administración, si el perfil es de tipo **Doctor**, se habilita un checkbox especial de **"Autorizar acceso a Logs de Auditoría"** que asigna la propiedad `puedeVerAuditoria` en la base de datos.
* El backend [AuditoriaController.java](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/backend/src/main/java/com/siga/controller/AuditoriaController.java) valida de forma segura si el médico cuenta con dicha propiedad activa en su token JWT, de lo contrario bloquea la petición. El link del Sidebar también se oculta dinámicamente si no tiene el permiso.

### 3. Varios Animales por Propietario (Multi-Mascota)
* Rediseñamos la vista de [Duenios.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/pages/Duenios.tsx) para cargar la lista de animales y asociar de forma visual múltiples mascotas a un solo dueño, listándolas como etiquetas con íconos descriptivos en una nueva columna de la tabla.

### 4. Límites de Acceso para Alumnos
* Se establecieron restricciones estrictas a lo largo de toda la interfaz:
  * El **Alumno** (`ALUMNO`) puede revisar y buscar información, registrar consultas e interactuar con la agenda de turnos.
  * El Alumno **no puede editar, agregar ni borrar** dueños ni animales. Los botones de agregar ("Nuevo Dueño", "Nuevo Animal") y las acciones de edición/eliminación se ocultan en la interfaz, y el backend bloquea cualquier petición HTTP no autorizada por su rol.

### 5. Interfaz Visual Refinada (Navbar & Header)
* Rediseñamos el componente [Navbar.tsx](file:///c:/Users/Leo/Downloads/CDIEM/Siga1-modern/frontend/src/components/Navbar.tsx) para darle un aspecto de alta gama (Premium):
  * **Efecto de Desfoque**: Agregamos soporte de desfoque de fondo traslúcido (`backdrop-blur-md bg-white/80`).
  * **Avatar con Iniciales**: Creado un badge circular con un degradado dinámico con la inicial del usuario.
  * **Pill de Rol**: Cada usuario tiene un indicador visual del rol que desempeña (Administrador en rojo/rosa, Doctor en azul, Alumno en verde).

---

## 💡 Consejos de Próximas Funcionalidades para Implementar

Si deseas seguir extendiendo las capacidades del sistema SIGA, te aconsejo añadir las siguientes funciones:

1. **Generación y Descarga de Recetas Médicas en PDF**:
   * Implementar un servicio en el backend (ej. usando iText o OpenPDF) que permita generar un documento PDF de la receta médica oficial listo para imprimir con el sello y firma digital del doctor veterinario a cargo.
2. **Alertas de Vacunación y Control**:
   * Crear un sistema de recordatorios de vacunas que envíe notificaciones por correo electrónico o SMS de forma automática a los dueños cuando se acerque la fecha de refuerzo de una vacuna (ej. antirrábica).
3. **Módulo de Estadísticas y Gráficos Visuales**:
   * Implementar gráficos interactivos (con Chart.js o Recharts) en la pestaña de Reportes que muestren la facturación mensual de la farmacia, los motivos de consulta más comunes, y la cantidad de pacientes atendidos por especie.
4. **Historial de Variación de Peso del Paciente**:
   * Agregar un registro histórico de pesos en las fichas de los animales para graficar la curva de crecimiento y peso a lo largo de los meses, vital para detectar desnutrición u obesidad en mascotas y ganado.

---

## 🚦 Verificación y Previsualización Local

Para probar y ver los cambios aplicados en vivo en tu navegador:

1. **Abre Docker Desktop** en tu computadora.
2. Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   iniciar.bat
   ```
3. Abre tu navegador en: **[http://localhost](http://localhost)**
4. Utiliza las siguientes credenciales para probar los diferentes roles y reglas:

| Rol | Usuario | Contraseña | Permisos / Reglas |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total, gestión de usuarios (CRUD), edición de especies, razas, farmacia y auditorías de seguridad. |
| **Médico (Doctor)** | `doctor` | `doctor123` | Gestión de consultas y recetas, inventario de medicamentos y agenda semanal. Permiso de auditoría asignable por el admin. |
| **Alumno** | `alumno` | `alumno123` | Registro y visualización de consultas, consulta de turnos, y consulta de animales/dueños en formato de **Solo Lectura** (Revisión). |
