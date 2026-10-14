# Corrección integral del MVP TechTrack — Desarrollo, pruebas y trazabilidad

Actúa como un ingeniero de software senior especializado en React, TypeScript, Node.js, Express, MongoDB y aseguramiento de calidad.

Estamos desarrollando **TechTrack — Gestor de Soporte Técnico**, un MVP académico de Proyecto Integrador II.

Tu objetivo es **corregir los defectos identificados durante las pruebas funcionales, mejorar la estabilidad del MVP y generar evidencias verificables del trabajo realizado**, respetando las decisiones del equipo.

## 1. Contexto del proyecto

**Repositorio:** `flowxter/tech-track`

**Rama de trabajo:** `fix/mejoras-integrales-mvp`

**Tecnologías:**
- Frontend: React + TypeScript + Vite.
- Backend: Node.js + TypeScript + Express.
- Base de datos: MongoDB Atlas mediante Mongoose.
- Autenticación: JWT.
- Gestión de requisitos: Jira, proyecto `MGDST`.

El proyecto contempla 12 historias de usuario (`MGDST-1` a `MGDST-12`), agrupadas en la épica `MGDST-13`.

Las historias HU10 y HU11 deben seguir la numeración oficial de Jira:
- HU10: historial de equipos.
- HU11: detalle de una tarea.

El equipo organizó el trabajo en dos Sprints planificados.

## 2. Evidencia técnica de referencia

Antes de modificar código, lee:

`docs/evidencias-ia/etapas/06-pruebas/informe-funcional-71f7a90f.md`

Revisa también:
- Los criterios oficiales de Jira disponibles en el proyecto.
- La documentación de arquitectura.
- La documentación de Desarrollo y Pruebas.
- El código real del frontend y backend.
- Los tests existentes.

La evaluación anterior registró:
- 5 historias que cumplen.
- 7 historias que cumplen parcialmente.
- 56 de 59 criterios oficiales cumplidos.
- 1 criterio parcial, 1 incumplido y 1 no verificado.
- 6 pruebas unitarias aprobadas.
- Compilaciones correctas del frontend y backend.

**No interpretes estos resultados como aceptación global del MVP.**

El principal problema identificado es D01, relacionado con confidencialidad entre sesiones.

## 3. Defectos que debes corregir

### D01 — Información residual entre cuentas

**Prioridad: crítica.**

Se reprodujo el siguiente escenario:

1. El técnico A inicia sesión.
2. Consulta el historial de un equipo o la documentación de una tarea.
3. Cierra sesión.
4. El técnico B inicia sesión en la misma pestaña.
5. La interfaz conserva y muestra información del técnico A, aunque la API rechaza las consultas ajenas.

Analiza las causas y corrige el problema de manera integral.

Revisa:
- Estado global y local de React.
- Limpieza de información al cerrar sesión.
- Inicialización del estado al iniciar con otro usuario.
- Solicitudes asíncronas pendientes.
- Posibles respuestas tardías de la sesión anterior.
- Historial de equipos.
- Detalle de tareas.
- Diagnósticos, actividades y evidencias.
- Componentes que conservan información sensible.

**Resultado esperado:** al cambiar de cuenta, ningún dato del usuario anterior debe aparecer en la interfaz, ni siquiera temporalmente.

Mantén las restricciones de acceso existentes en el backend.

### D02 — Errores HTTP 500 ante identificadores inválidos

**Prioridad: alta.**

Algunas rutas de equipos y tareas responden con HTTP 500 cuando reciben identificadores mal formados.

Revisa los endpoints afectados y aplica validaciones consistentes.

**Resultado esperado:**
- Identificador mal formado: error de cliente controlado, preferiblemente HTTP 400.
- Identificador válido pero inexistente: HTTP 404 cuando corresponda.
- Acceso sin permisos: conservar las restricciones existentes.
- Evitar errores internos innecesarios y exposición de información técnica sensible.

Agrega pruebas para estos escenarios.

### D03 — Cambios sin guardar al completar tareas

**Prioridad: alta.**

Se reprodujo un escenario en el que el técnico modifica el diagnóstico de una tarea y la completa sin guardar previamente.

