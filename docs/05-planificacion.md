# Planificación, Release Plan y Sprints — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa del pipeline:** 03. Planificación  
**Versión:** 2.0  
**Estado:** Planificación en dos Sprints documentada; cierre formal sujeto a evidencia de Jira.

## 1. Propósito

Organizar las 12 historias del MVP en incrementos coherentes, conservando la **estimación original** y distinguiendo lo planificado de lo formalmente cerrado. Las historias y los criterios oficiales están en [Product Backlog](04-product-backlog.md).

## 2. Línea base y Release Plan

| Sprint | Historias | Estimación | Objetivo del incremento |
|---|---|---:|---|
| 1 | HU01–HU06 | **19 SP** | Registro, acceso, equipos, creación, consulta y estados de tareas |
| 2 | HU07–HU12 | **28 SP** | Documentación técnica, evidencias, historial, detalle y supervisión |
| **Total** | **12 HU** | **47 SP** | MVP de soporte y trazabilidad |

Los Story Points son **estimaciones de complejidad relativa**: no equivalen a horas ni se convierten en puntos terminados a partir de los resultados de QA. Las cifras por historia se obtienen de Jira cuando se necesiten.

La propuesta inicial de IA contemplaba dos épicas; el equipo decidió agrupar las historias en **una épica**, `MGDST-13`.

## 3. Equipo y responsabilidades previstas

| Integrante | Rol principal | Área de responsabilidad |
|---|---|---|
| Erik Santiago Amarles Solarte | Scrum Master y QA | Coordinación, seguimiento y pruebas |
| Carlos Castillo | Frontend y base de datos | Interfaces, interacción e integración de datos |
| Juan José Mafla | Backend y despliegue | API, lógica de servidor e integración/despliegue |

Los roles indican responsabilidades acordadas, no certifican la autoría individual de cada cambio. La colaboración y las decisiones HITL son compartidas según la actividad.

## 4. Preparación — Sprint Cero

La preparación metodológica contempló definición del problema, requisitos, backlog, stack, arquitectura preliminar, repositorio y criterios de verificación. «Sprint Cero» designa esta preparación; no se afirma que haya existido un evento Scrum formalmente cerrado con ese nombre.

## 5. Trabajo previsto por Sprint

**Sprint 1 — Funcionalidades fundamentales:** formularios de registro/login, autenticación, equipos, creación y consulta de tareas, estados e integración entre frontend, API y MongoDB.

**Sprint 2 — Trazabilidad técnica:** diagnóstico, actividades, resultados, imágenes, historial, detalle y consulta administrativa, integrados al incremento anterior.

Las dependencias operativas principales son **equipo antes que tarea** y **tarea antes que documentación/evidencias/historial**. El mapa por HU se encuentra en [Product Backlog](04-product-backlog.md).

## 6. Seguimiento y cierre

Para declarar cerrado un Sprint se requiere evidencia del incremento, revisión humana y estado correspondiente en Jira. Los resultados de pruebas se registran en [07-pruebas.md](07-pruebas.md), pero **no sustituyen** el registro de Sprint Review o la aceptación formal.

La decisión de mantener parcialmente implementadas HU08 y HU12 por tiempo disponible se documenta como una **decisión de alcance**, no como cierre automático de ambas historias. Su fundamento y consecuencias están en [Evaluación](09-evaluacion.md).

## 7. Eventos Scrum y evidencias

| Evento o actividad | Evidencia, si se realizó |
|---|---|
| Sprint Planning | Objetivo, alcance e historias seleccionadas |
| Daily Scrum | Seguimiento e impedimentos |
| Refinamiento de backlog | Cambios y decisiones registradas en Jira |
| Sprint Review | Demostración y aceptación o pendientes |
| Retrospectiva | Aprendizajes y acciones acordadas |

No se declaran celebrados los eventos sin registros que los respalden.

**Evidencias de etapa:** `evidencias-ia/etapas/03-planificacion/`. La revisión HITL conserva la decisión sobre la épica, las estimaciones y los cambios aprobados.
