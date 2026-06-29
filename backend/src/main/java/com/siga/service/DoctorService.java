package com.siga.service;

import com.siga.dto.DoctorDto;
import com.siga.entity.Doctor;
import com.siga.entity.Role;
import com.siga.entity.User;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.DoctorRepository;
import com.siga.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<DoctorDto> findAll() {
        return doctorRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public DoctorDto findById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
        return toDto(doctor);
    }

    @Transactional
    public DoctorDto create(DoctorDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode("doctor123"));
        user.setRole(Role.DOCTOR);
        user.setEnabled(true);
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setDni(dto.getDni());
        doctor.setNombre(dto.getNombre());
        doctor.setApellido(dto.getApellido());
        doctor.setEmail(dto.getEmail());
        doctor.setMatricula(dto.getMatricula());
        doctor.setDomicilio(dto.getDomicilio());
        doctor.setCiudad(dto.getCiudad());
        doctor.setTelefonoCelular(dto.getTelefonoCelular());
        doctor.setTelefonoFijo(dto.getTelefonoFijo());
        return toDto(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorDto update(Long id, DoctorDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
        doctor.setDni(dto.getDni());
        doctor.setNombre(dto.getNombre());
        doctor.setApellido(dto.getApellido());
        doctor.setEmail(dto.getEmail());
        doctor.setMatricula(dto.getMatricula());
        doctor.setDomicilio(dto.getDomicilio());
        doctor.setCiudad(dto.getCiudad());
        doctor.setTelefonoCelular(dto.getTelefonoCelular());
        doctor.setTelefonoFijo(dto.getTelefonoFijo());
        return toDto(doctorRepository.save(doctor));
    }

    @Transactional
    public void delete(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
        doctorRepository.delete(doctor);
        userRepository.deleteById(doctor.getUser().getId());
    }

    private DoctorDto toDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUser().getId());
        dto.setUsername(doctor.getUser().getUsername());
        dto.setEmail(doctor.getEmail());
        dto.setDni(doctor.getDni());
        dto.setNombre(doctor.getNombre());
        dto.setApellido(doctor.getApellido());
        dto.setMatricula(doctor.getMatricula());
        dto.setDomicilio(doctor.getDomicilio());
        dto.setCiudad(doctor.getCiudad());
        dto.setTelefonoCelular(doctor.getTelefonoCelular());
        dto.setTelefonoFijo(doctor.getTelefonoFijo());
        return dto;
    }
}
