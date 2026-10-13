# Prompts — Etapa 06: Pruebas

## Prompt 1 — Auditoría técnica con Codex

Actúa como un ingeniero de software especializado en aseguramiento de calidad (QA), pruebas de software y revisión técnica.

Estoy desarrollando **TechTrack — Gestor de Soporte Técnico**, un MVP para la asignatura Proyecto Integrador II.

La aplicación ya está funcionando localmente con React, TypeScript, Node.js, Express y MongoDB Atlas. Tengo el frontend y el backend ejecutándose correctamente.

Quiero que revises **exclusivamente el proyecto local que tengo abierto en VS Code**, sin clonar el repositorio de GitHub.

### 1. Historias de usuario

El proyecto contempla las siguientes 12 historias:

| ID | Historia de usuario |
|---|---|
| HU01 | Registro de usuario |
| HU02 | Inicio de sesión |
| HU03 | Registro de equipos |
| HU04 | Creación de tareas técnicas |
| HU05 | Consulta de tareas |
| HU06 | Gestión del estado de tareas |
| HU07 | Registro de problema y diagnóstico |
| HU08 | Registro de actividades realizadas y resultados |
| HU09 | Adjuntar evidencias |
| HU10 | Consulta del historial de un equipo |
| HU11 | Consulta del detalle de una tarea |
| HU12 | Supervisión de actividades por administrador |

La referencia oficial es Jira (`MGDST-1` a `MGDST-12`). Ten presente que HU10 corresponde al historial del equipo y HU11 al detalle de tarea, aunque el README pueda indicar algo diferente.

Busca los criterios de aceptación en los documentos locales. Si no encuentras todos los criterios oficiales, indícamelo antes de realizar una evaluación definitiva.

### 2. Revisión técnica

1. Analiza la estructura del frontend y backend.
2. Identifica qué archivos y componentes implementan cada historia de usuario.
3. Revisa las validaciones, autenticación, autorización, persistencia y manejo de errores.
4. Ejecuta las compilaciones del frontend y backend.
5. Ejecuta las pruebas unitarias existentes.
6. Identifica posibles errores, funcionalidades incompletas y riesgos técnicos.

### 3. Restricciones

- No modifiques el código fuente.
- No hagas commits ni push.
- No cambies las dependencias ni ejecutes correcciones automáticas.
- No crees, modifiques ni elimines información de MongoDB.
- No expongas ni copies contraseñas, tokens o secretos del archivo `.env`.
- Puedes generar los archivos temporales necesarios para compilaciones y pruebas unitarias.
- Antes de ejecutar pruebas funcionales que escriban datos, solicita mi autorización.
- No confundas código existente con funcionalidad verificada.

### 4. Informe solicitado

Presenta:

1. Resultado de compilación del frontend y backend.
2. Resultado real de las pruebas unitarias ejecutadas.
3. Matriz de las 12 HU con sus archivos relacionados y estado de implementación identificado mediante revisión del código.
4. Posibles errores y riesgos encontrados.
5. Pruebas funcionales que debemos ejecutar posteriormente.
6. Información o credenciales de prueba que necesitarás para continuar, sin solicitar que las comparta directamente en el chat.

Clasifica las historias como **Implementación identificada, Implementación parcial o No identificada**. No utilices todavía la clasificación de cumplimiento funcional hasta ejecutar y contrastar sus criterios de aceptación.

**Objetivo:** obtener un diagnóstico técnico verificable que nos permita preparar las evidencias de las etapas 06 — Pruebas, 08 — Documentación y 09 — Evaluación.

Al finalizar, entrégame el informe y espera mis instrucciones antes de modificar cualquier archivo o realizar pruebas que alteren información.

---

## Prompt 2 — Pruebas funcionales e integración con Codex

Continúa trabajando como ingeniero de QA sobre el proyecto **TechTrack — Gestor de Soporte Técnico**, utilizando la carpeta local seleccionada en Codex.

En la primera fase verificaste que el frontend y backend compilan correctamente, las 6 pruebas unitarias pasan y existe código relacionado con las 12 historias de usuario.

Ahora quiero avanzar hacia la **validación funcional real del MVP**, contrastando los requisitos con el comportamiento de la aplicación.

### 1. Entorno y credenciales

La aplicación está configurada localmente:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Base de datos: MongoDB Atlas, exclusiva del proyecto TechTrack.

Las credenciales de prueba están almacenadas en el archivo `.env.test.local`, ubicado en la raíz del proyecto.

Variables disponibles:

- `TEST_ADMIN_EMAIL`
- `TEST_ADMIN_PASSWORD`
- `TEST_TECH_EMAIL`
- `TEST_TECH_PASSWORD`

Puedes utilizar estas credenciales exclusivamente para ejecutar las pruebas autorizadas.

**Seguridad:**

- No muestres contraseñas, tokens ni secretos en respuestas, archivos, capturas o registros.
- No copies las credenciales a otros archivos.
- No subas el archivo `.env.test.local` a GitHub ni a servicios externos.
- No modifiques los archivos `.env` existentes.
- No crees commits ni hagas push.

### 2. Historias de usuario y criterios de aceptación

Debemos evaluar las siguientes historias:

