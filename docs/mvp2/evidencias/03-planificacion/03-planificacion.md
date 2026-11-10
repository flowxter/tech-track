# 03. Planificación — TechTrack MVP2

**Objetivo:** incorporar funciones de voz al gestor de soporte técnico conservando la funcionalidad y el backlog del MVP1.

## 1. Decisión de alcance

El equipo decidió **crear cinco historias nuevas e independientes (HU13–HU17)**, en lugar de reescribir las doce historias del MVP1. Aunque se gestionan por separado, **complementan** la creación de tareas, la documentación técnica, la supervisión y la consulta ya implementadas.

## 2. Smart Product Backlog del MVP2

| HU | Función | Prioridad propuesta | SP propuestos | Incremento sugerido |
|---|---|---|---:|---|
| HU13 | Dictado en campos individuales | Must | 5 | Captura de voz |
| HU14 | Creación de tareas por voz | Must | 5 | Captura de voz |
| HU15 | Dictado de informe completo | Must | 5 | Documentación técnica |
| HU16 | Asignación administrativa por voz | Must | 3 | Gestión administrativa |
| HU17 | Lectura de tareas y resumen | Should | 3 | Consulta hablada |
| **Total** | **5 HU nuevas** | | **21** | |

*Las prioridades, estimaciones y agrupaciones son una propuesta de planificación; su valor oficial debe confirmarse con el equipo y en Jira. No implican Sprints formalmente cerrados.*

## 3. Dependencias y seguimiento

- **HU13 y HU15:** amplían el registro de diagnóstico y actividades de HU07–HU08.
- **HU14:** complementa la creación de tareas (HU04) y requiere equipos registrados (HU03).
- **HU16:** complementa la supervisión administrativa (HU12), respetando permisos.
- **HU17:** utiliza tareas y detalles existentes (HU05 y HU11).

Cada historia se sigue mediante **HU → criterios de aceptación → implementación → prueba → evidencia → commit**. La planificación diferencia las pruebas simuladas de las realizadas con AssemblyAI o ElevenLabs reales.

## 4. Prompt de apoyo a la planificación

> **Registro:** prompt de referencia para documentar el refinamiento; no se afirma que sea una copia literal de uno ejecutado previamente.

**P03 — Organización del backlog**

> «Organiza cinco historias nuevas de voz para TechTrack: dictado de campos, creación de tareas, informes, asignaciones y lectura de tareas. Propón prioridades, Story Points, dependencias e incrementos verificables. Conserva las doce HU anteriores y evita duplicar sus alcances. Deja la decisión final al equipo».

## 5. Decisión humana (HITL)

El equipo **decidió cuántas historias incorporar (cinco), mantenerlas independientes y vincularlas como ampliaciones de las HU del MVP1**. También conserva el control sobre prioridades, estimaciones y aceptación de cada historia; las sugerencias de IA no se adoptan automáticamente.

**Evidencias de planificación:** backlog de Jira, registro de prompts y respuestas conservadas, justificación HITL y matriz de trazabilidad. No se consideran ejecutados eventos Scrum sin su evidencia.
