# Trazabilidad — Pruebas

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Herramienta:** Codex  
**Línea base:** commit `5c21775180d6de1ee5dc93beddd8b8d701935a9b`.

## 1. Relación entre historias y pruebas

Se evaluaron las 12 historias de usuario frente a los 59 criterios de aceptación registrados en Jira.

| HU | Jira | Resultado QA | Observaciones |
|---|---|---|---|
| HU01 | MGDST-1 | Cumple | 5 criterios aprobados |
| HU02 | MGDST-2 | Parcial | 5 criterios aprobados; defecto D01 |
| HU03 | MGDST-3 | Parcial | 4 aprobados; 1 parcial por unicidad |
| HU04 | MGDST-4 | Cumple | 5 criterios aprobados |
| HU05 | MGDST-5 | Cumple | 4 criterios aprobados |
| HU06 | MGDST-6 | Parcial | 5 aprobados; defecto D03 |
| HU07 | MGDST-7 | Cumple | 5 criterios aprobados |
| HU08 | MGDST-8 | Parcial | 4 aprobados; 1 no verificado por fecha de actividad |
| HU09 | MGDST-9 | Cumple | 5 criterios aprobados |
| HU10 | MGDST-10 | Parcial | 5 aprobados; defecto D01 |
| HU11 | MGDST-11 | Parcial | 5 aprobados; defecto D01 |
| HU12 | MGDST-12 | Parcial | 4 aprobados; 1 no cumple según el alcance de consulta |

**Resultado general:** 56 criterios cumplen, 1 cumple parcialmente, 1 no cumple y 1 no fue verificado.

Los identificadores `CA-HUxx-n` fueron asignados por Codex para facilitar la trazabilidad; no son identificadores originales de Jira.

## 2. Trazabilidad de las evidencias

| Documento | Evidencia |
|---|---|
| `prompt.md` | Instrucciones enviadas a Codex para auditoría y pruebas funcionales. |
| `respuesta-ia.md` | Resultados de compilaciones, pruebas unitarias, evaluación funcional y defectos. |
| `informe-funcional.md` | Procedimientos, resultados de los 59 criterios y hallazgos D01–D06. |
| `validacion-hitl.md` | Revisión humana de resultados y decisiones pendientes. |
| Código del backend | Pruebas unitarias existentes: 6 aprobadas. |

Los registros JSON, capturas y el informe técnico original de Codex se conservan como respaldo de las ejecuciones, sin duplicarlos en estos documentos.

## 3. Alcance de la trazabilidad

La evaluación identificó **5 historias que cumplen y 7 que cumplen parcialmente**.

El cumplimiento de los criterios individuales no implica necesariamente la aceptación de una historia completa: los defectos reproducidos pueden afectar funcionalidades cuyos criterios específicos fueron aprobados.

Especialmente, el defecto **D01 — Información residual entre cuentas** impide recomendar la aceptación global del MVP hasta corregirlo y repetir las pruebas correspondientes.

Los resultados detallados se encuentran en `informe-funcional.md`.