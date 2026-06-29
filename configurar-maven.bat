@echo off
chcp 65001 >nul
title SIGA Modern - Configurar Maven Manual
echo ============================================
echo   Configurando Apache Maven 3.9.16
echo ============================================
echo.

set MAVEN_ZIP=C:\Users\Leo\Downloads\apache-maven-3.9.16-bin.zip
set MAVEN_DIR=C:\apache-maven-3.9.16

REM Verificar que el ZIP existe
if not exist "%MAVEN_ZIP%" (
    echo [ERROR] No se encontro el archivo:
    echo   %MAVEN_ZIP%
    echo.
    echo Asegurate de haberlo descargado primero.
    pause
    exit /b 1
)

echo [OK] Archivo ZIP encontrado: %MAVEN_ZIP%
echo.

REM Verificar si ya esta extraido
if exist "%MAVEN_DIR%" (
    echo [INFO] Maven ya parece estar extraido en:
    echo   %MAVEN_DIR%
    echo.
    choice /C SN /M "Deseas re-extraerlo?"
    if errorlevel 2 goto :SKIP_EXTRACT
    rmdir /S /Q "%MAVEN_DIR%"
)

echo [1/3] Extrayendo Maven a C:\ ...
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath 'C:\' -Force"
if errorlevel 1 (
    echo [ERROR] No se pudo extraer el ZIP.
    echo Intenta extraerlo manualmente con WinRAR/7-Zip a C:\
    pause
    exit /b 1
)
echo [OK] Maven extraido en: %MAVEN_DIR%

:SKIP_EXTRACT
REM Verificar que mvn.cmd existe
if not exist "%MAVEN_DIR%\bin\mvn.cmd" (
    echo [ERROR] No se encontro mvn.cmd en %MAVEN_DIR%\bin\
    echo Contenido de %MAVEN_DIR%:
    dir "%MAVEN_DIR%" /b
    pause
    exit /b 1
)

echo [OK] mvn.cmd verificado

REM Agregar al PATH de usuario
echo.
echo [2/3] Agregando Maven al PATH...
setx PATH "%MAVEN_DIR%\bin;%PATH%" /M >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] No se pudo agregar al PATH del sistema (requiere admin).
    echo Agregando al PATH de usuario...
    setx PATH "%MAVEN_DIR%\bin;%PATH%" >nul 2>&1
)

REM Actualizar PATH en la sesion actual
set "PATH=%MAVEN_DIR%\bin;%PATH%"

echo [OK] Maven agregado al PATH

REM Verificar
echo.
echo [3/3] Verificando instalacion...
mvn -version
echo.

if errorlevel 1 (
    echo [ERROR] Maven no se ejecuto correctamente.
    echo Intenta cerrar y abrir esta ventana de CMD.
    pause
    exit /b 1
)

echo ============================================
echo [OK] Maven 3.9.16 configurado correctamente!
echo ============================================
echo.
echo Ahora podes ejecutar:
echo   .
staler-dependencias.bat   (para verificar que todo este OK)
echo   .
iciar.bat                  (para levantar SIGA Modern)
echo.
pause
