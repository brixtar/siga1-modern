# ==========================================================
# Multi-stage Dockerfile for Unified Production Deployment (Render / Cloud)
# Builds Vite Frontend + Spring Boot Backend into a Single Optimized Image
# ==========================================================

# --- Stage 1: Build Frontend (React + Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend with embedded Frontend ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/src ./src
# Embed frontend dist into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# --- Stage 3: Lightweight Production Runtime (JRE 21) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S siga && adduser -S siga -G siga
USER siga:siga

COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-8080} -jar app.jar"]
