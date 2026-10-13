# Validación HITL — Historias de usuario y criterios de aceptación

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa:** 02. Requerimientos  
**Evidencias:** Prompt original, respuesta de IA y Jira.

## 1. Propuesta de IA

Se solicitó a ChatGPT generar las historias de usuario del MVP, incluyendo criterios de aceptación, prioridades, estimaciones en Story Points y dependencias.

La respuesta generó:

- **12 historias de usuario.**
- **47 Story Points** en total.
- **10 historias de prioridad alta y 2 de prioridad media.**
- Criterios de aceptación para las funcionalidades propuestas.

La información se utilizó como base para organizar los requisitos del proyecto.

## 2. Validación y contraste

Las historias se registraron en Jira como `MGDST-1` a `MGDST-12`, vinculadas a la épica `MGDST-13 — Gestión de soporte técnico`.

| Elemento | Resultado de la revisión |
|---|---|
| Historias de usuario | Se conservaron las 12 historias en Jira. |
| Criterios de aceptación | Se contrastaron los 59 criterios registrados en Jira con la respuesta original de IA y se confirmó su correspondencia. |
| Prioridades y estimaciones | Se conservaron las prioridades y los 47 Story Points en la planificación. |
| Dependencias | La respuesta original no presentó una tabla explícita de dependencias. |
| Numeración | La referencia vigente es Jira: HU10 corresponde al historial del equipo y HU11 al detalle de tarea. |

## 3. Aspectos identificados para revisión humana

Durante el contraste de requisitos y pruebas se identificaron tres aspectos que requieren una decisión del equipo:

| Historia | Aspecto pendiente |
|---|---|
| HU03 | Precisar cuándo debe impedirse duplicar el identificador o número de serie de un equipo. |
| HU08 | Definir si la fecha de actividad corresponde a su ejecución, registro o ambas. |
| HU12 | Confirmar si la supervisión debe ser exclusivamente de consulta o si se admite la asignación de tareas como funcionalidad adicional. |

Estas observaciones no modifican automáticamente los criterios oficiales. Cualquier ajuste deberá ser decidido por el equipo y reflejarse en Jira.

## 4. Resultado HITL

**Resultado:** la propuesta de IA fue utilizada como base para definir las 12 historias y sus criterios de aceptación, que posteriormente quedaron registrados en Jira.

El contraste documental confirma la correspondencia de los 59 criterios, pero no acredita una aprobación humana individual de cada uno.

Se identificaron aspectos que requieren precisión por parte del equipo, especialmente en HU03, HU08 y HU12.

**Conclusión:** la IA apoyó la definición de requisitos; Jira constituye la referencia vigente y las decisiones sobre requisitos ambiguos permanecen bajo responsabilidad del equipo. El cumplimiento funcional se documenta en las etapas de Pruebas y Evaluación.