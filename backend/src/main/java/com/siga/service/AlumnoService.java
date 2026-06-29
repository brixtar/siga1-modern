package com.siga.service;

import com.siga.dto.AlumnoDto;
import com.siga.entity.Alumno;
import com.siga.entity.Role;
import com.siga.entity.User;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.AlumnoRepository;
import com.siga.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<AlumnoDto> findAll() {
        return alumnoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public AlumnoDto findById(Long id) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + id));
        return toDto(alumno);
    }

    @Transactional
    public AlumnoDto create(AlumnoDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode("alumno123"));
        user.setRole(Role.ALUMNO);
        user.setEnabled(true);
        user = userRepository.save(user);

        Alumno alumno = new Alumno();
        alumno.setUser(user);
        alumno.setDni(dto.getDni());
        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        alumno.setEmail(dto.getEmail());
        alumno.setMatricula(dto.getMatricula());
        alumno.setDomicilio(dto.getDomicilio());
        alumno.setCiudad(dto.getCiudad());
        alumno.setTelefonoCelular(dto.getTelefonoCelular());
        alumno.setTelefonoFijo(dto.getTelefonoFijo());
        return toDto(alumnoRepository.save(alumno));
    }

    @Transactional
    public AlumnoDto update(Long id, AlumnoDto dto) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + id));
        alumno.setDni(dto.getDni());
        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        alumno.setEmail(dto.getEmail());
        alumno.setMatricula(dto.getMatricula());
        alumno.setDomicilio(dto.getDomicilio());
        alumno.setCiudad(dto.getCiudad());
        alumno.setTelefonoCelular(dto.getTelefonoCelular());
        alumno.setTelefonoFijo(dto.getTelefonoFijo());
        return toDto(alumnoRepository.save(alumno));
    }

    @Transactional
    public void delete(Long id) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno not found: " + id));
        alumnoRepository.delete(alumno);
        userRepository.deleteById(alumno.getUser().getId());
    }

    private AlumnoDto toDto(Alumno alumno) {
        AlumnoDto dto = new AlumnoDto();
        dto.setId(alumno.getId());
        dto.setUserId(alumno.getUser().getId());
        dto.setUsername(alumno.getUser().getUsername());
        dto.setEmail(alumno.getEmail());
        dto.setDni(alumno.getDni());
        dto.setNombre(alumno.getNombre());
        dto.setApellido(alumno.getApellido());
        dto.setMatricula(alumno.getMatricula());
        dto.setDomicilio(alumno.getDomicilio());
        dto.setCiudad(alumno.getCiudad());
        dto.setTelefonoCelular(alumno.getTelefonoCelular());
        dto.setTelefonoFijo(alumno.getTelefonoFijo());
        return dto;
    }
}
