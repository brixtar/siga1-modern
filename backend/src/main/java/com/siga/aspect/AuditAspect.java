package com.siga.aspect;

import com.siga.entity.Auditoria;
import com.siga.repository.AuditoriaRepository;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class AuditAspect {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @Around("execution(* com.siga.service.*Service.create*(..)) || " +
            "execution(* com.siga.service.*Service.update*(..)) || " +
            "execution(* com.siga.service.*Service.delete*(..))")
    public Object audit(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String entityName = className.replace("Service", "");

        // Determinar accion
        String accion = "UNKNOWN";
        if (methodName.startsWith("create")) {
            accion = "CREATE";
        } else if (methodName.startsWith("update")) {
            accion = "UPDATE";
        } else if (methodName.startsWith("delete")) {
            accion = "DELETE";
        }

        // Obtener argumentos antes de ejecutar (para registrar el ID si se borra)
        Object[] args = joinPoint.getArgs();
        Long recordId = null;
        if (accion.equals("DELETE") || accion.equals("UPDATE")) {
            if (args.length > 0 && args[0] instanceof Long) {
                recordId = (Long) args[0];
            }
        }

        // Ejecutar el metodo original
        Object result = joinPoint.proceed();

        // Si la ejecucion fue exitosa, registrar auditoria
        try {
            // Extraer ID si fue creacion
            if (accion.equals("CREATE") && result != null) {
                try {
                    java.lang.reflect.Method getIdMethod = result.getClass().getMethod("getId");
                    Object idObj = getIdMethod.invoke(result);
                    if (idObj instanceof Long) {
                        recordId = (Long) idObj;
                    }
                } catch (Exception ignored) {
                }
            }

            // Obtener usuario autenticado actual
            String username = "SYSTEM";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                username = auth.getName();
            }

            // Serializar detalles simples de forma segura sin disparar circularidad o N+1 queries
            String detalles = String.format("Metodo: %s. Parametros: %s", 
                    methodName, getSafeArgsString(args));
            if ((accion.equals("CREATE") || accion.equals("UPDATE")) && result != null) {
                detalles += " | Resultado: " + getSafeEntityString(result);
            }

            Auditoria auditoria = Auditoria.builder()
                    .username(username)
                    .accion(accion)
                    .tabla(entityName.toLowerCase())
                    .registroId(recordId)
                    .detalles(detalles)
                    .fecha(LocalDateTime.now())
                    .build();

            auditoriaRepository.save(auditoria);
            log.info("[AuditAspect] Auditoria registrada: {} en tabla {} (ID: {}) por el usuario {}", 
                    accion, entityName, recordId, username);

        } catch (Exception e) {
            log.error("[AuditAspect] Error al guardar auditoria", e);
        }

        return result;
    }

    private String getSafeArgsString(Object[] args) {
        if (args == null) return "[]";
        java.util.List<String> formattedArgs = new java.util.ArrayList<>();
        for (Object arg : args) {
            formattedArgs.add(getSafeEntityString(arg));
        }
        return formattedArgs.toString();
    }

    private String getSafeEntityString(Object entity) {
        if (entity == null) return "null";
        
        if (entity instanceof java.util.Collection) {
            java.util.Collection<?> col = (java.util.Collection<?>) entity;
            java.util.List<String> items = new java.util.ArrayList<>();
            for (Object obj : col) {
                items.add(getSafeSingleEntityString(obj));
            }
            return items.toString();
        }
        
        return getSafeSingleEntityString(entity);
    }
    
    private String getSafeSingleEntityString(Object entity) {
        if (entity == null) return "null";
        
        String packageName = entity.getClass().getPackageName();
        if (packageName.startsWith("java.lang") || packageName.startsWith("java.time") || entity instanceof Number || entity instanceof Boolean) {
            return entity.toString();
        }
        
        if (packageName.startsWith("com.siga.entity")) {
            Long id = null;
            try {
                java.lang.reflect.Method getIdMethod = entity.getClass().getMethod("getId");
                Object idObj = getIdMethod.invoke(entity);
                if (idObj instanceof Long) {
                    id = (Long) idObj;
                }
            } catch (Exception ignored) {}
            
            String className = entity.getClass().getSimpleName();
            return String.format("%s[id=%s]", className, id != null ? id : "null");
        }
        
        try {
            return entity.toString();
        } catch (Exception e) {
            return entity.getClass().getSimpleName();
        }
    }
}
