# Trazabilidad — Evaluación del MVP

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 09. Evaluación  
**Herramientas:** ChatGPT y Codex

## 1. Trazabilidad de los resultados técnicos

La evaluación del MVP se fundamenta en los resultados obtenidos por Codex durante las auditorías y pruebas funcionales.

| Resultado o conclusión | Evidencia |
|---|---|
| 12 historias y 59 criterios oficiales de Jira | `../06-pruebas/informe-funcional.md` y proyecto Jira `MGDST` |
| 56 criterios cumplen, 1 parcial, 1 no cumple y 1 no verificado | Matriz de criterios del informe funcional |
| 5 HU cumplen y 7 cumplen parcialmente | `../06-pruebas/trazabilidad.md` |
| Compilaciones correctas y 6 pruebas unitarias aprobadas | Auditoría técnica de Codex y `../06-pruebas/respuesta-ia.md` |
| D01 — Información residual entre cuentas | Informe funcional, observaciones de navegador y capturas de respaldo |
| D02 — Errores HTTP 500 con identificadores inválidos | Informe funcional y registros API |
| D03 — Cambios sin guardar que aparentan persistir | Informe funcional y comprobaciones de navegador/API |
| D04 — Asignación de tareas desde supervisión | Informe funcional y prueba de creación administrativa |
| D05–D06 — Inconsistencias de contratos | Auditoría técnica e informe funcional |
| Restricciones y autorización de las pruebas | `../06-pruebas/validacion-hitl.md` |

Los resultados corresponden a las pruebas ejecutadas sobre la versión evaluada. Los registros JSON y las capturas originales se conservan como respaldo técnico.

## 2. Trazabilidad del uso de inteligencia artificial

| Herramienta | Participación | Evidencia |
|---|---|---|
| ChatGPT | Apoyo en requisitos, planificación y arquitectura | Etapas 02, 03 y 04 |
| Claude | Generación inicial de la aplicación | `../05-desarrollo/` |
| Codex | Auditoría técnica, pruebas funcionales e identificación de defectos | `../06-pruebas/` |
| ChatGPT | Elaboración y revisión de documentación técnica | `../08-documentacion/` |
| ChatGPT | Evaluación integral del MVP y del proceso asistido por IA | `prompt.md` y `respuesta-ia.md` |

## 3. Trazabilidad de decisiones humanas

| Decisión HITL | Evidencia |
|---|---|
| Selección del stack tecnológico por el equipo | `../04-arquitectura/validacion-hitl.md` |
| Una épica y dos Sprints en la planificación | `../03-planificacion/` |
| Uso de los criterios oficiales de Jira | `../02-requerimientos/` y `../06-pruebas/` |
| Restricciones para modificar MongoDB durante las pruebas | `../06-pruebas/validacion-hitl.md` |
| Revisión y aceptación de la documentación | `../08-documentacion/validacion-hitl.md` |

## 4. Resultado y alcance

La evaluación identificó **5 historias que cumplen y 7 que cumplen parcialmente**, junto con defectos y requisitos pendientes de aclaración.

El hallazgo **D01 — Información residual entre cuentas** impide recomendar la aceptación global del MVP mientras no sea corregido y verificado.

No se dispone de evidencia suficiente para afirmar que se hayan completado las correcciones, realizado pruebas de rendimiento o comprobado un despliegue público con CI/CD.

Las conclusiones detalladas se presentan en `respuesta-ia.md`. La revisión y aceptación humana de esta evaluación corresponden a `validacion-hitl.md`.

**Estado:** evaluación técnica preliminar sustentada en evidencias; aceptación global del MVP pendiente.