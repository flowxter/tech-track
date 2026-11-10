# 01. Descubrimiento — TechTrack MVP2

**Proyecto:** TechTrack — Gestor de Soporte Técnico<br>
**Etapa:** Descubrimiento<br>
**Enfoque:** Ampliación del MVP1 mediante reconocimiento y síntesis de voz

## 1. Antecedentes y problema

El MVP1 de TechTrack centraliza equipos, tareas, diagnósticos, intervenciones, evidencias e historial técnico. Sin embargo, registrar manualmente toda la información de una intervención puede resultar repetitivo y requerir tiempo adicional.

El MVP2 busca facilitar ese registro mediante dictado y complementar la consulta de tareas con lectura en voz alta. **La reducción del tiempo de registro es un beneficio esperado, no un resultado medido con usuarios externos.**

## 2. Usuarios y necesidades

| Usuario | Necesidad |
|---|---|
| Técnico de soporte | Crear tareas y documentar intervenciones mediante voz, con posibilidad de revisar el texto. |
| Administrador | Preparar asignaciones de tareas mediante dictado, sin perder el control de la decisión. |
| Técnico de soporte | Escuchar tareas y resúmenes sin depender exclusivamente de la lectura en pantalla. |

## 3. Objetivo del MVP2

**Ampliar TechTrack con funciones de voz que faciliten la creación, documentación, asignación y consulta de tareas, conservando la confirmación humana antes de guardar información.**

## 4. Alcance propuesto

| HU | Funcionalidad |
|---|---|
| HU13 | Dictar texto en campos individuales. |
| HU14 | Crear borradores de tareas mediante voz. |
| HU15 | Dictar informes técnicos y distribuirlos en sus campos. |
| HU16 | Preparar asignaciones administrativas mediante voz. |
| HU17 | Escuchar tareas y resúmenes hablados. |

Estas historias amplían las HU originales del MVP1; **su formalización y aceptación en Jira corresponden a Requerimientos y Planificación**.

Quedan fuera del alcance el control completo de la interfaz por comandos de voz, el diagnóstico automático de fallas y las acciones guardadas sin confirmación del usuario.

## 5. Tecnologías y funcionamiento

- **AssemblyAI:** transcripción de audio a texto en español.
- **Lógica de TechTrack:** identificación de campos, equipos y técnicos a partir del texto transcrito.
- **ElevenLabs:** lectura de tareas mediante síntesis de voz, con respaldo de la voz del navegador.

El flujo principal es **voz → transcripción → borrador editable → revisión humana → guardado**.

## 6. Riesgos y validación

Los principales riesgos son la selección incorrecta del micrófono, errores de transcripción, asociaciones ambiguas y fallos de servicios externos. Se mitigarán mediante mensajes claros, selección manual cuando sea necesaria y pruebas funcionales.

El equipo reportó una comprobación en localhost de la transcripción y el llenado de un borrador de tarea por voz, y atribuyó un error `422` a la selección del micrófono. Falta adjuntar el registro de esa comprobación para corroborar el recorrido y la causa del incidente. La experiencia reportada destaca la importancia de **verificar primero la configuración del entorno antes de modificar el código**.

La utilidad del dictado para técnicos externos aún requiere validación; las pruebas técnicas no demuestran por sí solas una mejora de productividad.