La interfaz muestra temporalmente el contenido nuevo como si estuviera almacenado, pero al recargar aparece el valor anterior.

**Resultado esperado:**
- No mostrar cambios sin guardar como si estuvieran persistidos.
- Advertir claramente cuando existan modificaciones pendientes.
- Impedir que la finalización genere una falsa confirmación de guardado.
- Mantener la persistencia correcta de los datos previamente guardados.

Puedes implementar un bloqueo con aviso para guardar primero, o una solución equivalente, siempre que sea sencilla, consistente y segura.

Verifica que no se pierdan diagnósticos, actividades, resultados ni evidencias guardadas.

### D05 — Inconsistencia `id` / `_id`

**Prioridad: media.**

Se identificó una diferencia entre la respuesta de `/auth/me`, que utiliza `id`, y algunos tipos del frontend que esperan `_id`.

Revisa el contrato real entre frontend y backend.

Unifica el manejo de identificadores sin introducir incompatibilidades ni modificar innecesariamente el formato de las respuestas públicas.

No afirmes que este hallazgo ocasionó una falla funcional si no puedes reproducirla.

### D06 — Metadatos de evidencias

**Prioridad: baja.**

Se identificaron diferencias entre los metadatos de evidencias presentados en listados, historiales y detalles.

Revisa la representación y el mapeo de esos datos.

**Resultado esperado:** consistencia en los campos disponibles, sin afectar la recuperación de imágenes ni las restricciones de acceso.

## 4. Requisitos que necesitan decisión humana

Estos aspectos también forman parte de la revisión integral, pero **no debes cambiar unilateralmente su alcance**.

### HU03 — Unicidad de equipos

El criterio oficial exige evitar duplicados cuando corresponda.

La prueba verificó unicidad del identificador dentro del propietario, pero no quedó definido el alcance de la regla.

Analiza la implementación y presenta alternativas:
- Unicidad por técnico.
- Unicidad global.
- Unicidad de identificador, serial o combinación.

Explica las consecuencias de cada opción y recomienda una, pero solicita decisión del equipo antes de modificar la regla de negocio.

### HU08 — Fecha de actividad

El criterio oficial exige conservar la fecha de la actividad.

Se observó que existen fechas generales de creación y actualización, pero no se verificó una fecha independiente de ejecución.

Determina qué existe actualmente y propone cómo representar la fecha de actividad sin confundirla con `updatedAt`.

Solicita autorización antes de introducir un nuevo requisito funcional.

### HU12 / D04 — Supervisión administrativa

El criterio oficial indica que la supervisión es una funcionalidad de consulta y no debe modificar información.

Sin embargo, la interfaz administrativa permite crear o asignar tareas.

Comprueba si esta acción forma parte de otra funcionalidad o si realmente contradice el alcance de HU12.

Presenta una propuesta para separar supervisión de asignación sin eliminar funcionalidades existentes innecesariamente.

**No elimines la capacidad de asignar tareas ni cambies los criterios de Jira sin autorización.**

## 5. Autorizaciones y restricciones

Queda autorizado:
- Analizar y modificar el código local para corregir D01, D02, D03, D05 y D06.
- Refactorizar lo estrictamente necesario.
- Crear o modificar pruebas automatizadas.
- Ejecutar compilaciones y pruebas locales.
- Documentar el trabajo realizado.

No está autorizado:
- Modificar o eliminar registros existentes de MongoDB Atlas.
- Ejecutar migraciones, semillas, limpiezas o borrados de datos sin aprobación.
- Crear usuarios, equipos, tareas o evidencias en la base de datos compartida sin autorización adicional.
- Ejecutar logout administrativo.
- Modificar credenciales, tokens o secretos.
- Exponer contenido de `.env`, `.env.local` o `.env.test.local`.
- Cambiar los criterios oficiales de Jira.
- Modificar los Story Points, Sprints o estados de las historias.
- Hacer commits, push o merge sin autorización.
- Cambiar de rama de Git.
- Sobrescribir el informe original de pruebas de Codex.

Antes de ejecutar pruebas que escriban en MongoDB Atlas, solicita autorización y especifica los registros que se crearían o modificarían.

