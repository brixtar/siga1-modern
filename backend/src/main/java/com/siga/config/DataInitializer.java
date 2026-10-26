package com.siga.config;

import com.siga.entity.*;
import com.siga.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private EspecieRepository especieRepository;

    @Autowired
    private RazaRepository razaRepository;

    @Autowired
    private DuenioRepository duenioRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            log.info("[DataInitializer] Iniciando inicializacion de datos enriquecidos...");

            // 1. Usuarios Base con Contraseñas Robustas y Migración Automática
            User admin = seedOrMigrateUser("admin", "admin_siga_chamical", "admin@siga.unlar.edu.ar", "S1gA#Adm!n2026$Ch4m", Role.ADMIN, true);
            User doc1User = seedOrMigrateUser("doctor", "doc_juan_perez", "jperez@siga.unlar.edu.ar", "D0ct0r#P3r3z!2026*Vet", Role.DOCTOR, true);
            User doc2User = seedOrMigrateUser("doctor2", "doc_ana_gomez", "agomez@siga.unlar.edu.ar", "Dr4#G0m3z!9823$Med", Role.DOCTOR, false);
            User alu1User = seedOrMigrateUser("alumno", "alu_lucas_silva", "lsilva@siga.unlar.edu.ar", "Alu#S!lv4_8841#Uni", Role.ALUMNO, false);
            User alu2User = seedOrMigrateUser("alumno2", "alu_sofia_mtz", "smartinez@siga.unlar.edu.ar", "Alu#M4rt!n3z_7766#Un", Role.ALUMNO, false);

            // Inutilizar definitivamente cualquier cuenta residual con credenciales débiles
            List<String> legacyNames = List.of("admin", "doctor", "doctor2", "alumno", "alumno2");
            for (String legacyName : legacyNames) {
                userRepository.findByUsername(legacyName).ifPresent(legacyUser -> {
                    log.warn("[DataInitializer] Deshabilitando cuenta legacy obsoleta residual: {}", legacyName);
                    legacyUser.setEnabled(false);
                    legacyUser.setPassword(passwordEncoder.encode("DISABLED_" + UUID.randomUUID()));
                    userRepository.save(legacyUser);
                });
            }

            // 2. Doctores
            Doctor doc1 = seedDoctor(doc1User, "11111111", "Juan", "Perez", "jperez@siga.unlar.edu.ar", "MP-1024");
            Doctor doc2 = seedDoctor(doc2User, "22222222", "Ana", "Gomez", "agomez@siga.unlar.edu.ar", "MP-2048");

            // 3. Alumnos
            Alumno alu1 = seedAlumno(alu1User, "33333333", "Lucas", "Silva", "lsilva@siga.unlar.edu.ar", "AL-9988");
            Alumno alu2 = seedAlumno(alu2User, "44444444", "Sofia", "Martinez", "smartinez@siga.unlar.edu.ar", "AL-7766");

            // 4. Especies y Razas
            Especie perro = seedEspecie("Perro");
            Raza labrador = seedRaza(perro, "Labrador");
            Raza pastorAleman = seedRaza(perro, "Pastor Aleman");
            Raza chihuahua = seedRaza(perro, "Chihuahua");

            Especie gato = seedEspecie("Gato");
            Raza siames = seedRaza(gato, "Siames");
            Raza persa = seedRaza(gato, "Persa");

            Especie conejo = seedEspecie("Conejo");
            Raza cabezaLeon = seedRaza(conejo, "Cabeza de Leon");

            Especie gallina = seedEspecie("Gallina");
            Raza leghorn = seedRaza(gallina, "Leghorn");

            Especie vaca = seedEspecie("Vaca");
            Raza holando = seedRaza(vaca, "Holando Argentino");
            Raza Hereford = seedRaza(vaca, "Hereford");

            Especie caballo = seedEspecie("Caballo");
            Raza criollo = seedRaza(caballo, "Criollo");

            Especie oveja = seedEspecie("Oveja");
            Raza merino = seedRaza(oveja, "Merino");

            Especie cerdo = seedEspecie("Cerdo");
            Raza landrace = seedRaza(cerdo, "Landrace");

            // 5. Dueños
            Duenio duenio1 = seedDuenio("12345678", "Carlos", "Perez", "carlos@gmail.com", "Calle 123", "Santiago");
            Duenio duenio2 = seedDuenio("23456789", "Maria", "Rodriguez", "maria@gmail.com", "Av. San Martin 456", "Valparaiso");
            Duenio duenio3 = seedDuenio("34567890", "Juan", "Gomez", "juan@gmail.com", "Ruta 5 Km 20", "Graneros");

            // 6. Animales
            Animal firulais = seedAnimal("Firulais", TipoAnimal.PEQUENIO, perro, labrador, 25.0, LocalDate.of(2021, 5, 10), "Macho", "Dorado", duenio1);
            Animal michi = seedAnimal("Michi", TipoAnimal.PEQUENIO, gato, siames, 4.2, LocalDate.of(2022, 8, 15), "Hembra", "Crema/Gris", duenio2);
            Animal lola = seedAnimal("Lola", TipoAnimal.GRANDE, vaca, holando, 520.0, LocalDate.of(2019, 3, 22), "Hembra", "Blanco y Negro", duenio3);
            Animal rayo = seedAnimal("Rayo", TipoAnimal.GRANDE, caballo, criollo, 420.0, LocalDate.of(2018, 11, 5), "Macho", "Marron", duenio3);

            // 7. Medicamentos
            seedMedicamento("Amoxicilina 500mg", "Antibiotico de amplio espectro", 25, 5, 15.0, "ml");
            seedMedicamento("Ivermectina 1%", "Antiparasitario para ganado y mascotas", 2, 5, 25.0, "ml"); // Bajo stock!
            seedMedicamento("Vacuna Antirrabica", "Vacuna anual obligatoria", 15, 10, 40.0, "dosis");
            seedMedicamento("Meloxicam 15mg", "Antiinflamatorio y analgesico", 30, 5, 12.0, "mg");
            seedMedicamento("Penicilina G Procainica", "Suspension inyectable antibiotica", 1, 3, 50.0, "frasco"); // Bajo stock!
            seedMedicamento("Desparasitante Canino", "Comprimido antiparasitario interno", 50, 10, 8.0, "pastilla");

            // 8. Consultas
            if (consultaRepository.count() == 0) {
                Consulta c1 = Consulta.builder()
                        .casoClinico("Control de rutina y vacunacion")
                        .fecha(LocalDateTime.now().minusDays(5))
                        .animal(firulais)
                        .doctor(doc1)
                        .alumno(alu1)
                        .motivo("Vacunacion antirrabica anual")
                        .anamnesis("Paciente sano, apetito normal, defecacion normal.")
                        .temperatura("38.5")
                        .fc("90")
                        .fr("24")
                        .cc("Ideal")
                        .llCap("2s")
                        .pulsoRitmo("Regular")
                        .pulsoIntensidad("Fuerte")
                        .hidratacion("Normal")
                        .maOcular("Rosada")
                        .maBucal("Rosada")
                        .diagnosticoPresuntivo("Paciente sano apto para vacuna")
                        .tratamiento("Aplicacion de vacuna antirrabica subcutanea")
                        .indicaciones("Observar reaccion secundaria local por 24 hrs")
                        .estado("COMPLETADA")
                        .build();
                consultaRepository.save(c1);

                Consulta c2 = Consulta.builder()
                        .casoClinico("Cojera en miembro posterior derecho")
                        .fecha(LocalDateTime.now().minusDays(2))
                        .animal(lola)
                        .doctor(doc2)
                        .alumno(alu2)
                        .motivo("Dificultad para caminar y baja produccion de leche")
                        .anamnesis("Clava la pezuña del miembro posterior derecho con dolor evidente.")
                        .temperatura("39.1")
                        .fc("70")
                        .fr("30")
                        .cc("Regular")
                        .llCap("2s")
                        .pulsoRitmo("Regular")
                        .hidratacion("Normal")
                        .locomotorLesion("Inflamacion en region podal")
                        .claudicacionMiembro("Miembro posterior derecho")
                        .claudicacionTipo("Soporte")
                        .diagnosticoPresuntivo("Pododermatitis infecciosa (Pietin)")
                        .tratamiento("Limpieza de pezuña, vendaje y antibiotico sistemico")
                        .indicaciones("Mantener en corral seco. Curacion diaria.")
                        .estado("COMPLETADA")
                        .build();
                consultaRepository.save(c2);

                log.info("[DataInitializer] Consultas iniciales creadas.");
            }

            log.info("[DataInitializer] Datos enriquecidos cargados correctamente!");
        } catch (Exception e) {
            log.error("[DataInitializer] Error al inicializar datos: {}", e.getMessage(), e);
        }
    }

    private User seedOrMigrateUser(String legacyUsername, String newUsername, String newEmail, String newPassword, Role role, boolean puedeVerAuditoria) {
        // 1. Si ya existe el nuevo usuario seguro, asegurar rol, email y estado
        Optional<User> existingNew = userRepository.findByUsername(newUsername);
        if (existingNew.isPresent()) {
            User user = existingNew.get();
            user.setEmail(newEmail);
            user.setRole(role);
            user.setPuedeVerAuditoria(puedeVerAuditoria);
            user.setEnabled(true);
            return userRepository.save(user);
        }

        // 2. Si existe la cuenta legacy anterior (ej. "admin", "doctor"), migrarla in-situ preservando su ID y relaciones
        if (legacyUsername != null) {
            Optional<User> legacy = userRepository.findByUsername(legacyUsername);
            if (legacy.isPresent()) {
                User user = legacy.get();
                log.info("[DataInitializer] Migrando cuenta legacy '{}' a nuevo usuario robusto '{}'...", legacyUsername, newUsername);
                user.setUsername(newUsername);
                user.setEmail(newEmail);
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setRole(role);
                user.setPuedeVerAuditoria(puedeVerAuditoria);
                user.setEnabled(true);
                return userRepository.save(user);
            }
        }

        // 3. Si no existe ninguno, crear de cero
        log.info("[DataInitializer] Creando nuevo usuario seguro '{}'...", newUsername);
        User user = User.builder()
                .username(newUsername)
                .email(newEmail)
                .password(passwordEncoder.encode(newPassword))
                .role(role)
                .puedeVerAuditoria(puedeVerAuditoria)
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    private Doctor seedDoctor(User user, String dni, String nombre, String apellido, String email, String matricula) {
        if (user != null) {
            Optional<Doctor> existing = doctorRepository.findByUserId(user.getId());
            if (existing.isPresent()) {
                Doctor doc = existing.get();
                doc.setEmail(email);
                return doctorRepository.save(doc);
            }
            Doctor doc = Doctor.builder()
                    .user(user)
                    .dni(dni)
                    .nombre(nombre)
                    .apellido(apellido)
                    .email(email)
                    .matricula(matricula)
                    .build();
            return doctorRepository.save(doc);
        }
        return null;
    }

    private Alumno seedAlumno(User user, String dni, String nombre, String apellido, String email, String matricula) {
        if (user != null) {
            Optional<Alumno> existing = alumnoRepository.findByUserId(user.getId());
            if (existing.isPresent()) {
                Alumno alu = existing.get();
                alu.setEmail(email);
                return alumnoRepository.save(alu);
            }
            Alumno alu = Alumno.builder()
                    .user(user)
                    .dni(dni)
                    .nombre(nombre)
                    .apellido(apellido)
                    .email(email)
                    .matricula(matricula)
                    .build();
            return alumnoRepository.save(alu);
        }
        return null;
    }

    private Especie seedEspecie(String nombreEspecie) {
        return especieRepository.findByEspecie(nombreEspecie)
                .orElseGet(() -> especieRepository.save(Especie.builder().especie(nombreEspecie).build()));
    }

    private Raza seedRaza(Especie especie, String nombreRaza) {
        return razaRepository.findByRazaAndEspecieId(nombreRaza, especie.getId())
                .orElseGet(() -> razaRepository.save(Raza.builder().raza(nombreRaza).especie(especie).build()));
    }

    private Duenio seedDuenio(String dni, String nombre, String apellido, String email, String domicilio, String ciudad) {
        return duenioRepository.findByDni(dni)
                .orElseGet(() -> duenioRepository.save(Duenio.builder()
                        .dni(dni)
                        .nombre(nombre)
                        .apellido(apellido)
                        .email(email)
                        .domicilio(domicilio)
                        .ciudad(ciudad)
                        .build()));
    }

    private Animal seedAnimal(String nombre, TipoAnimal tipo, Especie esp, Raza raz, Double peso, LocalDate nac, String sexo, String color, Duenio d) {
        List<Animal> existing = animalRepository.findByNombre(nombre);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }
        return animalRepository.save(Animal.builder()
                .nombre(nombre)
                .tipo(tipo)
                .especie(esp)
                .raza(raz)
                .peso(peso)
                .nacimiento(nac)
                .sexo(sexo)
                .color(color)
                .duenio(d)
                .vivo(true)
                .build());
    }

    private void seedMedicamento(String nombre, String desc, int stock, int minStock, double precio, String unidad) {
        List<Medicamento> existing = medicamentoRepository.findByNombreContainingIgnoreCase(nombre);
        if (existing.isEmpty()) {
            Medicamento med = Medicamento.builder()
                    .nombre(nombre)
                    .descripcion(desc)
                    .cantidadStock(stock)
                    .stockMinimo(minStock)
                    .precioUnidad(precio)
                    .unidadMedida(unidad)
                    .build();
            medicamentoRepository.save(med);
            log.info("[DataInitializer] Medicamento sembrado: {}", nombre);
        }
    }
}
