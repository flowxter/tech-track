# Pipeline de Ingeniería de Software Aumentada con IA — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Asignatura:** Proyecto Integrador II — Universidad del Valle  
**Metodología:** Scrum aumentado con IA  
**Versión:** 2.0  
**Estado:** Pipeline aplicado; aceptación y publicación sujetas a las verificaciones correspondientes.

## 1. Propósito y alcance

Establecer cómo el equipo utilizó IA para apoyar la ingeniería del MVP, sin delegar en ella la decisión final sobre requisitos, código o aceptación. El pipeline cubre nueve etapas, admite iteraciones y conserva evidencias de las intervenciones relevantes.

La IA **apoya el proceso de desarrollo**; TechTrack no requiere un modelo generativo como funcionalidad del producto. El alcance funcional está definido en [Requerimientos](03-requerimientos.md) y [Product Backlog](04-product-backlog.md).

## 2. Flujo metodológico

**Necesidad o especificación → Asistencia de IA → Revisión humana (HITL) → Artefacto o decisión → Comprobación → Evidencia.**

Una propuesta puede aceptarse, modificarse, rechazarse o mantenerse pendiente. El proceso no es lineal: los defectos detectados en Pruebas pueden originar correcciones en Desarrollo y nuevas regresiones. No se reconstruyen interacciones de IA que no hayan ocurrido.

## 3. Etapas y productos

| Etapa | Trabajo principal | Documento rector |
|---|---|---|
| 01. Descubrimiento | Definir problema, usuarios e hipótesis | [02-descubrimiento.md](02-descubrimiento.md) |
| 02. Requerimientos | Formalizar RF, RNF y reglas; refinar historias | [03-requerimientos.md](03-requerimientos.md), [04-product-backlog.md](04-product-backlog.md) |
| 03. Planificación | Organizar épica, Sprints y estimaciones | [05-planificacion.md](05-planificacion.md) |
| 04. Arquitectura | Definir y contrastar componentes, datos y API | [06-arquitectura.md](06-arquitectura.md) |
| 05. Desarrollo | Generar, revisar e implementar código y correcciones | `evidencias-ia/etapas/05-desarrollo/` |
| 06. Pruebas | Auditar, ejecutar casos y comprobar regresiones | [07-pruebas.md](07-pruebas.md) |
| 07. Integración y despliegue | Preparar y publicar manualmente en Vercel | [08-despliegue.md](08-despliegue.md) |
| 08. Documentación | Mantener artefactos y guía técnica consistentes | `documentacion/guia-tecnica.md` y documentos del pipeline |
| 09. Evaluación | Interpretar resultados, aportes de IA y limitaciones | [09-evaluacion.md](09-evaluacion.md) |

Los números de los **archivos** y de las **etapas** no coinciden desde Planificación porque `04-product-backlog.md` complementa Requerimientos; se mantienen los nombres existentes del repositorio.

## 4. Herramientas y responsabilidades

| Herramienta | Uso documentado |
|---|---|
| ChatGPT | Análisis, requisitos, planificación, revisión y redacción de artefactos |
| Claude | Generación de la implementación inicial a partir de una solicitud general |
| Codex | Auditoría de código, correcciones, pruebas y regresiones |
| Jira | Fuente oficial de historias y criterios de aceptación |
| Git y GitHub | Versionamiento y revisión de código |

Las tecnologías base fueron seleccionadas por el equipo antes de la implementación inicial asistida por Claude. La distribución de responsabilidades del equipo se conserva en [Planificación](05-planificacion.md).

## 5. Human-in-the-Loop (HITL)

Cada registro significativo debe indicar: **instrucción, respuesta de IA, revisión humana, decisión, efecto sobre el artefacto y evidencia disponible**. La aprobación de un cambio, la aprobación de una historia y la aprobación de un documento son actos distintos.

Se documentaron decisiones, entre ellas, usar una épica en vez de dos, establecer unicidad del identificador de equipo por técnico y limitar nuevas modificaciones cuando el tiempo disponible lo exigió. Sus efectos funcionales se consignan en [Pruebas](07-pruebas.md) y [Evaluación](09-evaluacion.md).

## 6. Organización de evidencias

Las interacciones se organizan por **etapa** en `docs/evidencias-ia/etapas/`; cuando existan, se relacionan con historias, pruebas, commits o Pull Requests. Una etapa puede conservar `prompt.md`, `respuesta-ia.md`, `trazabilidad.md` y `validacion-hitl.md`, además de informes específicos.

No se exige un prompt distinto por cada HU: la solicitud inicial de desarrollo abarcó varias funcionalidades. Tampoco debe declararse una aceptación humana, un commit o un despliegue sin soporte.

## 7. Seguridad y mejora continua

Los secretos deben permanecer fuera del repositorio y de las solicitudes a IA. El código generado se revisa y prueba; los datos de QA y las operaciones sobre servicios externos se gestionan con autorización. Los hallazgos generan cambios documentados y regresiones verificables.

**Principio del proceso:** la IA propone y asiste; el equipo analiza, decide y valida.
