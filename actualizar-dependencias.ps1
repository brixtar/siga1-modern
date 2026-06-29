# ============================================
# SIGA Modern - Actualizador de Dependencias
# ============================================
# Actualiza: Docker Desktop, Java, Node.js, Maven, Git
# ============================================

param([switch]$Silent)

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

function Write-Info($text) {
    Write-Host "  ℹ $text" -ForegroundColor Blue
}

Write-Header "SIGA Modern - Actualizador de Dependencias"

# Docker Desktop
Write-Header "Actualizando Docker Desktop"
$dockerInstalled = Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" | Where-Object { $_.DisplayName -like "*Docker*" }
if ($dockerInstalled) {
    Write-Info "Docker Desktop detectado. Buscando actualizaciones..."
    Write-Warn "Docker Desktop se actualiza automaticamente."
    Write-Warn "Si hay una nueva version, abre Docker Desktop y busca 'Check for Updates'"
    try {
        docker --version 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Docker Desktop esta corriendo"
        } else {
            Write-Warn "Docker Desktop esta instalado pero no corriendo. Abrelo manualmente."
        }
    } catch {
        Write-Warn "No se pudo verificar el estado de Docker"
    }
} else {
    Write-Warn "Docker Desktop no esta instalado. Ejecuta instalar-dependencias.bat primero."
}

# Java
Write-Header "Actualizando Java"
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if ($javaCmd) {
    $javaVersion = & java -version 2>&1 | Select-String -Pattern '"(\d+)' | ForEach-Object { $_.Matches.Groups[1].Value }
    Write-Info "Java version detectada: $javaVersion"
    if ($javaVersion -ge 21) {
        Write-Ok "Java esta actualizado (21+)"
    } else {
        Write-Warn "Java $javaVersion es anterior a 21. Considere actualizar."
    }
} else {
    Write-Warn "Java no encontrado. Ejecuta instalar-dependencias.bat"
}

# Node.js
Write-Header "Actualizando Node.js"
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $nodeVersion = node --version 2>$null
    $majorVersion = [int]($nodeVersion -replace '^v','').Split('.')[0]
    Write-Info "Node.js version detectada: $nodeVersion"
    if ($majorVersion -ge 20) {
        Write-Ok "Node.js esta actualizado (20+)"
    } else {
        Write-Warn "Node.js $nodeVersion es anterior a 20. Considere actualizar."
        Write-Info "Descargando Node.js 20 LTS..."
        $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
        $nodeInstaller = "$env:TEMP\nodejs20-update.msi"
        try {
            Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
            Write-Ok "Descarga completada"
            Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$nodeInstaller`" /qn /norestart" -Wait
            Write-Ok "Node.js actualizado a 20.x"
            $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine")
        } catch {
            Write-Warn "Error al actualizar Node.js: $_"
        }
    }
} else {
    Write-Warn "Node.js no encontrado. Ejecuta instalar-dependencias.bat"
}

# Maven
Write-Header "Actualizando Maven"
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnCmd) {
    $mvnVersion = mvn -version 2>&1 | Select-String -Pattern "Apache Maven (\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    Write-Info "Maven version detectada: $mvnVersion"
    Write-Ok "Maven esta instalado"
} else {
    Write-Warn "Maven no encontrado. Ejecuta instalar-dependencias.bat"
}

# Git
Write-Header "Actualizando Git"
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if ($gitCmd) {
    $gitVersion = git --version 2>$null
    Write-Info "Git version detectada: $gitVersion"
    Write-Ok "Git esta instalado"
} else {
    Write-Warn "Git no encontrado. Ejecuta instalar-dependencias.bat"
}

# Verificar puertos
Write-Header "Verificando Puertos Disponibles"
$ports = @(80, 8080, 3307)
foreach ($port in $ports) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        $listener.Stop()
        Write-Ok "Puerto $port esta disponible"
    } catch {
        Write-Warn "Puerto $port esta OCUPADO. Si SIGA falla al iniciar, libera este puerto."
    }
}

Write-Header "Resumen de Actualizacion"
Write-Ok "Verificacion completada"
if (-not $Silent) {
    Write-Host "`n"
    pause
}
