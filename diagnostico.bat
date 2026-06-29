@echo off
chcp 65001 >nul
title SIGA Modern - Diagnosticar Problema
echo ============================================
echo   SIGA Modern - Diagnostico de Errores
echo ============================================
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/5] Verificando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop NO esta corriendo.
    echo Abre Docker Desktop y espera a que la ballena este verde.
    pause
    exit /b 1
)
echo [OK] Docker Desktop activo
echo.

echo [2/5] Verificando si existen contenedores anteriores...
docker ps -a | findstr "siga"
if errorlevel 1 (
    echo [INFO] No hay contenedores SIGA anteriores.
) else (
    echo [INFO] Contenedores SIGA encontrados. Eliminando...
    docker-compose down -v
)
echo.

echo [3/5] Construyendo SOLO el backend (para ver errores de compilacion)...
echo Esto puede tardar 3-5 minutos...
echo.
cd backend
docker build -t siga-backend-test . 2>"%PROJECT_DIR%\build-error.log"
if errorlevel 1 (
    echo [ERROR] El backend NO compila.
    echo.
    echo Revisando el error...
    type "%PROJECT_DIR%\build-error.log" | findstr "ERROR" | head -20
    echo.
    echo El error completo esta en: %PROJECT_DIR%\build-error.log
    pause
    exit /b 1
)
echo [OK] Backend compila correctamente!
cd ..
echo.

echo [4/5] Construyendo SOLO el frontend...
cd frontend
docker build -t siga-frontend-test . 2>"%PROJECT_DIR%\frontend-error.log"
if errorlevel 1 (
    echo [ERROR] El frontend NO compila.
    echo.
    echo Revisando el error...
    type "%PROJECT_DIR%\frontend-error.log" | findstr "ERROR" | head -20
    pause
    exit /b 1
)
echo [OK] Frontend compila correctamente!
cd ..
echo.

echo [5/5] Levantando todo con docker-compose...
docker-compose up --build -d

echo.
echo [OK] SIGA Modern deberia estar levantando...
echo Esperando 20 segundos para que Spring Boot arranque...
timeout /t 20 /nobreak >nul

echo.
echo Verificando estado de los servicios...
docker-compose ps

echo.
echo Logs del backend (ultimas 30 lineas):
docker-compose logs --tail=30 backend

echo.
echo ============================================
echo Si ves "Started SigaApplication" arriba, todo esta OK.
echo Abre tu navegador en: http://localhost
echo ============================================
start http://localhost
pause
