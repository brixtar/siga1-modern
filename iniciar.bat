@echo off
chcp 65001 >nul
title SIGA Modern - Iniciador
echo ============================================
echo   SIGA Modern - Iniciador Automatico
echo ============================================
echo.
echo Verificando Docker Desktop...

docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Docker Desktop no esta corriendo.
    echo.
    echo Por favor:
    echo 1. Abre Docker Desktop (la app con la ballena)
    echo 2. Espera a que aparezca el checkmark verde
    echo 3. Vuelve a ejecutar este script
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop esta activo
echo.

set PROJECT_DIR=%~dp0

echo Navegando a: %PROJECT_DIR%
cd /d "%PROJECT_DIR%"

echo.
echo ============================================
echo Construyendo e iniciando SIGA Modern...
echo (Primera vez: puede tardar 5-10 minutos)
echo ============================================
echo.

REM Limpiar contenedores anteriores si existen
echo [1/3] Deteniendo contenedores previos (si existen)...
docker-compose down >nul 2>&1

echo [2/3] Construyendo imagenes y levantando servicios...
docker-compose up --build -d

if errorlevel 1 (
    echo.
    echo [ERROR] Ocurrio un error al construir los contenedores.
    echo Revisa los logs con: docker-compose logs
    pause
    exit /b 1
)

echo.
echo [3/3] Esperando a que los servicios esten listos...

REM Esperar 15 segundos para que Spring Boot arranque
timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo [OK] SIGA Modern esta corriendo!
echo ============================================
echo.
echo Abre tu navegador y ve a:
echo    http://localhost
echo.
echo Credenciales de login:
echo    Usuario:  admin
echo    Password: admin123
echo.
echo Para ver logs en tiempo real:
echo    docker-compose logs -f
echo.
echo Para detener:
echo    docker-compose down
echo.

start http://localhost

pause
