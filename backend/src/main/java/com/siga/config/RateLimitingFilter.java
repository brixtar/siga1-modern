package com.siga.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ConcurrentHashMap<String, TokenBucket> loginBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, TokenBucket> apiBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        
        // Solo aplicar limites a endpoints de la API
        if (uri.startsWith("/api/")) {
            String ip = getClientIP(request);

            if (uri.equals("/api/v1/auth/login")) {
                // Limite para login: 5 peticiones por minuto
                TokenBucket bucket = loginBuckets.computeIfAbsent(ip, k -> new TokenBucket(5, 5, 60));
                if (!bucket.tryConsume()) {
                    sendErrorResponse(response, "Has superado el limite de intentos de inicio de sesion (5 por minuto).");
                    return;
                }
            } else {
                // Limite para API general: 100 peticiones por minuto
                TokenBucket bucket = apiBuckets.computeIfAbsent(ip, k -> new TokenBucket(100, 100, 60));
                if (!bucket.tryConsume()) {
                    sendErrorResponse(response, "Has superado el limite de peticiones al servidor (100 por minuto).");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429); // HTTP 429 Too Many Requests
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
                "{\"error\": \"Too Many Requests\", \"message\": \"%s\"}", message));
    }
}
