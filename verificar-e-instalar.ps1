# ============================================
# SIGA Modern - Instalador Automático de Dependencias
# ============================================
# Verifica e instala: Docker Desktop, Java 21, Node.js, Maven
# ============================================

param(
    [switch]$Force,
    [switch]$Silent
)

$script:needReboot = $false

# ============================================
# Funciones auxiliares
# ============================================
function Write-Header($text) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Write-Ok($text) {
    Write-Host "  ✓ $text" -ForegroundColor Green
}

function Write-Warn($text) {
    Write-Host "  ⚠ $text" -ForegroundColor Yellow
}

function Write-Err($text) {
    Write-Host "  ✗ $text" -ForegroundColor Red
}

function Test-Port($port) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

function Wait-ForUser($msg) {
    if (-not $Silent) {
        Write-Host "`n$msg" -ForegroundColor Yellow
        pause
    }
}

# ============================================
# 1. Verificar Docker Desktop
# ============================================
function Install-DockerDesktop {
    Write-Header "Verificando Docker Desktop"

    # Verificar si docker command existe
    $dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
    $dockerDesktop = Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" | Where-Object { $_.DisplayName -like "*Docker*" }

    if ($dockerCmd -and $dockerDesktop) {
        Write-Ok "Docker Desktop ya está instalado"
        $ver = docker --version 2>$null
        Write-Ok "Versión: $ver"

        # Verificar si el motor está corriendo
        Write-Host "`n  Verificando motor Docker..." -NoNewline
        $dockerInfo = docker info 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Motor Docker está activo"
            return $true
        } else {
            Write-Warn "Docker está instalado pero el motor no está corriendo"
            Write-Warn "Por favor abre Docker Desktop manualmente y espera a que inicie"
            Wait-ForUser "Presiona cualquier tecla cuando Docker Desktop esté corriendo..."
            return $true
        }
    }

    Write-Warn "Docker Desktop NO está instalado"
    Write-Host "  Descargando Docker Desktop... (puede tardar varios minutos)"

    $dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"

    try {
        # Descargar
        Write-Host "  Descargando desde Docker oficial..." -NoNewline
        Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath -UseBasicParsing
        Write-Ok "Descarga completada"

        # Instalar silenciosamente
        Write-Host "  Instalando Docker Desktop..." -NoNewline
        Start-Process -FilePath $installerPath -ArgumentList "install --quiet --accept-license" -Wait
        Write-Ok "Instalación completada"

        Write-Warn "Docker Desktop requiere reiniciar Windows para habilitar WSL 2"
        $script:needReboot = $true

        Wait-ForUser "Reinicia Windows, abre Docker Desktop y vuelve a ejecutar iniciar.bat"
        return $false
    } catch {
        Write-Err "Error al descargar/instalar Docker: $_"
        Write-Err "Descarga manual desde: https://www.docker.com/products/docker-desktop/"
        return $false
    }
}

# ============================================
# 2. Verificar WSL 2 (Windows Subsystem for Linux)
# ============================================
function Test-WSL2 {
    Write-Header "Verificando WSL 2"

    $wsl = Get-Command wsl -ErrorAction SilentlyContinue
    if (-not $wsl) {
        Write-Warn "WSL no está instalado. Docker Desktop lo requiere."
        Write-Host "  Instalando WSL..." -NoNewline
        try {
            wsl --install --no-distribution 2>$null
            Write-Ok "WSL instalado"
            $script:needReboot = $true
        } catch {
            Write-Err "No se pudo instalar WSL automáticamente"
            Write-Err "Ejecuta manualmente como admin: wsl --install"
            return $false
        }
    } else {
        Write-Ok "WSL está instalado"
    }
    return $true
}

