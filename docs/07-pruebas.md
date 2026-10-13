# Estrategia y Plan de Pruebas – TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa del pipeline:** 6. Pruebas (integrada desde Desarrollo)  
**Versión:** 1.0  
**Estado:** Plan de pruebas; **ninguna ejecución se presume realizada** por el contenido de este documento.

## 1. Propósito

Establecer qué debe comprobarse, cómo registrar los resultados y cómo vincular cada prueba a historias de usuario, requisitos y commits. Las pruebas se ejecutarán sobre la implementación real de TechTrack; los criterios de aceptación detallados deben cotejarse con los originales de Jira y la revisión HITL de `04-product-backlog.md`.

## 2. Alcance y estrategia

**Componentes previstos:** React/TypeScript, API Node.js/TypeScript, MongoDB y mecanismo de evidencias por decidir. Los tipos concretos de pruebas y herramientas se ajustarán al stack realmente implementado.

| Nivel | Qué comprueba | Ejemplo |
|---|---|---|
| Unitarias | Reglas y validaciones aisladas | Rechazar un estado de tarea no admitido |
| Integración | Conexión API–persistencia–archivos | Crear tarea y recuperar su vínculo con equipo |
| API / seguridad | Autenticación, autorización, validación | Impedir acceso a recurso de otro usuario |
| Funcionales / aceptación | Recorrido desde la perspectiva del actor | Registrar equipo → tarea → intervención → historial |
| Interfaz / responsive | Formularios, estados y tamaños de pantalla | Flujo principal en móvil y escritorio |
| Smoke tras despliegue | Servicios y camino crítico | Acceso, crear tarea y consulta después de publicar |

**Herramientas sugeridas, no acordadas:** Vitest/Jest para unitarias, librería HTTP de pruebas para API y Playwright para E2E. Elegir herramientas compatibles con el código existente antes de implementarlas.

## 3. Trazabilidad HU → pruebas candidatas

Todos los casos tienen **estado inicial: No ejecutado**. Los IDs `CP-...` son propuestos para organizar pruebas, no evidencias de ejecución.

| Caso | Historia / requisito | Escenario a verificar | Resultado esperado |
|---|---|---|---|
| CP-01 | HU01 / RF-01 | Registro con datos válidos | Cuenta creada y confirmación |
| CP-02 | HU01 / RF-01, RNF-03 | Registro inválido e inspección de credencial | Error claro; contraseña no expuesta ni almacenada en claro |
| CP-03 | HU02 / RF-02 | Inicio de sesión correcto | Sesión válida y acceso a vista protegida |
| CP-04 | HU02 / RF-02/03, RNF-01 | Clave errónea y acceso tras cerrar sesión | Acceso denegado |
| CP-05 | HU03 / RF-04 | Registro válido de equipo | Equipo persistido e identificable |
| CP-06 | HU03 / RF-04/05 | Datos inválidos / seleccionar equipo | Validación y recuperación consistentes |
| CP-07 | HU04 / RF-06, RN-01 | Crear tarea sobre equipo existente | Tarea creada con vínculo correcto |
| CP-08 | HU04 / RF-06, RNF-04 | Crear tarea con equipo inexistente | Rechazo sin registro huérfano |
| CP-09 | HU05 / RF-07 | Consultar tareas autorizadas | Listado muestra registros y estados correctos |
| CP-10 | HU05 / RNF-02 | Consultar tarea no permitida | Servidor aplica restricciones de acceso |
| CP-11 | HU06 / RF-08, RN-02 | Actualizar a estado admitido | Cambio persistido y visible |
| CP-12 | HU06 / RF-08 | Estado inválido o cambio sin permiso | Cambio rechazado |
| CP-13 | HU07 / RF-09 | Guardar problema y diagnóstico | Datos asociados a la tarea correcta |
| CP-14 | HU07 / RF-09 | Registrar diagnóstico sobre tarea inexistente | Rechazo controlado |
| CP-15 | HU08 / RF-10 | Guardar actividades y resultado | Información persiste y se recupera |
| CP-16 | HU08 / RN-03 | Intentar vincular intervención con otra tarea | No se mezclan datos de tareas |
| CP-17 | HU09 / RF-11 | Subir imagen permitida | Evidencia accesible desde tarea autorizada |
| CP-18 | HU09 / RNF-07/08 | Archivo inválido, excesivo o consulta no autorizada | Rechazo y archivo no expuesto |
| CP-19 | HU10 / RF-12, RN-04 | Consultar historial de equipo con tareas | Solo muestra intervenciones del equipo solicitado |
| CP-20 | HU10 / RF-12 | Consultar historial vacío | Mensaje de ausencia, sin datos ajenos |
| CP-21 | HU11 / RF-13 | Abrir detalle de tarea | Se muestran los datos y evidencias existentes |
| CP-22 | HU11 / RNF-02 | Abrir detalle inexistente/no autorizado | Respuesta apropiada y sin fuga de datos |
| CP-23 | HU12 / RF-14 | Administrador consulta actividades | Visualización conforme al alcance aprobado |
| CP-24 | HU12 / RNF-02 | Técnico intenta consulta exclusiva admin | Acceso denegado por el backend |

Las reglas abiertas (obligatoriedad de diagnóstico/evidencia, límites de archivos, visibilidad entre técnicos) deben resolverse **antes** de ejecutar sus casos afectados. No convertir una ambigüedad en un resultado ficticio.

