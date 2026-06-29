package com.siga.service;

import com.siga.entity.User;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public User update(Long id, User userData) {
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
        return userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }
}