# ============================================
# 3. Verificar Java 21
# ============================================
function Install-Java21 {
    Write-Header "Verificando Java 21"

    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCmd) {
        $javaVersion = & java -version 2>&1 | Select-String -Pattern '"(\d+)' | ForEach-Object { $_.Matches.Groups[1].Value }
        if ($javaVersion -ge 21) {
            Write-Ok "Java $javaVersion está instalado"
            return $true
        } else {
            Write-Warn "Java $javaVersion encontrado, pero se requiere Java 21+"
        }
    } else {
        Write-Warn "Java no está instalado"
    }

    Write-Host "  Descargando OpenJDK 21 (Eclipse Temurin)..." -NoNewline
    $jdkUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jdk_x64_windows_hotspot_21.0.3_9.msi"
    $jdkInstaller = "$env:TEMP\OpenJDK21.msi"

    try {
        Invoke-WebRequest -Uri $jdkUrl -OutFile $jdkInstaller -UseBasicParsing
        Write-Ok "Descarga completada"

        Write-Host "  Instalando OpenJDK 21..." -NoNewline
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$jdkInstaller`" /qn /norestart" -Wait
        Write-Ok "Java 21 instalado"

        # Agregar al PATH si no está
        $javaPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot\bin"
        if (Test-Path $javaPath) {
            [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$javaPath", "Machine")
            $env:Path += ";$javaPath"
        }
        return $true
    } catch {
        Write-Err "Error al instalar Java 21: $_"
        Write-Err "Descarga manual desde: https://adoptium.net/"
        return $false
    }
}

# ============================================
# 4. Verificar Maven
# ============================================
function Install-Maven {
    Write-Header "Verificando Maven"

    $mvn = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvn) {
        $mvnVersion = mvn -version 2>&1 | Select-String -Pattern "Apache Maven (\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
        Write-Ok "Maven $mvnVersion está instalado"
        return $true
    }

    Write-Warn "Maven no está instalado"
    Write-Host "  Buscando Maven descargado manualmente..." -NoNewline

    # Verificar si el usuario ya descargó y extrajo Maven
    $manualMavenDir = "C:\apache-maven-3.9.16"
    if (Test-Path "$manualMavenDir\bin\mvn.cmd") {
        Write-Ok "Maven encontrado en $manualMavenDir"
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$manualMavenDir\bin", "Machine")
        $env:Path += ";$manualMavenDir\bin"
        Write-Ok "Maven agregado al PATH"
        return $true
    }

    Write-Warn "No se encontró Maven en $manualMavenDir"
    Write-Host "  Descargando Apache Maven 3.9..." -NoNewline

    $mavenVersion = "3.9.9"
    $mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $mavenZip = "$env:TEMP\apache-maven.zip"
    $mavenDir = "C:\apache-maven-$mavenVersion"

    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip -UseBasicParsing
        Write-Ok "Descarga completada"

        Write-Host "  Extrayendo Maven..." -NoNewline
        Expand-Archive -Path $mavenZip -DestinationPath "C:\" -Force
        Write-Ok "Maven extraído"

        # Agregar al PATH
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$mavenDir\bin", "Machine")
        $env:Path += ";$mavenDir\bin"
        Write-Ok "Maven agregado al PATH"
        return $true
    } catch {
        Write-Err "Error al instalar Maven: $_"
        Write-Err "Descarga manual desde: https://maven.apache.org/download.cgi"
        Write-Warn "Nota: Maven NO es necesario para ejecutar SIGA con Docker."
        Write-Warn "Podes ejecutar iniciar.bat de todos modos."
        return $false
    }
}

# ============================================
# 5. Verificar Node.js
# ============================================
function Install-NodeJS {
    Write-Header "Verificando Node.js"

    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        $nodeVersion = node --version 2>$null
        $majorVersion = [int]($nodeVersion -replace '^v','').Split('.')[0]
        if ($majorVersion -ge 20) {
            Write-Ok "Node.js $nodeVersion está instalado"
            return $true
        } else {
            Write-Warn "Node.js $nodeVersion encontrado, pero se requiere 20+"
        }
    } else {
        Write-Warn "Node.js no está instalado"
    }

    Write-Host "  Descargando Node.js 20 LTS..." -NoNewline
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $nodeInstaller = "$env:TEMP\nodejs20.msi"

    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Write-Ok "Descarga completada"

        Write-Host "  Instalando Node.js..." -NoNewline
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$nodeInstaller`" /qn /norestart" -Wait
        Write-Ok "Node.js 20 instalado"

        # Refrescar PATH
        $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine")
        return $true
    } catch {
        Write-Err "Error al instalar Node.js: $_"
        Write-Err "Descarga manual desde: https://nodejs.org/"
        return $false
    }
}

