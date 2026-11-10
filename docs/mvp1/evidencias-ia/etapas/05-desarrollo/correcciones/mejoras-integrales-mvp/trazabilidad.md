# Trazabilidad de las correcciones

Base: HEAD `6021f89bcd4926f91cfb7f4283231fb7731ebe09`, rama `fix/mejoras-integrales-mvp`. HU10 corresponde a historial y HU11 a detalle según Jira.

## Defectos, archivos y pruebas

| Defecto / HU | Archivos de implementación | Pruebas ejecutadas | Resultado |
|---|---|---|---|
| D01 / HU02, HU05, HU07, HU08, HU09, HU10, HU11, HU12 | `front/src/TechTrackApp.tsx`, `front/src/api.ts`, `front/src/components/AuthScreen.tsx` | Navegador: login pendiente y evento de otra sesión; A → historial/detalle/imagen → logout demorado → B; detalle e historial tardíos; imagen tardía; respuesta JSON que ignora cancelación; detalle 404. Backend: permisos, rol y filtros de propietario | Aprobadas en entorno aislado; sin datos A observados con perfil B en las mutaciones DOM vigiladas |
| D02 / HU03, HU04, HU06, HU07, HU09, HU10, HU11, HU12 | `back/src/middleware/validateObjectId.ts`, las tres rutas de tareas/equipos/admin | 10 variantes de rutas con ID mal formado; 8 con ID válido inexistente; anónimo 401; técnico ante admin 403; recurso ajeno 404 | Aprobadas: 400 controlado antes de consultas; se conservan 404/401/403 |
| D03 / HU06, HU07, HU08, HU09, HU11 | `front/src/TechTrackApp.tsx` | Navegador: cinco campos pendientes bloquean completar, guardado en curso bloquea estado, guardar/completar/recargar conserva valores, error de guardado conserva borrador, adjuntar imagen conserva borrador. Backend: completar conserva documentación/evidencias y bloquea edición/carga posterior | Aprobadas con API/modelos simulados; no es validación de persistencia Atlas |
| D04 / HU12 | Ningún cambio de alcance | Inspección: formulario de asignación en supervisión, revisión de solo lectura; criterio oficial de Jira consultado | Pendiente por decisión del usuario; propuesta de separación documentada |
| D05 / HU01, HU02 | `front/src/api.ts` | Express `/auth/me` mantiene `id`; adapter de navegador produce el `User` esperado con `_id` | Aprobadas; no se atribuye una falla funcional previa no reproducida |
| D06 / HU05, HU09, HU10, HU11, HU12 | `back/src/modules/tasks/taskEvidence.ts`, las tres rutas de tareas/equipos/admin | Comparación exacta de metadatos en lista, historial, detalle, supervisión y detalle admin; filtros tarea/propietario; MIME y no-store del contenido | Aprobadas con modelos simulados; recuperación y acceso real en Atlas pendientes |

Las pruebas HTTP se agrupan en ocho casos nuevos: cada uno contiene varias solicitudes y aserciones. Las 14 pruebas del backend y los 10 escenarios de navegador son unidades diferentes; no se suman como criterios de aceptación de Jira ni como cobertura porcentual.

## Inventario completo de código modificado o añadido

| Archivo | Responsabilidad |
|---|---|
| `back/src/modules/tasks/task.routes.ts` | Parámetros validados y metadatos compartidos de lista/detalle/respuestas de actualización |
| `back/src/modules/equipment/equipment.routes.ts` | Parámetros validados y evidencias consistentes en historial |
| `back/src/modules/admin/admin.routes.ts` | Parámetros validados y metadatos consistentes para consulta administrativa |
| `back/src/middleware/validateObjectId.ts` | Nuevo validador HTTP de ObjectId |
| `back/src/modules/tasks/taskEvidence.ts` | Nueva consulta y proyección común de metadatos |
| `back/src/regression.test.ts` | Ocho casos HTTP aislados contra Express real |
| `back/package.json` | Incluye la regresión en `npm test` |
| `front/src/TechTrackApp.tsx` | Límite de sesión, descarte de solicitudes anteriores y borrador controlado |
| `front/src/api.ts` | Transporte cancelable y adaptación de `id` a `_id` |
| `front/src/components/AuthScreen.tsx` | Cancela login/registro pendiente al desmontarse el acceso |
| `front/tests/regression.mjs` | Diez escenarios automatizados de navegador con API simulada |
| `front/package.json` | Comando `test:regression` |

No se modificaron modelos, índices, reglas de unicidad, criterios de Jira ni archivos de configuración con secretos. Los package-lock permanecieron sin cambios. `.gitignore` ya estaba modificado antes de esta intervención y no se editó.

## Evidencias nuevas

- [prompt.md](prompt.md): instrucción completa, idéntica al adjunto.
- [respuesta-ia.md](respuesta-ia.md): diagnóstico, cambios, resultados y límites.
- [validacion-hitl.md](validacion-hitl.md): autorizaciones y decisiones humanas recibidas.
- Este archivo: relación defecto → implementación → prueba → resultado → HU.
- [compilacion-backend.txt](compilacion-backend.txt), [ejecucion-backend.txt](ejecucion-backend.txt), [compilacion-frontend.txt](compilacion-frontend.txt), [ejecucion-navegador.txt](ejecucion-navegador.txt): salidas finales de los comandos.
- [Informe de regresión](../../../06-pruebas/informe-regresion-mejoras-integrales.md): resultados nuevos separados de la evaluación anterior.

## Fuentes oficiales y preservación

[Proyecto Jira MGDST](https://smart-table.atlassian.net/jira/software/projects/MGDST/list), historias MGDST-1 a MGDST-12 y épica MGDST-13, consultadas exclusivamente en lectura. Referencias de decisiones: [HU03](https://smart-table.atlassian.net/browse/MGDST-3), [HU08](https://smart-table.atlassian.net/browse/MGDST-8), [HU12](https://smart-table.atlassian.net/browse/MGDST-12).

El informe funcional `informe-funcional-71f7a90f.md` no se sobrescribió. Los conteos originales siguen siendo los de aquella evaluación y no se recalcularon usando estas pruebas aisladas. Los cambios permanecen locales y sin commit.