## 4. Pruebas no funcionales

| ID | RNF | Método de prueba | Meta / situación |
|---|---|---|---|
| PNF-01 | RNF-01/02 | Acceso anónimo y escalada de rol | Rechazar todas las operaciones no autorizadas |
| PNF-02 | RNF-03 | Revisión de almacenamiento y logs | No contener contraseñas en claro |
| PNF-03 | RNF-04 | Enlaces a IDs inexistentes | No crear referencias huérfanas |
| PNF-04 | RNF-05/06 | Recorrido manual en dos anchos de pantalla | Criterios de usabilidad por aprobar |
| PNF-05 | RNF-07/08 | Archivos no permitidos; URL de archivo sin sesión | Límite y permisos por aprobar |
| PNF-06 | RNF-09 | Medición repetida con escenario reproducible | Tiempo máximo y carga **por aprobar** |
| PNF-07 | RNF-10/12 | Revisión de TypeScript, pruebas y trazabilidad | Sin errores bloqueantes según regla acordada |
| PNF-08 | RNF-11 | Simular error de base de datos/servidor | No confirmar operación fallida |

## 5. Prueba integral prioritaria del MVP

**Código:** E2E-PRINCIPAL.  
**Precondición:** usuario técnico disponible; base de datos y almacenamiento configurados; permisos y datos de prueba definidos.

**Pasos:**

1. Iniciar sesión como técnico.
2. Registrar un equipo de prueba.
3. Crear una tarea vinculada con el equipo.
4. Cambiar el estado de la tarea.
5. Registrar problema y diagnóstico.
6. Registrar intervención y resultado.
7. Adjuntar evidencia válida (si HU09 está implementada).
8. Finalizar la tarea respetando las reglas acordadas.
9. Consultar detalle e historial del equipo.
10. Confirmar que los registros se relacionan con el equipo y usuario correctos.

**Resultado esperado:** el recorrido completo se completa sin pérdida de datos ni acceso indebido. Si una HU no se ha implementado, registrar la limitación en vez de marcar la prueba como aprobada.

## 6. Datos, entornos y criterios de ejecución

- Utilizar **datos ficticios** (equipos de prueba, correos de ensayo, imágenes sin información confidencial).
- Mantener entornos de desarrollo/prueba aislados de información productiva cuando corresponda.
- Preparar al menos dos equipos y usuarios con roles diferentes para verificar separación de datos y permisos.
- Registrar versión/commit, fecha, ejecutor, entorno, comandos utilizados y resultado.
- Si una prueba automatizada falla, conservar log y referencia al defecto; después de corregir, volver a ejecutarla.
- Clasificar cada caso como: **No ejecutado / Aprobado / Fallido / Bloqueado / No aplica (justificado)**.

### 6.1. Formato de reporte de caso

```text
Caso: CP-XX
HU / criterios relacionados:
Fecha y responsable:
Versión / commit:
Entorno y datos de prueba:
Pasos ejecutados:
Resultado esperado:
Resultado observado:
Estado:
Defecto asociado (si aplica):
Evidencia (captura/log/CI):
Validación HITL:
```

## 7. Gestión de defectos

Un defecto debe registrar descripción, severidad, pasos para reproducir, evidencia, componente afectado, HU/criterio, responsable, commit de corrección y resultado de regresión. Las categorías **bloqueante, alta, media, baja** se proponen para seguimiento; la clasificación final corresponde al equipo.

Se recomienda bloquear la aceptación de una HU mientras sus criterios esenciales presenten fallos reproducibles.

## 8. Seguridad específica del uso de IA

Si el **producto** incorpora LLM en una versión futura, será necesario probar inyección de prompts, permisos de herramientas, validación de salidas y filtración de datos. **El MVP vigente no obliga a incorporar LLM en su funcionalidad**, de modo que no se deben registrar como ejecutadas pruebas de un componente que no existe.

Para el **proceso de desarrollo aumentado**, cualquier caso de prueba propuesto o código de pruebas generado por IA deberá revisarse y ejecutarse realmente. No equivale a evidencia una respuesta de IA que diga que las pruebas deberían pasar.

## 9. Evidencia y validación HITL

| Registro | Contenido |
|---|---|
| Entrada a la IA | Criterios, código o especificación entregada (sin secretos) |
| Respuesta original | Propuesta de casos, scripts o diagnóstico |
| Validación humana | Qué se aceptó/modificó/rechazó y motivo |
| Ejecución | Comando, fecha, commit, entorno, salida real |
| Riesgos | Errores o supuestos equivocados propuestos por IA |
| Operación | Capturas, registros o video de demostración reales |

**Ubicaciones:** `docs/evidencias-ia/etapas/06-pruebas/` y `docs/evidencias-ia/historias-usuario/HUxx/`. El **código de pruebas** debe permanecer con el código fuente del repositorio; las evidencias deben vincular a él, sin duplicarlo innecesariamente.

## 10. Condiciones de salida hacia despliegue y evaluación

- Prueba integral prioritaria ejecutada y registrada.
- Criterios de aceptación de HU incluidas en la entrega aprobados sin defectos bloqueantes.
- Errores conocidos y limitaciones documentados.
- Pruebas de autenticación, permisos y archivos ejecutadas según capacidades realmente implementadas.
- Evidencias enlazadas a versiones exactas del código.

**Estado actual de resultados:** sin datos verificados de ejecución aportados para este documento. La tabla de resultados se completará después de ejecutar el software.
