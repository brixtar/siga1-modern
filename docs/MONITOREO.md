# Monitoreo de SIGA Modern

## Scripts disponibles

| Script | Función | Uso |
|--------|---------|-----|
| `iniciar.bat` | Levanta SIGA Modern | Doble clic |
| `reconstruir.bat` | Reconstruye todo sin cache | Cuando falla la compilación |
| `monitoreo.bat` | Verifica salud de todos los servicios | Doble clic |
| `ver-logs.bat` | Muestra logs en tiempo real | Doble clic |
| `health-check.ps1` | Health check automático | Programar con Task Scheduler |
| `instalar-dependencias.bat` | Instala Docker, Java, Node, Maven | Primera vez |
| `actualizar-dependencias.bat` | Actualiza dependencias | Cada mes |

## Monitoreo automático (Kimi Work)

Yo (como agente) reviso automáticamente el estado de SIGA cada **5 minutos**.
- Si detecto un problema, te aviso con instrucciones para arreglarlo
- Si todo está OK, reporto que SIGA está funcionando correctamente

## Programar monitoreo local (Windows Task Scheduler)

Si querés que tu PC verifique automáticamente cada 5 minutos:

1. Presiona `Win + R`, escribe `taskschd.msc` y dale **Enter**
2. En el panel derecho, haz clic en **"Crear tarea básica..."**
3. Nombre: `SIGA Health Check`
4. Activador: **"Diariamente"** (o "Al iniciar sesión")
5. Acción: **"Iniciar un programa"**
6. Programa: `powershell.exe`
7. Argumentos: `-ExecutionPolicy Bypass -File "C:\Users\Leo\Downloads\CDIEM\Siga1-modern\health-check.ps1"`
8. En la pestaña **"Desencadenadores"**, edita y cambia a **"Repetir cada: 5 minutos"**
9. Guardá

## Logs de salud

Los resultados del health check se guardan en:
```
C:\Users\Leo\Downloads\CDIEM\Siga1-modern\health-check.log
```

Abrí ese archivo con el Bloc de Notas para ver el historial.

## Troubleshooting rápido

| Problema | Solución |
|----------|----------|
| "Network Error" en login | El backend no está listo. Esperá 30 segundos y recargá |
| "Docker no está corriendo" | Abrir Docker Desktop y esperar a la ballena verde |
| Puerto 80 ocupado | Cerrar Skype, IIS, XAMPP, o cambiar el puerto en docker-compose.yml |
| El backend no compila | Ejecutar `reconstruir.bat` (sin cache) |
| MySQL no responde | `docker-compose restart db` |
| Quiero ver qué pasa | Ejecutar `ver-logs.bat` |
