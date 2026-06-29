@echo off
chcp 65001 >nul
title SIGA Modern - Monitoreo en Tiempo Real

echo ============================================
echo   SIGA Modern - Monitoreo de Salud
echo ============================================
echo.

cd /d "C:\Users\Leo\Downloads\CDIEM\Siga1-modern"

echo [1/5] Verificando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop NO esta corriendo!
    echo.
    echo Acciones sugeridas:
    echo   1. Abrir Docker Desktop
    echo   2. Esperar a que la ballena este verde
    echo   3. Ejecutar: iniciar.bat
    echo.
    pause
    exit /b 1
)
echo [OK] Docker Desktop activo
echo.

echo [2/5] Verificando contenedores...
docker-compose ps

echo.
echo [3/5] Verificando conectividad backend...

curl -s -o nul -w "%%{http_code}" http://localhost:8080/actuator/health >status.tmp 2>nul
set /p STATUS=<status.tmp
del status.tmp 2>nul

if "%STATUS%"=="200" (
    echo [OK] Backend responde (HTTP 200)
) else (
    echo [ADVERTENCIA] Backend no responde (HTTP %STATUS%)
    echo   Posibles causas:
    echo   - Spring Boot todavia esta arrancando
    echo   - Error de conexion a MySQL
    echo   - Error de compilacion
)

echo.
echo [4/5] Verificando conectividad frontend...

curl -s -o nul -w "%%{http_code}" http://localhost >status.tmp 2>nul
set /p STATUS=<status.tmp
del status.tmp 2>nul

if "%STATUS%"=="200" (
    echo [OK] Frontend responde (HTTP 200)
) else (
    echo [ADVERTENCIA] Frontend no responde (HTTP %STATUS%)
)

echo.
echo [5/5] Verificando conectividad MySQL...
docker exec siga-mysql mysqladmin -uroot -proot ping >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] MySQL no responde al ping
) else (
    echo [OK] MySQL responde
)

echo.
echo ============================================
echo Monitoreo completado.
echo.
echo Para ver logs en tiempo real:
echo   docker-compose logs -f
echo.
echo Para reiniciar todo:
echo   reconstruir.bat
echo ============================================
pause
