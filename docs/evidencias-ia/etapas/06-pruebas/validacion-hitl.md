# Validación HITL — Pruebas

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 06. Pruebas  
**Herramienta:** Codex

## 1. Decisiones humanas

| Situación | Decisión humana | Resultado |
|---|---|---|
| Codex presentó un plan de pruebas funcionales con creación de datos QA. | **Aceptada con restricciones:** utilizar únicamente registros nuevos y conservar la información existente. | Se crearon 2 usuarios, 3 equipos, 4 tareas y 3 imágenes de prueba. |
| Codex planteó probar el cierre de sesión administrativo. | **No autorizado**, para evitar revocar otras sesiones administrativas. | Prueba excluida de la ejecución. |
| Evaluación de requisitos. | Utilizar los **59 criterios oficiales de Jira**, con HU10 como historial y HU11 como detalle. | Se generó una matriz de resultados para las 12 HU. |
| Defectos identificados por Codex. | Revisar primero los resultados antes de autorizar modificaciones del código. | Se conservó la implementación original durante las pruebas. |

## 2. Resultados obtenidos

Codex ejecutó dos fases de evaluación:

- **Auditoría técnica:** compilaciones correctas y 6 pruebas unitarias aprobadas.
- **Pruebas funcionales:** validación mediante API y navegador frente a los criterios oficiales de Jira.

La evaluación clasificó **5 historias como Cumple y 7 como Cumple parcialmente**.

El principal defecto reproducido fue **D01**, relacionado con información de una cuenta anterior que permanecía visible en el frontend después de cambiar de usuario. Aunque el backend rechazó el acceso no autorizado, este hallazgo impide recomendar la aceptación global del MVP.

También se identificaron problemas de manejo de identificadores inválidos (D02) y cambios sin guardar al completar tareas (D03).

Estos resultados corresponden a la evaluación realizada por Codex y **no constituyen una aprobación funcional definitiva por parte del equipo**.

## 3. Decisiones pendientes

- Corregir los defectos D01–D03 y repetir las pruebas correspondientes.
- Definir la regla de unicidad de equipos (HU03).
- Precisar el significado de la fecha de actividad (HU08).
- Decidir si la asignación administrativa forma parte del alcance de HU12.

El informe funcional original se conserva como evidencia del estado evaluado. Las futuras correcciones deberán registrarse en **05 — Desarrollo** y sus pruebas de regresión en **06 — Pruebas**, sin reemplazar los resultados iniciales.

**Resultado HITL:** el equipo estableció restricciones para ejecutar las pruebas, autorizó únicamente las operaciones controladas y mantuvo la decisión de no modificar el código antes de revisar los defectos. La aceptación definitiva del MVP permanece pendiente.