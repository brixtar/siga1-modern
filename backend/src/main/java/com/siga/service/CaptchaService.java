package com.siga.service;

import com.siga.dto.CaptchaResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class CaptchaService {

    private static final String CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 5;
    private static final long EXPIRATION_MILLIS = 3 * 60 * 1000; // 3 minutos
    private static final int MAX_CACHE_SIZE = 300;

    private static final String[] PALETTE = {
            "#14b8a6", // Teal
            "#38bdf8", // Sky blue
            "#34d399", // Emerald
            "#fbbf24", // Amber
            "#a78bfa", // Purple
            "#2dd4bf"  // Light teal
    };

    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, CaptchaRecord> cache = new ConcurrentHashMap<>();

    private record CaptchaRecord(String code, long expiresAt) {}

    public CaptchaResponse generateCaptcha() {
        cleanExpiredIfNecessary();

        String captchaId = UUID.randomUUID().toString();
        String code = generateRandomCode(CODE_LENGTH);
        long expiresAt = System.currentTimeMillis() + EXPIRATION_MILLIS;

        cache.put(captchaId, new CaptchaRecord(code, expiresAt));

        String svg = generateSvgCaptcha(code);
        String base64Svg = "data:image/svg+xml;base64," + Base64.getEncoder().encodeToString(svg.getBytes(StandardCharsets.UTF_8));

        return CaptchaResponse.builder()
                .captchaId(captchaId)
                .captchaImage(base64Svg)
                .expiresInSeconds(EXPIRATION_MILLIS / 1000)
                .build();
    }

    public boolean validateCaptcha(String captchaId, String answer) {
        if (captchaId == null || captchaId.isBlank() || answer == null || answer.isBlank()) {
            return false;
        }

        // Se remueve de inmediato para evitar ataques de repeticion (One-Time-Token)
        CaptchaRecord record = cache.remove(captchaId.trim());
        if (record == null) {
            log.warn("[CaptchaService] Intento con captchaId inexistente o ya utilizado: {}", captchaId);
            return false;
        }

        if (System.currentTimeMillis() > record.expiresAt()) {
            log.warn("[CaptchaService] Intento con captcha expirado.");
            return false;
        }

        boolean isValid = record.code().equalsIgnoreCase(answer.trim());
        if (!isValid) {
            log.warn("[CaptchaService] Código CAPTCHA erróneo.");
        }
        return isValid;
    }

    private String generateRandomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARSET.length());
            sb.append(CHARSET.charAt(index));
        }
        return sb.toString();
    }

    private String generateSvgCaptcha(String code) {
        int width = 220;
        int height = 65;
        StringBuilder sb = new StringBuilder();

        sb.append(String.format(
                "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">",
                width, height, width, height));

        // Fondo oscuro estilizado con bordes redondeados
        sb.append(String.format(
                "<rect width=\"%d\" height=\"%d\" rx=\"12\" fill=\"#090d16\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>",
                width, height));

        // Patrón de ruido: puntos y círculos de interferencia
        for (int i = 0; i < 24; i++) {
            int cx = random.nextInt(width);
            int cy = random.nextInt(height);
            int r = 1 + random.nextInt(3);
            String color = PALETTE[random.nextInt(PALETTE.length)];
            sb.append(String.format(
                    "<circle cx=\"%d\" cy=\"%d\" r=\"%d\" fill=\"%s\" opacity=\"0.22\"/>",
                    cx, cy, r, color));
        }

        // Línea ondulada anti-OCR detrás del texto
        int y1 = 15 + random.nextInt(35);
        int y2 = 15 + random.nextInt(35);
        int ctrlX = 80 + random.nextInt(60);
        int ctrlY = 5 + random.nextInt(55);
        sb.append(String.format(
                "<path d=\"M 10 %d Q %d %d 210 %d\" stroke=\"rgba(20, 184, 166, 0.4)\" stroke-width=\"2\" fill=\"none\"/>",
                y1, ctrlX, ctrlY, y2));

        // Letras con rotación, desplazamiento y colores variados
        int charSpacing = 36;
        int startX = 22;

        for (int i = 0; i < code.length(); i++) {
            char ch = code.charAt(i);
            int x = startX + (i * charSpacing) + random.nextInt(6) - 3;
            int y = 43 + random.nextInt(8) - 4;
            int angle = random.nextInt(31) - 15; // -15 a +15 grados
            String color = PALETTE[random.nextInt(PALETTE.length)];

            sb.append(String.format(
                    "<text x=\"%d\" y=\"%d\" font-family=\"Consolas, 'Courier New', monospace\" font-size=\"32\" " +
                            "font-weight=\"900\" fill=\"%s\" transform=\"rotate(%d %d %d)\" " +
                            "letter-spacing=\"2\" filter=\"drop-shadow(0px 2px 4px rgba(0,0,0,0.5))\">%c</text>",
                    x, y, color, angle, x, y, ch));
        }

        // Línea ondulada anti-OCR delante del texto
        int y3 = 20 + random.nextInt(30);
        int y4 = 20 + random.nextInt(30);
        int ctrlX2 = 90 + random.nextInt(50);
        int ctrlY2 = 10 + random.nextInt(45);
        sb.append(String.format(
                "<path d=\"M 15 %d Q %d %d 205 %d\" stroke=\"rgba(56, 189, 248, 0.35)\" stroke-width=\"1.8\" fill=\"none\"/>",
                y3, ctrlX2, ctrlY2, y4));

        sb.append("</svg>");
        return sb.toString();
    }

    private void cleanExpiredIfNecessary() {
        if (cache.size() > MAX_CACHE_SIZE) {
            long now = System.currentTimeMillis();
            cache.entrySet().removeIf(entry -> now > entry.getValue().expiresAt());
        }
    }
}
