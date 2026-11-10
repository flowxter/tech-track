# Validación HITL — Planificación y organización de las HU

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa del pipeline:** 03. Planificación  
**Evidencia de entrada:** `prompt.md` y `respuesta-ia.md`  
**Fuentes de contraste:** respuesta de generación de criterios de aceptación, Jira (`MGDST-1` a `MGDST-13`) y `docs/05-planificacion.md`  
**Estado:** Revisión documental y decisiones confirmadas por el equipo.

## 1. Propósito

Registrar cómo el equipo revisó y adaptó la propuesta de IA para organizar las historias de usuario de TechTrack, diferenciando las **decisiones humanas confirmadas** de los **ajustes documentales identificados posteriormente**.

Esta evidencia corresponde a la planificación, no a los resultados de ejecución ni a la aceptación funcional del MVP.

## 2. Propuesta de IA y decisión principal

La IA propuso dividir las 12 historias de usuario en dos épicas:

- **Épica 1:** Gestión de usuarios, equipos y tareas técnicas (HU01–HU06).
- **Épica 2:** Documentación técnica, evidencias e historial (HU07–HU12).

**Decisión del equipo:** modificar esta propuesta y conservar **una sola épica**, denominada **Gestión de soporte técnico**, debido al tiempo limitado disponible para desarrollar el MVP.

Se mantuvieron las 12 historias y su organización en **dos Sprints**.

**Resultado verificable:** en Jira, `MGDST-1` a `MGDST-12` están vinculadas a `MGDST-13 — Gestión de soporte técnico`.

**Clasificación HITL: MODIFICADA.** Se aprovechó la agrupación funcional sugerida por la IA, pero se simplificó la estructura de épicas por decisión humana.

## 3. Contraste de la propuesta con la planificación adoptada

| Aspecto | Propuesta o salida de IA | Planificación adoptada / fuente de contraste | Tratamiento |
|---|---|---|---|
| Épicas | Dos épicas que separan funcionalidades básicas y documentación técnica. | Una épica `MGDST-13`, por decisión expresa del equipo. | **Modificada por HITL.** Decisión confirmada. |
| Historias de usuario | 12 HU distribuidas en dos bloques. | 12 HU conservadas en Jira, `MGDST-1` a `MGDST-12`. | **Estructura conservada.** No equivale a aceptación funcional de las HU. |
| Sprints | Primer bloque HU01–HU06 y segundo bloque HU07–HU12. | Dos Sprints planificados con la misma distribución, según decisión del equipo. | **Distribución adoptada.** |
| Story Points | La respuesta de organización en épicas no detalla estimaciones individuales. | La respuesta de requisitos y Jira registran 19 SP para HU01–HU06 y 28 SP para HU07–HU12. | **Complementada con otra evidencia.** No se atribuyen estos puntos a la primera respuesta. |
| HU10 / HU11 | La primera propuesta denomina HU10 al detalle de tarea y HU11 al historial. | En Jira, **HU10 = historial del equipo** y **HU11 = detalle de tarea**. | **Correspondencia documental ajustada a Jira.** No se conoce cuándo ni quién decidió originalmente el cambio. |
| Criterios de aceptación | La primera respuesta incluye criterios y actividades sugeridas para frontend, backend y QA. | Jira contiene la versión vigente de los criterios; la respuesta de ingeniería de requisitos coincide con esa numeración. | **Jira como referencia para desarrollo y pruebas.** No se presupone aprobación histórica de cada diferencia. |
| Responsabilidades técnicas | Desglose sugerido por historia para frontend, backend y QA. | La presentación del equipo identifica responsables principales de estas áreas. | **Propuesta compatible con la organización del equipo.** No certifica la ejecución de cada tarea. |

## 4. Resultado de la validación de planificación

El equipo conservó la división funcional propuesta por la IA, pero organizó el alcance del MVP bajo **una única épica** para simplificar su gestión durante el tiempo disponible.

| Sprint | Historias de usuario | Story Points planificados | Enfoque |
|---|---|---:|---|
| Sprint 1 | HU01–HU06 | 19 | Registro y acceso, equipos y gestión básica de tareas. |
| Sprint 2 | HU07–HU12 | 28 | Documentación de intervenciones, evidencias, historial y supervisión. |
| **Total** | **12 HU** | **47** | **Alcance planificado del MVP.** |

La agrupación bajo la épica `MGDST-13` y las estimaciones individuales están respaldadas por Jira.

La división en dos Sprints corresponde a la planificación informada por el equipo y documentada en `05-planificacion.md`.

**Resultado HITL principal:** propuesta **modificada** en la cantidad de épicas; distribución funcional en dos Sprints **conservada**.

Los criterios de aceptación de referencia son los registrados en Jira.

Las diferencias detectadas entre respuestas de IA se consignan aquí como **contraste documental**, sin inventar reuniones, aprobaciones o correcciones anteriores.

## 5. Aporte de IA y revisión humana

La IA ayudó a estructurar las historias en conjuntos funcionales, proponer criterios de aceptación y desglosar tareas potenciales para frontend, backend y QA.

El equipo tomó la decisión de mantener una sola épica, conservó la organización de las historias en dos Sprints y utilizó los criterios y estimaciones disponibles en el trabajo posterior de requisitos y en Jira.

La revisión documental identificó diferencias de numeración entre la primera respuesta (HU10/HU11) y la versión final de Jira.

Para mantener la trazabilidad, la documentación vigente debe utilizar **la numeración de Jira**, conservando intacta la respuesta original de IA como evidencia del proceso.

Esta validación **no certifica** que las funcionalidades hayan sido implementadas, probadas o aceptadas. Ese seguimiento corresponde a las etapas de Desarrollo, Pruebas y Evaluación.

## 6. Registro y fuentes de la decisión

| Campo | Registro |
|---|---|
| Decisión humana confirmada | Conservar una sola épica por el tiempo limitado de desarrollo. |
| Organización mantenida | Dos Sprints: HU01–HU06 y HU07–HU12. |
| Evidencia de la decisión | Confirmación de un integrante del equipo durante la revisión de la documentación. |
| Evidencia del resultado | Jira: épica `MGDST-13` con las 12 historias relacionadas. |
| Fuentes complementarias | `prompt.md`, `respuesta-ia.md`, respuesta de requisitos, `trazabilidad-jira.md` y `docs/05-planificacion.md`. |
