# ============================================
# SIGA Modern - Health Check Auto-Repair
# Verifica cada 5 minutos y reinicia si falla
# ============================================
# Guardar como: health-check.ps1
# Programar con Task Scheduler cada 5 minutos
# ============================================

$projectDir = "C:\Users\Leo\Downloads\CDIEM\Siga1-modern"
$logFile = "$projectDir\health-check.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Write-Log($message) {
    $line = "[$timestamp] $message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

Set-Location $projectDir

Write-Log "=== Health Check iniciado ==="

# 1. Verificar Docker Desktop
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "[ERROR] Docker Desktop no esta corriendo. Abortando."
        exit 1
    }
    Write-Log "[OK] Docker Desktop activo"
} catch {
    Write-Log "[ERROR] No se puede ejecutar docker: $_"
    exit 1
}

# 2. Verificar contenedores
$containers = docker-compose ps -q 2>$null
if (-not $containers) {
    Write-Log "[ADVERTENCIA] No hay contenedores corriendo. Intentando iniciar..."
    docker-compose up -d
    Start-Sleep -Seconds 60
    Write-Log "[INFO] Contenedores iniciados"
}

# 3. Verificar backend (HTTP 200)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/public/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Log "[OK] Backend responde HTTP 200"
    } else {
        Write-Log "[ADVERTENCIA] Backend responde HTTP $($response.StatusCode)"
    }
} catch {
    Write-Log "[ADVERTENCIA] Backend no responde. Verificando logs..."
    docker-compose logs --tail=20 backend >> $logFile
}

# 4. Verificar frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Log "[OK] Frontend responde HTTP 200"
    }
} catch {
    Write-Log "[ADVERTENCIA] Frontend no responde"
}

# 5. Verificar MySQL
try {
    docker exec siga-mysql mysqladmin -uroot -proot ping > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Log "[OK] MySQL responde"
    } else {
        Write-Log "[ADVERTENCIA] MySQL no responde"
    }
} catch {
    Write-Log "[ADVERTENCIA] MySQL no responde: $_"
}

Write-Log "=== Health Check completado ==="
