# Trazabilidad de la generación de HU a Jira y a la planificación

## Relación con Jira

Según el texto compartido por el equipo, las historias propuestas por IA se registraron en Jira bajo la épica **Gestión de soporte técnico**. En consulta de lectura, la épica observada es `MGDST-13` y las 12 historias corresponden a `MGDST-1` a `MGDST-12`.

**Enlace al proyecto:** https://smart-table.atlassian.net/jira/software/projects/MGDST/list

| HU | Jira | Prioridad en la respuesta | SP en la respuesta | Sprint planificado |
|---|---|---|---:|---|
| HU01 | MGDST-1 | Alta | 3 | Sprint 1 |
| HU02 | MGDST-2 | Alta | 3 | Sprint 1 |
| HU03 | MGDST-3 | Alta | 3 | Sprint 1 |
| HU04 | MGDST-4 | Alta | 5 | Sprint 1 |
| HU05 | MGDST-5 | Alta | 3 | Sprint 1 |
| HU06 | MGDST-6 | Alta | 2 | Sprint 1 |
| HU07 | MGDST-7 | Alta | 5 | Sprint 2 |
| HU08 | MGDST-8 | Alta | 5 | Sprint 2 |
| HU09 | MGDST-9 | Alta | 5 | Sprint 2 |
| HU10 | MGDST-10 | Alta | 5 | Sprint 2 |
| HU11 | MGDST-11 | Media | 3 | Sprint 2 |
| HU12 | MGDST-12 | Media | 5 | Sprint 2 |
| **Total** | **12 HU** | **10 altas / 2 medias** | **47** | **2 Sprints** |

**Sumas calculadas a partir de la respuesta compartida:** Sprint 1 = 3+3+3+5+3+2 = **19 SP**; Sprint 2 = 5+5+5+5+3+5 = **28 SP**.

**Verificación:** las 12 historias están registradas en Jira bajo la épica `MGDST-13`, con sus respectivos Story Points, que suman **47 SP**. Las prioridades corresponden a la respuesta original de IA y la distribución en dos Sprints refleja la planificación del equipo.

Esta trazabilidad no demuestra que los Sprints se hayan ejecutado ni que las historias cumplan sus criterios de aceptación. Estos resultados se documentan en las etapas de Pruebas y Evaluación.

## Correspondencia con el pipeline

- **Etapa 02 — Requerimientos:** conservar aquí el prompt, la respuesta completa, la captura y la revisión HITL; se trata de una sola generación que comprende HU01–HU12.
- **Etapa 03 — Planificación:** referenciar desde `docs/05-planificacion.md` y, si se desea, desde `docs/evidencias-ia/etapas/03-planificacion/README.md` los agregados 19 SP / 28 SP; no volver a copiar la respuesta completa.
- **Por cada HU:** una vez se trabaje su implementación, registrar códigos de prueba, commits y evidencias en `docs/evidencias-ia/historias-usuario/HUxx/`. No es necesario un prompt de HU independiente si su origen es la interacción conjunta.

## Relación con otra respuesta de IA compartida

Existe otra respuesta anterior que proponía **dos épicas** y tareas por frontend, backend y QA, y que asignaba HU10 a detalle y HU11 a historial. **Es una respuesta distinta** de la presente, que sí corresponde a la numeración final consultada en Jira. Ambas deben conservarse separadas y con sus orígenes correctos; no sustituir una por la otra.
