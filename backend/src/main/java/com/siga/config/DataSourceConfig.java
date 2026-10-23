package com.siga.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;
import java.util.Arrays;
import java.util.stream.Collectors;

@Configuration
@Slf4j
public class DataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = StringUtils.hasText(rawUrl) ? rawUrl : databaseUrl;
        String finalUrl = url;
        String finalUser = username;
        String finalPassword = password;

        if (StringUtils.hasText(url)) {
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(url.replace("postgres://", "http://").replace("postgresql://", "http://"));
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String query = uri.getQuery();

                    if (uri.getUserInfo() != null && !uri.getUserInfo().isEmpty()) {
                        String[] userParts = uri.getUserInfo().split(":", 2);
                        finalUser = userParts[0];
                        if (userParts.length > 1) {
                            finalPassword = userParts[1];
                        }
                    }

                    // Limpiar query para compatibilidad JDBC (eliminar channel_binding, mantener sslmode)
                    String cleanQuery = "sslmode=require";
                    if (StringUtils.hasText(query)) {
                        cleanQuery = Arrays.stream(query.split("&"))
                                .filter(p -> !p.toLowerCase().startsWith("channel_binding"))
                                .collect(Collectors.joining("&"));
                        if (!cleanQuery.contains("sslmode")) {
                            cleanQuery = cleanQuery.isEmpty() ? "sslmode=require" : cleanQuery + "&sslmode=require";
                        }
                    }

                    StringBuilder jdbcBuilder = new StringBuilder("jdbc:postgresql://")
                            .append(host)
                            .append(":")
                            .append(port)
                            .append(path != null && !path.isEmpty() ? path : "/neondb")
                            .append("?")
                            .append(cleanQuery);

                    finalUrl = jdbcBuilder.toString();
                    log.info("[DataSourceConfig] URL convertida a JDBC compatible: {}", finalUrl.replaceAll(":[^/@]+@", ":***@"));
                } catch (Exception e) {
                    log.warn("[DataSourceConfig] No se pudo parsear URI, usando fallback con prefijo jdbc:", e);
                    if (url.startsWith("postgresql://")) {
                        finalUrl = "jdbc:" + url;
                    } else if (url.startsWith("postgres://")) {
                        finalUrl = "jdbc:postgresql://" + url.substring("postgres://".length());
                    }
                }
            }
        }

        HikariConfig config = new HikariConfig();
        if (StringUtils.hasText(finalUrl)) {
            config.setJdbcUrl(finalUrl);
        } else {
            config.setJdbcUrl(properties.determineUrl());
        }

        if (StringUtils.hasText(finalUser)) {
            config.setUsername(finalUser);
        } else {
            config.setUsername(properties.determineUsername());
        }

        if (StringUtils.hasText(finalPassword)) {
            config.setPassword(finalPassword);
        } else {
            config.setPassword(properties.determinePassword());
        }

        // Optimizaciones para Serverless Postgres (Neon.tech / Supabase)
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setIdleTimeout(300000); // 5 minutos
        config.setMaxLifetime(600000); // 10 minutos
        config.setConnectionTimeout(30000); // 30 segundos
        config.setKeepaliveTime(120000); // 2 minutos para mantener conexion activa
        config.setPoolName("SigaHikariPool");

        return new HikariDataSource(config);
    }
}
