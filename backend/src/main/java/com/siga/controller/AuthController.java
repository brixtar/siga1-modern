package com.siga.controller;

import com.siga.dto.LoginRequest;
import com.siga.dto.LoginResponse;
import com.siga.dto.MessageResponse;
import com.siga.dto.RegisterRequest;
import com.siga.entity.User;
import com.siga.config.JwtUtils;
import com.siga.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, jakarta.servlet.http.HttpServletResponse response) {
        LoginResponse loginResponse = authService.authenticate(request);
        
        // Generate and set HttpOnly Cookie
        String jwt = jwtUtils.generateJwtToken(
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
        );
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("siga_token", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set false for local development
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24 hours
        response.addCookie(cookie);
        
        // Remove token from response body to prevent storage in localStorage
        loginResponse.setToken(null);
        
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletResponse response) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("siga_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Immediately expire the cookie
        response.addCookie(cookie);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.registerUser(request);
        return ResponseEntity.ok(new MessageResponse("User registered successfully: " + user.getUsername()));
    }
}
