# Product Backlog — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapas relacionadas:** 02. Requerimientos y 03. Planificación  
**Versión:** 2.0  
**Estado:** Backlog definido; criterios oficiales mantenidos en Jira.

## 1. Objetivo y fuente oficial

Organizar las historias del MVP, su prioridad y su vínculo con los requisitos. **Jira es la fuente oficial** de la descripción detallada y de los **59 criterios de aceptación**: historias `MGDST-1` a `MGDST-12`, agrupadas en la épica `MGDST-13` (Gestión de soporte técnico).

Los criterios incluidos en versiones preliminares de este documento eran **candidatos de refinamiento**, no transcripciones oficiales. Para evitar dos versiones contradictorias, sus textos completos se consultan en Jira. Los resultados de contrastarlos con el código se registran en [Pruebas](07-pruebas.md).

## 2. Objetivo del producto

Permitir el recorrido **acceso → equipo → tarea → diagnóstico → intervención → evidencia → historial**, con consulta administrativa. La definición del problema y el público objetivo se encuentra en [Descubrimiento](02-descubrimiento.md).

## 3. Inventario de historias

| HU | Jira | Capacidad | Actor | Prioridad inicial | RF principal | Sprint planificado |
|---|---|---|---|---|---|---|
| HU01 | MGDST-1 | Registro de usuario | Técnico | Alta | RF-01 | 1 |
| HU02 | MGDST-2 | Inicio y cierre de sesión | Técnico | Alta | RF-02/03 | 1 |
| HU03 | MGDST-3 | Registro de equipos | Técnico | Alta | RF-04/05 | 1 |
| HU04 | MGDST-4 | Creación de tareas | Técnico | Alta | RF-06 | 1 |
| HU05 | MGDST-5 | Consulta de tareas | Técnico | Alta | RF-07 | 1 |
| HU06 | MGDST-6 | Gestión de estados | Técnico | Alta | RF-08 | 1 |
| HU07 | MGDST-7 | Problema y diagnóstico | Técnico | Alta | RF-09 | 2 |
| HU08 | MGDST-8 | Actividades y resultado | Técnico | Alta | RF-10 | 2 |
| HU09 | MGDST-9 | Evidencias | Técnico | Alta | RF-11 | 2 |
| HU10 | MGDST-10 | Historial de equipo | Técnico | Alta | RF-12 | 2 |
| HU11 | MGDST-11 | Detalle de tarea | Técnico | Media | RF-13 | 2 |
| HU12 | MGDST-12 | Supervisión administrativa | Administrador | Media | RF-14 | 2 |

**Nota de identificación:** la numeración HU10 (historial) y HU11 (detalle) sigue Jira, que prevalece sobre referencias invertidas en textos anteriores del repositorio.

## 4. Criterios y estados

Cada historia debe evaluarse contra **todos sus criterios oficiales**, no contra una selección de criterios candidatos. El reporte de QA identifica 10 historias con cumplimiento completo y 2 con cumplimiento parcial; su matriz detallada, defectos y evidencia están en [07-pruebas.md](07-pruebas.md).

**HU08 y HU12 permanecen en el backlog como historias parcialmente cumplidas.** Su implementación principal existe, pero hay un criterio no determinado y otro incumplido, respectivamente. No se cambian los criterios de Jira para reflejar la decisión de no ampliar el desarrollo por tiempo disponible.

Un resultado técnico «Cumple» tampoco equivale automáticamente al estado «Hecho» ni a aceptación formal en Jira.

## 5. Dependencias funcionales

- HU01/02 habilitan el acceso protegido.
- HU03 habilita la asociación de equipos requerida por HU04.
- HU04 proporciona las tareas sobre las que operan HU05–HU09 y HU11.
- HU10 consulta intervenciones de equipos creados en HU03.
- HU12 requiere roles administrativos y tareas existentes.

Estas relaciones no se consideran automáticamente bloqueos configurados en Jira.

## 6. Refinamiento, estimación y criterios de cierre

La priorización fue establecida para organizar el alcance. Las estimaciones de **19 SP para HU01–HU06** y **28 SP para HU07–HU12** pertenecen a [Planificación](05-planificacion.md); los puntos individuales deben leerse de Jira y no inferirse de los subtotales.

**Definition of Ready (referencia):** propósito claro, actor, criterios verificables, dependencias conocidas y decisiones abiertas identificadas.

**Definition of Done (referencia):** implementación integrada, todos los criterios satisfechos, pruebas pertinentes con evidencia, revisión y aceptación humana. La aceptación de excepciones de alcance debe documentarse sin alterar resultados de QA.

## 7. Seguimiento y trazabilidad

Para cada historia se relacionarán, cuando estén disponibles, **Jira → RF/RNF/RN → componente de código → prueba → resultado → commit/PR**. No se atribuirá a un commit una corrección que siga únicamente en modificaciones locales.

Las evidencias de refinamiento con IA se conservan en `evidencias-ia/etapas/02-requerimientos/`. La decisión de organizar el alcance en una sola épica fue humana.

## 8. Salida

El backlog proporciona la referencia funcional para Planificación, Desarrollo y Pruebas. Su **estado administrativo** se consulta en Jira; el **estado técnico verificado**, en [07-pruebas.md](07-pruebas.md).
