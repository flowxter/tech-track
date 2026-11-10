# 05. Desarrollo — TechTrack MVP2

**Propósito:** registrar brevemente cómo evolucionó el código del MVP1 hacia el MVP2 y conservar, por separado, los prompts originales, las respuestas y las decisiones HITL.

## 1. Evolución

| Fase | Actividad |
|---|---|
| **Claude: base inicial** | Apoyó la creación de la estructura React/TypeScript, Node/Express y MongoDB para el gestor de soporte. |
| **Primera versión de voz** | Se añadieron dictado, borradores de tareas, informes, asignación y lectura hablada con AssemblyAI y ElevenLabs. La primera integración se fusionó en main mediante el PR #3. |
| **Auditoría Codex** | Se revisó el código **sin modificarlo**. Se identificaron 14 hallazgos (A01–A14). |
| **Corrección Codex** | Se autorizaron únicamente A01, A02, A03, A04 y A12 en una rama separada, con nuevas pruebas. |

## 2. Funciones incorporadas

| HU | Implementación |
|---|---|
| HU13 | Dictado en campos individuales con AssemblyAI. |
| HU14 | Borrador de tarea por voz, con equipo, título y descripción. |
| HU15 | Dictado de informe y distribución por secciones. |
| HU16 | Borrador de asignación administrativa por voz. |
| HU17 | Lectura de tareas y resúmenes con ElevenLabs o voz del navegador. |

La transcripción se procesa mediante el backend y **los borradores requieren revisión humana antes de guardarse**.

## 3. Resultados y control de calidad

La auditoría reportó **33 pruebas backend aprobadas** y que la regresión frontend no pudo ejecutarse por falta de Playwright. La primera corrección reportó **52 backend y 32 frontend**; los ajustes posteriores de A02/A04 registraron **52/40**, y la revisión posterior de A03, **72/40**. Cada par corresponde a una ejecución independiente, no a pruebas acumulables. Los resultados corresponden a ejecuciones anteriores del historial de trabajo; no se repitieron durante esta actualización documental. Los proveedores y la persistencia se simularon; Chromium nativo con dispositivo simulado no equivale a micrófono físico ni a APIs reales.

El equipo reportó pruebas en localhost y atribuyó un error `422` a la **selección del micrófono en el navegador**. El registro del recorrido y del incidente sigue pendiente de adjuntar.

## 4. Decisiones humanas (HITL)

El equipo eligió las herramientas de voz, mantuvo el MVP1, solicitó una auditoría antes de autorizar cambios y limitó la corrección inicial a cinco hallazgos. También reportó la revisión de la configuración del entorno.

**Trazabilidad:** requerimientos → HU13–HU17 → código → pruebas → revisión HITL. Los demás hallazgos se registran como pendientes de evaluación; la respuesta de Codex no acredita por sí sola un commit ni un despliegue.
