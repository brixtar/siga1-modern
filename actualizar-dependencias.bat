@echo off
chcp 65001 >nul
title SIGA Modern - Actualizador de Dependencias

echo ============================================
echo   SIGA Modern - Actualizador de Dependencias
echo ============================================
echo.
echo Este script verificara si tus programas estan
echo actualizados y actualizara los que pueda.
echo.

set SCRIPT_DIR=%~dp0
set PS_SCRIPT=%SCRIPT_DIR%actualizar-dependencias.ps1

if not exist "%PS_SCRIPT%" (
    echo [ERROR] No se encontro: actualizar-dependencias.ps1
    pause
    exit /b 1
)

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%PS_SCRIPT%"

if %errorlevel% neq 0 (
    echo.
    echo [ADVERTENCIA] Algunas verificaciones fallaron.
    pause
)
