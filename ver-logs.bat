@echo off
chcp 65001 >nul
title SIGA Modern - Logs en Tiempo Real
echo ============================================
echo   SIGA Modern - Logs en Tiempo Real
echo ============================================
echo.
echo Presiona Ctrl+C para salir
echo.

cd /d "C:\Users\Leo\Downloads\CDIEM\Siga1-modern"

echo [1] Logs de TODOS los servicios:
echo.
docker-compose logs -f --tail=50
