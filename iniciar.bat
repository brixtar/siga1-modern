@echo off
chcp 65001 >nul
title SIGA Modern - Sistema de Gestion de Animales

echo ========================================================
echo        🐾 S.I.G.A. Modern - UNLaR Chamical
echo ========================================================
echo.

:: Verificar si Docker esta instalado
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta instalado en este equipo.
    echo Por favor descargue e instale Docker Desktop: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

:: Verificar si Docker Daemon esta corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Iniciando Docker Desktop, aguarde unos segundos...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    :: Esperar hasta que Docker responda
    :esperar_docker
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo    Esperando a que el motor de Docker responda...
        goto esperar_docker
    )
    echo [OK] Motor Docker listo.
)

echo.
echo [*] Levantando contenedores (Frontend, Backend, Base de Datos)...
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [OK] SIGA Modern se ha iniciado correctamente!
    echo ========================================================
    echo  Acceso Web: http://localhost
    echo  Usuario Admin: admin_siga_chamical
    echo  Contrasena:    S1gA#Adm!n2026$Ch4m
    echo ========================================================
    echo.
    start http://localhost
) else (
    echo.
    echo [ERROR] Hubo un problema al levantar los contenedores.
    echo Revisa los mensajes anteriores para mas detalles.
)

pause