| HU | Funcionalidad |
|---|---|
| HU01 | Registro de usuario |
| HU02 | Inicio y cierre de sesión |
| HU03 | Registro de equipos |
| HU04 | Creación de tareas técnicas |
| HU05 | Consulta de tareas |
| HU06 | Gestión del estado de tareas |
| HU07 | Registro de problema y diagnóstico |
| HU08 | Registro de actividades y resultados |
| HU09 | Adjuntar evidencias |
| HU10 | Consultar historial del equipo |
| HU11 | Consultar detalle de tarea |
| HU12 | Supervisión de actividades por administrador |

La referencia oficial de los criterios de aceptación corresponde a Jira, proyecto `MGDST`, historias `MGDST-1` a `MGDST-12`.

**Importante:** HU10 corresponde al historial del equipo y HU11 al detalle de tarea, aunque el README pueda mostrar una numeración diferente.

Revisa los criterios disponibles localmente y verifica si coinciden con Jira. Si no tienes acceso a la versión oficial, solicita que te proporcione una exportación antes de emitir conclusiones definitivas.

### 3. Pruebas funcionales

Evalúa cada historia mediante pruebas reales, incluyendo:

- Escenarios exitosos.
- Datos inválidos y campos obligatorios.
- Persistencia después de guardar y volver a consultar.
- Restricciones entre técnicos y administrador.
- Operaciones no autorizadas.
- Manejo de errores.
- Integridad de las relaciones entre usuarios, equipos, tareas y evidencias.

Comprueba especialmente el flujo integral:

**Registro → Inicio de sesión → Equipo → Tarea → Diagnóstico → Actividades → Evidencia → Finalización → Historial.**

Si puedes automatizar las pruebas mediante API o navegador, utiliza los mecanismos disponibles en el entorno local.

Distingue las pruebas de interfaz, las de API y las verificaciones realizadas únicamente mediante inspección de código.

Si no dispones de automatización de navegador, indícalo y prepara los pasos que yo debo ejecutar manualmente.

### 4. Hallazgos de la primera auditoría

Intenta reproducir o descartar los siguientes problemas:

1. Posible conservación de información de otra cuenta después de cerrar sesión.
2. Ausencia de una fecha independiente para las actividades de HU08.
3. Funcionalidades administrativas adicionales al alcance de consulta definido para HU12.
4. Errores HTTP 500 ante identificadores inválidos.
5. Posible pérdida de documentación al completar una tarea sin guardar los cambios.
6. Restricciones de acceso a equipos, tareas y evidencias de otros usuarios.
7. Validación de imágenes incorrectas, corruptas o superiores al límite permitido.

No presentes un riesgo identificado mediante inspección como un fallo funcional confirmado si no has podido reproducirlo.

### 5. Restricciones sobre MongoDB y el código

La base de datos es exclusiva del proyecto, pero debemos conservar la información existente.

- No elimines registros existentes.
- No modifiques información previa de mis compañeros.
- No ejecutes scripts de limpieza o semillas sin autorización.
- Utiliza datos ficticios claramente identificados, por ejemplo, con el prefijo `QA_TECHTRACK_`.
- No modifiques el código fuente ni instales dependencias adicionales sin consultarme.
- Antes de crear usuarios, equipos, tareas o evidencias, presenta las operaciones previstas y solicita mi autorización.

La autorización para utilizar las credenciales **no implica autorización para modificar los datos**.

### 6. Informe de resultados

Para cada HU genera una matriz con:

| Campo | Contenido |
|---|---|
| Historia | HU y referencia Jira |
| Criterio | Criterio de aceptación evaluado |
| Prueba | Procedimiento ejecutado |
| Resultado observado | Comportamiento real |
| Estado | Cumple / Cumple parcialmente / No cumple / No verificada |
| Evidencia | Respuesta HTTP, salida de prueba, captura o registro |
| Observaciones | Errores, limitaciones y recomendaciones |

Clasifica como **Cumple** únicamente las historias cuyos criterios hayan sido comprobados satisfactoriamente.

Diferencia los resultados de compilación, las pruebas unitarias, las pruebas de integración y las pruebas funcionales de aceptación.

No inventes resultados, porcentajes de cobertura ni pruebas que no fueron ejecutadas.

### 7. Entregables

Cuando las pruebas estén autorizadas y ejecutadas, genera un informe Markdown con:

1. Resumen de resultados.
2. Matriz de las 12 HU.
3. Pruebas ejecutadas y evidencias.
4. Errores reproducidos y riesgos pendientes de verificar.
5. Funcionalidades que cumplen, cumplen parcialmente o no cumplen.
6. Recomendaciones de corrección.
7. Limitaciones de la evaluación.

Guarda el informe en `docs/evidencias-ia/etapas/06-pruebas/`, sin sobrescribir los archivos que ya existen.

No incluyas fechas.

Este informe servirá como base para completar `07-pruebas.md`, `09-evaluacion.md` y las evidencias individuales de cada historia de usuario.

### 8. Antes de comenzar

**Primero realiza una comprobación del entorno y presenta un plan concreto de las pruebas que quieres ejecutar.**

Confirma que puedes usar las credenciales de prueba sin exponerlas, identifica los criterios oficiales que falten y explica qué operaciones escribirían información en MongoDB.

**Espera mi autorización expresa antes de comenzar las pruebas que creen o modifiquen registros.**