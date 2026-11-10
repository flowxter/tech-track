# Evaluación del MVP y del Proceso Aumentado con IA — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa del pipeline:** 09. Evaluación  
**Versión:** 2.0  
**Estado:** Evaluación técnica consolidada; aceptación global y validación externa pendientes.

## 1. Propósito y fuentes

Interpretar el cumplimiento del MVP, las lecciones del proceso y la contribución documentada de IA. Los datos proceden de la auditoría y regresión realizadas por Codex, contrastadas con los criterios oficiales de Jira y consolidadas en [07-pruebas.md](07-pruebas.md). Este informe **no reemplaza los registros técnicos detallados**.

La evaluación distingue **cumplimiento técnico**, **aceptación humana formal** y **validación del problema con usuarios**.

## 2. Indicadores finales del MVP

| Indicador de cumplimiento | Resultado |
|---|---:|
| Historias completamente cumplidas | **10/12 — 83,3 %** |
| Historias parcialmente cumplidas | **2/12 — 16,7 %** |
| Criterios oficiales satisfechos | **57/59 — 96,6 %** |
| Criterios incumplidos | **1** |
| Criterios no determinados | **1** |
| Defectos identificados que fueron corregidos y verificados | **5 de 6** |

Las métricas significan **criterios verificados por QA**, no cobertura de código ni aceptación formal del equipo. La matriz de 12 historias, los 24 casos candidatos, los defectos D01–D06, la distinción entre pruebas reales y simuladas y el entorno de ejecución se encuentran exclusivamente en [Pruebas](07-pruebas.md).

## 3. Decisión de alcance y aceptación

**HU08 y HU12 tienen funcionalidades operativas, pero no cumplen completamente sus historias.** El equipo decidió **mantenerlas como están por tiempo disponible**, sin desarrollar por ahora los ajustes que exigirían sus criterios restantes. Se conservaron el criterio no determinado de HU08 y el incumplido de HU12 sin cambiar los textos de Jira.

Esta fue una **decisión humana de alcance**, no una aceptación funcional completa. El equipo no debe presentar las 12 HU ni los 59 criterios como terminados. La aceptación global del MVP permanece pendiente; también debe verificarse la integración de las correcciones en una versión confirmada de Git.

## 4. Evaluación del proceso aumentado con IA

El proceso conservó evidencias de IA en organización de requisitos y documentación, generación inicial de código, auditoría, correcciones y regresión. La distribución de herramientas y las reglas HITL se describen en [01-pipeline.md](01-pipeline.md); los artefactos originales están en `evidencias-ia/etapas/`.

**Aportes observables:** acelerar la producción de borradores técnicos, proponer e implementar código, facilitar revisiones sistemáticas, detectar defectos y estructurar evidencias. Estos aportes son cualitativos; no prueban una magnitud de ahorro.

**Métricas no disponibles:** porcentaje de código producido por IA, ahorro de horas y tasa global de aceptación directa de respuestas. No existe una línea base sin IA ni un inventario exhaustivo y homogéneo de propuestas aprobadas, modificadas o rechazadas. No se inventan porcentajes.

**Aprendizaje HITL:** una salida de IA debe cotejarse con requisitos y código real. La mejora reportada entre auditorías surgió de correcciones, decisiones humanas y nuevas pruebas; no puede atribuirse exclusivamente a una herramienta.

## 5. Resultados frente a Scrum y a la calidad

La planificación contempló una épica y dos Sprints con **47 Story Points estimados**. No hay base para equiparar esa cifra con puntos formalmente completados, velocidad del equipo o cierre de Sprints; la información de gestión debe verificarse en Jira y en las actas que existan. Los detalles se conservan en [05-planificacion.md](05-planificacion.md).

Los escenarios ejecutados respaldan funcionamiento técnico para la mayor parte del flujo, pero no constituyen una medición formal de rendimiento, accesibilidad completa, seguridad de producción ni satisfacción de usuarios.

## 6. Validación del problema y publicación

Las necesidades de los técnicos fueron planteadas como **hipótesis**, sin entrevistas ni pruebas formales de usabilidad con usuarios externos documentadas. Por tanto, la utilidad y adopción del producto no se consideran demostradas. La hipótesis original está en [Descubrimiento](02-descubrimiento.md).

La publicación manual en Vercel está definida en [08-despliegue.md](08-despliegue.md), pero **no se ha verificado todavía una versión pública ni sus pruebas de humo**. La aprobación de builds locales no equivale a un despliegue ejecutado.

## 7. Hallazgos y lecciones aprendidas

- La funcionalidad generada inicialmente necesitó auditoría y correcciones; el código existente no era evidencia suficiente de cumplimiento.
- Las pruebas entre sesiones, validaciones de API y persistencia revelaron riesgos que podían pasar inadvertidos en una demostración aislada.
- Un criterio ambiguo requiere interpretación humana; la falta de decisión no debe presentarse como aprobado.
- Conservar funcionalidades parcialmente realizadas puede ser una decisión razonable para una entrega limitada por tiempo, siempre que se documenten sus diferencias frente a Jira.
- La versión verificada debe identificarse por sus cambios reales: un HEAD sin modificaciones locales no garantiza reproducibilidad.
- La documentación es más confiable cuando cada etapa conserva una única fuente de detalle y las demás la citan.

## 8. Conclusión y gobernanza

TechTrack alcanzó un **MVP operativo en los escenarios evaluados**, con **10 historias completamente cumplidas y 57 criterios satisfechos**, y limitaciones explícitas para las otras dos historias. Los resultados no justifican afirmar aceptación funcional global ni validación del problema con técnicos externos.

El equipo conserva la responsabilidad de aprobar el documento, decidir sobre el alcance pendiente, integrar la versión de código y autorizar una publicación. La IA aporta propuestas y comprobaciones, pero **no emite la aceptación del producto**.

**Estado final:** evaluación técnica documentada, decisiones de alcance identificadas y requisitos de aceptación/publicación pendientes, sin alterar los resultados históricos de QA.
