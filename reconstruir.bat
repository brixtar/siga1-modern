@echo off
chcp 65001 >nul
title SIGA Modern - Reconstruccion Completa
echo ============================================
echo   SIGA Modern - Reconstruccion sin Cache
echo ============================================
echo.

cd /d "C:\Users\Leo\Downloads\CDIEM\Siga1-modern"

echo [1/5] Deteniendo y eliminando contenedores...
docker-compose down -v
docker system prune -f
echo.

echo [2/5] Reconstruyendo backend SIN cache (para incluir DataInitializer)...
docker-compose build --no-cache backend
if errorlevel 1 (
    echo [ERROR] Fallo la compilacion del backend
    pause
    exit /b 1
)
echo.

echo [3/5] Reconstruyendo frontend...
docker-compose build --no-cache frontend
if errorlevel 1 (
    echo [ERROR] Fallo la compilacion del frontend
    pause
    exit /b 1
)
echo.

echo [4/5] Iniciando servicios...
docker-compose up -d
echo.

echo [5/5] Esperando 30 segundos a que Spring Boot arranque...
timeout /t 30 /nobreak >nul

echo.
echo Verificando estado...
docker-compose ps

echo.
echo Logs del backend (ultimas 50 lineas):
docker-compose logs --tail=50 backend

echo.
echo ============================================
echo Si ves "[DataInitializer] Usuario admin creado" arriba, todo OK.
echo Abre tu navegador en: http://localhost
echo Login: admin / admin123
echo ============================================
start http://localhost
pause
