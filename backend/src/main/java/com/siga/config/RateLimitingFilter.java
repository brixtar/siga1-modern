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
    private final ConcurrentHashMap<String, TokenBucket> captchaBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, TokenBucket> apiBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Solo aplicar limites a endpoints de la API
        if (uri.startsWith("/api/")) {
            String ip = getClientIP(request);

            if (uri.equals("/api/v1/auth/login")) {
                // Limite estricto para login: maximo 5 peticiones por minuto por IP
                TokenBucket bucket = loginBuckets.computeIfAbsent(ip, k -> new TokenBucket(5, 5, 60));
                if (!bucket.tryConsume()) {
                    sendErrorResponse(response, "Has superado el límite de intentos de inicio de sesión. Por seguridad, espere 1 minuto.");
                    return;
                }
            } else if (uri.equals("/api/v1/auth/captcha")) {
                // Limite para generacion de captcha: 25 peticiones por minuto por IP
                TokenBucket bucket = captchaBuckets.computeIfAbsent(ip, k -> new TokenBucket(25, 25, 60));
                if (!bucket.tryConsume()) {
                    sendErrorResponse(response, "Demasiadas solicitudes de código de verificación. Por favor, espere unos momentos.");
                    return;
                }
            } else {
                // Limite para API general: 600 peticiones por minuto
                TokenBucket bucket = apiBuckets.computeIfAbsent(ip, k -> new TokenBucket(600, 600, 600));
                if (!bucket.tryConsume()) {
                    sendErrorResponse(response, "Has superado el limite de peticiones al servidor.");
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
