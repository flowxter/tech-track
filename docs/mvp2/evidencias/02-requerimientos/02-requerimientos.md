# 02. Requerimientos — TechTrack MVP2

**Proyecto:** TechTrack — Gestor de Soporte Técnico<br>
**Etapa:** Requerimientos<br>
**Enfoque:** Ampliación del MVP1 con reconocimiento y síntesis de voz

## 1. Propósito

Definir las funciones de voz incorporadas a TechTrack, sus condiciones de uso y sus criterios de aceptación. Se conservan las HU01–HU12 del MVP1; las HU13–HU17 son propuestas para formalizar en Jira.

## 2. Requerimientos funcionales

| ID | Requerimiento | HU |
|---|---|---|
| RF-M2-01 | Transcribir voz en español y agregar el resultado a un campo editable. | HU13 |
| RF-M2-02 | Generar un borrador de tarea a partir de equipo, título y descripción dictados. | HU14 |
| RF-M2-03 | Distribuir un informe dictado entre los campos de documentación técnica. | HU15 |
| RF-M2-04 | Proponer asignaciones mediante voz exclusivamente a usuarios administradores. | HU16 |
| RF-M2-05 | Reproducir tareas y resúmenes hablados, con respaldo de la voz del navegador. | HU17 |

## 3. Historias de usuario y criterios de aceptación

**HU13 — Dictado individual.** Como técnico, quiero dictar información en los campos de una tarea para documentar el trabajo sin escribir todo manualmente.

- El sistema transcribe el audio y muestra el texto en el campo correspondiente.
- El contenido escrito previamente no se elimina por un dictado.
- Si la transcripción falla o no detecta voz, muestra un mensaje y conserva la información existente.

**HU14 — Creación de tareas por voz.** Como técnico, quiero dictar los datos de una tarea para preparar su registro más rápidamente.

- El sistema identifica título, descripción y equipo cuando la información es reconocible.
- Ante un equipo no identificado o ambiguo, exige selección manual.
- El usuario revisa y confirma el borrador antes de crear la tarea; los dictados consecutivos no reemplazan silenciosamente cambios manuales.

**HU15 — Informe técnico por voz.** Como técnico, quiero dictar un informe completo para registrar una intervención en una sola grabación.

- El sistema propone contenido para problema, diagnóstico, actividades, resultado y recomendaciones.
- El técnico puede revisar y corregir los campos antes de guardarlos.
- La información no interpretada correctamente debe poder recuperarse o corregirse sin perder el texto original. **Pendiente de verificar íntegramente.**

**HU16 — Asignación mediante voz.** Como administrador, quiero dictar una asignación para distribuir tareas a los técnicos.

- Solo un administrador autenticado accede a la función.
- Se reconocen técnico, equipo y datos de la tarea cuando la instrucción es clara.
- Ante nombres ambiguos o negaciones, no se asigna automáticamente; la asignación requiere confirmación.

**HU17 — Lectura de tareas.** Como técnico, quiero escuchar tareas y resúmenes para consultar mi trabajo mediante audio.

- El sistema reproduce el detalle de una tarea y un resumen de tareas por atender.
- El usuario puede detener la lectura; no deben superponerse dos reproducciones.
- Si ElevenLabs falla, se ofrece la voz del navegador. **La lectura de textos extensos debe evitar omisiones silenciosas; pendiente de verificar.**

## 4. Requerimientos no funcionales y reglas

| ID | Condición |
|---|---|
| RNF-M2-01 | Las claves de AssemblyAI y ElevenLabs permanecen únicamente en el backend. |
| RNF-M2-02 | El micrófono requiere permiso del usuario y debe liberarse al finalizar o cancelar la grabación. |
| RNF-M2-03 | Los errores de audio, permisos, red o proveedor se muestran sin borrar información existente. |
| RNF-M2-04 | Se respetan los permisos por usuario y rol; no se relacionan equipos o técnicos de forma incierta. |
| RNF-M2-05 | El código mantiene separación entre captura, transcripción, interpretación y persistencia, con pruebas automatizadas. |

**Regla central:** la voz genera propuestas editables; ninguna tarea, asignación o documentación se guarda sin confirmación humana. AssemblyAI transcribe y TechTrack interpreta los datos mediante reglas; ElevenLabs sintetiza la lectura.

## 5. Relación con MVP1 y validación

HU13 y HU15 amplían HU07–HU08; HU14 amplía HU04 y depende de HU03; HU16 complementa la supervisión de HU12; HU17 utiliza información de HU05 y HU11. Los criterios originales del MVP1 no se reemplazan.

Se verificó en localhost la transcripción y creación de borradores mediante voz. Las pruebas automatizadas reportadas por Codex usan servicios simulados. La aceptación de cada nueva HU debe registrarse con **criterio → prueba → resultado → evidencia → commit**; no se presume cumplida únicamente por existir en el código.
