@echo off
chcp 65001 >nul
title SIGA Modern - Instalador de Dependencias

echo ============================================
echo   SIGA Modern - Instalador de Dependencias
echo ============================================
echo.
echo Este script verificara e instalara automaticamente:
echo   - Docker Desktop  (necesario)
echo   - WSL 2           (necesario para Docker)
echo   - Java 21 JDK     (necesario para compilar)
echo   - Maven 3.9       (necesario para compilar)
echo   - Node.js 20      (necesario para compilar)
echo   - Git             (opcional pero recomendado)
echo.
echo NOTA: Se requieren permisos de Administrador.
echo.

REM Verificar si estamos como admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando permisos de Administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo [OK] Ejecutando con permisos de Administrador
echo.

set SCRIPT_DIR=%~dp0
set PS_SCRIPT=%SCRIPT_DIR%verificar-e-instalar.ps1

REM Verificar que existe el script de PowerShell
if not exist "%PS_SCRIPT%" (
    echo [ERROR] No se encontro: verificar-e-instalar.ps1
    pause
    exit /b 1
)

REM Ejecutar el script de PowerShell con bypass de politicas de ejecucion
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%PS_SCRIPT%"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Algunas dependencias no se pudieron instalar.
    echo Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Proceso completado.
echo ============================================
pause
