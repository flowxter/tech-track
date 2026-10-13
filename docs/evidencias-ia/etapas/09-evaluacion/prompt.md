# Prompt — Evaluación del MVP

**Herramienta:** ChatGPT  
**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 09. Evaluación

## Prompt — Evaluación técnica y del uso de IA

Actúa como un ingeniero de software especializado en evaluación de proyectos, aseguramiento de calidad e Ingeniería de Software Aumentada con Inteligencia Artificial.

Estamos desarrollando **TechTrack — Gestor de Soporte Técnico**, un MVP para la asignatura Proyecto Integrador II de la Universidad del Valle.

Necesito realizar una **evaluación del estado del MVP y del aporte de las herramientas de IA utilizadas durante el proceso de desarrollo**, basándome exclusivamente en evidencias verificables.

### 1. Contexto del proyecto

TechTrack permite registrar equipos, gestionar tareas de soporte técnico, documentar intervenciones, adjuntar imágenes, consultar historiales y supervisar actividades.

El proyecto contempla 12 historias de usuario (`MGDST-1` a `MGDST-12`), organizadas en una épica y dos Sprints.

Las herramientas de IA utilizadas fueron:

- **ChatGPT:** apoyo en requisitos, planificación, arquitectura y documentación.
- **Claude:** generación inicial de la aplicación a partir de los requisitos y tecnologías proporcionados por el equipo.
- **Codex:** revisión técnica, ejecución de pruebas y detección de defectos.

Las decisiones finales corresponden al equipo mediante validación humana (HITL).

### 2. Resultados verificados

La evaluación de Codex produjo los siguientes resultados:

| Indicador | Resultado |
|---|---|
| Compilación frontend | Correcta |
| Compilación backend | Correcta |
| Pruebas unitarias | 6 aprobadas |
| Historias que cumplen | 5 |
| Historias que cumplen parcialmente | 7 |
| Criterios de aceptación que cumplen | 56 |
| Criterios parcialmente comprobados | 1 |
| Criterios que no cumplen | 1 |
| Criterios no verificados | 1 |
| Total de criterios | 59 |

Se identificaron los siguientes problemas:

- **D01:** información residual entre sesiones de diferentes usuarios.
- **D02:** errores HTTP 500 ante identificadores inválidos.
- **D03:** cambios sin guardar que aparentan quedar persistidos al completar tareas.
- **D04:** funcionalidad de asignación administrativa que debe conciliarse con el alcance de HU12.
- **D05–D06:** inconsistencias en contratos de datos.

Permanecen pendientes algunas decisiones sobre unicidad de equipos, fecha de actividad y alcance administrativo.

### 3. Aspectos que debes evaluar

**A. Cumplimiento del MVP**

Analiza el grado de cumplimiento de las historias de usuario y los criterios de aceptación.

Diferencia las funcionalidades verificadas, los defectos pendientes y las limitaciones de la evaluación.

**B. Calidad del producto**

Evalúa cualitativamente el estado del MVP en términos de funcionalidad, seguridad, integridad de la información, mantenibilidad y verificabilidad.

No inventes métricas de rendimiento, cobertura o seguridad que no hayan sido medidas.

**C. Aporte de la inteligencia artificial**

Analiza cómo contribuyeron ChatGPT, Claude y Codex a las diferentes etapas del proyecto.

Distingue las propuestas generadas por IA de las decisiones que tomó el equipo.

**D. Limitaciones y riesgos del uso de IA**

Identifica dificultades documentadas, como requisitos ambiguos, inconsistencias en código o documentación, y defectos que requirieron revisión humana.

No atribuyas errores directamente a la IA sin evidencia de su origen.

**E. Validación humana (HITL)**

Identifica las decisiones verificables del equipo, especialmente la selección previa del stack, la organización de una sola épica, las restricciones de pruebas y la revisión documental.

No inventes aprobaciones, reuniones ni correcciones que no hayan ocurrido.

**F. Mejoras pendientes**

Presenta las mejoras que deben priorizarse antes de recomendar la aceptación global del MVP.

Distingue las correcciones necesarias de las funcionalidades adicionales.

### 4. Fuentes

Utiliza como referencias:

- Historias y criterios de aceptación de Jira.
- Documentación de requisitos, planificación y arquitectura.
- Evidencias de las etapas 05–08.
- Informe funcional generado por Codex.
- Guía técnica de TechTrack.

Cuando alguna fuente no esté disponible, identifica esa limitación sin completar información mediante suposiciones.

### 5. Resultado esperado

Genera una evaluación académica, breve y sustentada que incluya:

1. Estado general del MVP.
2. Cumplimiento funcional.
3. Calidad y defectos pendientes.
4. Contribución de la IA durante el proyecto.
5. Intervención humana y decisiones HITL.
6. Limitaciones y recomendaciones.
7. Conclusión de la evaluación.

No incluyas fechas, información inventada ni resultados de pruebas que no hayan sido ejecutadas.

**No declares que TechTrack está completamente aceptado mientras permanezca el defecto D01 sin corregir y verificar.**

Entrega el contenido listo para incorporarlo a `docs/09-evaluacion.md`. La evaluación generada será revisada por el equipo antes de su aceptación.