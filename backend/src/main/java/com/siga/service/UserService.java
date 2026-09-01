package com.siga.service;

import com.siga.dto.UserDto;
import com.siga.entity.User;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private UserDto toDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .puedeVerAuditoria(user.getPuedeVerAuditoria())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toDto(user);
    }

    @Transactional
    public UserDto update(Long id, UserDto userData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setUsername(userData.getUsername());
        user.setEmail(userData.getEmail());
        
        boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities()
                .contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"));
        
        if (isAdmin) {
            if (userData.getRole() != null) user.setRole(userData.getRole());
            if (userData.getEnabled() != null) user.setEnabled(userData.getEnabled());
            if (userData.getPuedeVerAuditoria() != null) user.setPuedeVerAuditoria(userData.getPuedeVerAuditoria());
        }

        if (userData.getPassword() != null && !userData.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userData.getPassword()));
        }
        
        User savedUser = userRepository.save(user);
        return toDto(savedUser);
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }
}