Prioriza pruebas aisladas con mocks o una base de datos de pruebas independiente cuando sea viable.

Si encuentras modificaciones locales preexistentes, consérvalas y evita sobrescribirlas.

No instales dependencias adicionales sin justificar su necesidad.

## 6. Metodología de trabajo

Trabaja en el siguiente orden:

**Fase 1 — Diagnóstico**

- Verifica la rama actual y el estado de Git.
- Revisa el informe funcional y el código.
- Localiza las causas de D01, D02, D03, D05 y D06.
- Identifica qué archivos requieren modificaciones.
- Distingue problemas reproducidos, riesgos potenciales y decisiones pendientes.

**Fase 2 — Implementación**

Corrige los defectos autorizados empezando por D01.

Mantén los cambios lo más pequeños y localizados posible.

No modifiques funcionalidades ajenas al problema sin necesidad justificada.

**Fase 3 — Verificación**

Ejecuta, como mínimo, cuando el entorno lo permita:

```bash
cd back
npm run build
npm test
```

```bash
cd front
npm run build
```

Agrega pruebas de regresión para los cambios realizados.

Comprueba especialmente:
- Cambio de usuario A → B en la misma pestaña.
- Limpieza de información sensible después del logout.
- Respuestas asíncronas de la sesión anterior.
- Acceso a historial y detalle de tareas.
- Identificadores inválidos.
- Cambios sin guardar al completar una tarea.
- Consistencia de identificadores y evidencias.

Si no puedes comprobar un escenario en navegador o API real, indícalo expresamente. No lo declares aprobado basándote únicamente en inspección de código.

**Fase 4 — Decisiones pendientes**

Presenta recomendaciones para HU03, HU08 y HU12.

No implementes esos cambios hasta obtener la decisión humana correspondiente.

**Fase 5 — Documentación**

Conserva las evidencias previas y registra esta nueva intervención.

## 7. Evidencias de IA que debes generar

Dentro de:

`docs/evidencias-ia/etapas/05-desarrollo/correcciones/mejoras-integrales-mvp/`

Crea:

**`prompt.md`**
- Conserva íntegra esta instrucción original.
- No la resumas ni la reemplaces por un prompt inventado.

**`respuesta-ia.md`**
- Explica el diagnóstico y las correcciones efectivamente realizadas.
- Indica qué defectos se resolvieron, cuáles permanecen abiertos y por qué.
- Incluye los resultados reales de compilación y pruebas.
- No afirmes acciones que no se ejecutaron.

**`trazabilidad.md`**
- Relaciona cada defecto con los archivos modificados, pruebas realizadas y resultados.
- Identifica las HU relacionadas.

**`validacion-hitl.md`**
- Registra las autorizaciones humanas que realmente recibiste.
- Distingue decisiones tomadas y pendientes.
- No atribuyas aprobaciones al equipo si no fueron expresadas.

En:

`docs/evidencias-ia/etapas/06-pruebas/`

Genera:

**`informe-regresion-mejoras-integrales.md`**

Incluye:
- Defectos evaluados.
- Pruebas ejecutadas.
- Resultados observados.
- Evidencias disponibles.
- Limitaciones.
- Estado final de cada defecto: corregido y verificado, corregido sin verificación funcional, pendiente o no reproducido.

No modifiques las cifras originales de la evaluación anterior. Los resultados nuevos deben aparecer separados para conservar la trazabilidad.

**No incluyas fechas en los documentos.**

## 8. Resultado final esperado

Al terminar, presenta:

1. Resumen de las correcciones implementadas.
2. Tabla con D01–D06 y su estado real.
3. Archivos modificados.
4. Pruebas ejecutadas y resultados.
5. Cambios que requieren decisión humana.
6. Riesgos o defectos que permanecen abiertos.
7. Estado de Git y confirmación de que no hiciste commit ni push.

No declares el MVP completamente terminado ni aceptado si quedan defectos críticos, requisitos ambiguos o pruebas pendientes.

**Objetivo final:** mejorar la calidad y seguridad de TechTrack, conservar las funcionalidades existentes y producir evidencias académicas reales del proceso de desarrollo asistido por IA.