# ============================================
# 6. Verificar Git (opcional, útil para el proyecto)
# ============================================
function Install-Git {
    Write-Header "Verificando Git"

    $git = Get-Command git -ErrorAction SilentlyContinue
    if ($git) {
        $gitVersion = git --version 2>$null
        Write-Ok "Git está instalado ($gitVersion)"
        return $true
    }

    Write-Warn "Git no está instalado (opcional, pero recomendado)"
    Write-Host "  Descargando Git for Windows..." -NoNewline

    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $gitInstaller = "$env:TEMP\git-installer.exe"

    try {
        Invoke-WebRequest -Uri $gitUrl -OutFile $gitInstaller -UseBasicParsing
        Write-Ok "Descarga completada"

        Write-Host "  Instalando Git..." -NoNewline
        Start-Process -FilePath $gitInstaller -ArgumentList "/VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS=`"icons,ext\reg	htHereFolder,assoc,assoc_sh`"" -Wait
        Write-Ok "Git instalado"

        # Refrescar PATH
        $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine")
        return $true
    } catch {
        Write-Warn "Git no se pudo instalar automáticamente"
        return $false
    }
}

# ============================================
# Ejecución principal
# ============================================
Write-Host "`n`n"
Write-Header "SIGA Modern - Verificador de Dependencias"
Write-Host "  Este script verificará e instalará todo lo necesario"
Write-Host "  para ejecutar SIGA Modern en tu máquina."

if (-not $Silent) {
    Write-Host "`n"
    pause
}

$results = @()

# Ejecutar verificaciones
$results += Install-DockerDesktop
$results += Test-WSL2
$results += Install-Java21
$results += Install-Maven
$results += Install-NodeJS
$results += Install-Git

# ============================================
# Resumen
# ============================================
Write-Header "Resumen de Verificación"

$allOk = $results -notcontains $false

if ($script:needReboot) {
    Write-Warn "Se requiere REINICIAR Windows antes de continuar"
    Write-Warn "Después del reinicio, abrí Docker Desktop y ejecutá: iniciar.bat"
    if (-not $Silent) {
        Write-Host "`n"
        pause
    }
    exit 1
}

if ($allOk) {
    Write-Ok "TODAS las dependencias están instaladas y listas"
    Write-Host "`n"
    Write-Host "  Puedes ejecutar ahora:" -ForegroundColor Green
    Write-Host "    .\iniciar.bat" -ForegroundColor Cyan
    Write-Host "`n"

    $startNow = Read-Host "  ¿Querés iniciar SIGA Modern ahora? (S/N)"
    if ($startNow -eq 'S' -or $startNow -eq 's') {
        $scriptDir = Split-Path -Parent $PSCommandPath
        $iniciarPath = Join-Path $scriptDir "iniciar.bat"
        if (Test-Path $iniciarPath) {
            Start-Process -FilePath $iniciarPath
        } else {
            Write-Err "No se encontró iniciar.bat en $scriptDir"
        }
    }
} else {
    Write-Err "Algunas dependencias no pudieron instalarse automáticamente"
    Write-Err "Revisa los errores arriba y corrígelos manualmente"
    if (-not $Silent) {
        Write-Host "`n"
        pause
    }
    exit 1
}
