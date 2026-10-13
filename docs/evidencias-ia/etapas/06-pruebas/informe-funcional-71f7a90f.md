# Informe de pruebas funcionales e integración — TechTrack

**Ejecución:** `QA_TECHTRACK_71F7A90F`. **Código de referencia:** HEAD `5c21775180d6de1ee5dc93beddd8b8d701935a9b`, con cambios previos en ambos package-lock.json y documentación sin seguimiento. No se alteró el código ni las dependencias durante las pruebas.

**Resultado:** cinco HU clasificadas Cumple y siete Cumple parcialmente. Ninguna HU se clasifica íntegramente No cumple o No verificada. Hay un criterio oficial fallido, uno parcialmente comprobado y uno no verificable por ambigüedad. Existe un defecto de confidencialidad reproducido que bloquea recomendar aceptación global del MVP.

**Regla de clasificación:** Cumple exige comprobar todos los criterios oficiales de la HU y no tener una regresión directamente asociada que impida su aceptación. Cumple parcialmente se usa ante criterios incompletos/ambiguos o regresiones funcionales relacionadas. Los criterios oficiales se califican por separado: una regresión adicional no se presenta como si estuviera escrita en Jira. Aprobado en este informe significa resultado de QA para el escenario ejecutado; no sustituye la aprobación HITL del equipo.

## 1. Alcance, entorno y protección de información

Se utilizó exclusivamente el checkout local. Frontend `http://localhost:5173`, API `http://localhost:4000/api`, Node.js `v22.18.0` y npm `10.9.3`. La disponibilidad HTTP se comprobó en la preparación. Las conexiones de la terminal aislada requirieron ejecución fuera de ese aislamiento; el navegador y la API funcionaron en el entorno local. Las pruebas de persistencia consistieron en nuevas consultas HTTP y recargas del navegador, sin conectarse directamente a Atlas ni inspeccionar sus colecciones.

Las credenciales suministradas se leyeron desde .env.test.local en memoria. Las sesiones de API se mantuvieron separadas por actor. El navegador automatizado de esta tarea se utilizó para cuentas QA y una pestaña administrativa de prueba; las pestañas del mismo origen comparten almacenamiento y no se presentan como contextos independientes entre sí. Se cerraron las sesiones QA antes de abrir la pestaña administrativa. No se operaron las sesiones de navegador de los compañeros.

No se ejecutó logout administrativo ni de la cuenta técnica proporcionada. Los cierres de sesión se limitaron a las nuevas cuentas QA; se comprobó la revocación de sus tokens. Las pestañas QA creadas se cerraron al terminar, sin revocar la sesión administrativa. No se modificaron archivos .env, no se instalaron dependencias, no hubo semillas, borrados, commits ni push. Los registros nuevos se conservaron. Los límites autorizados de creación se respetaron.

## 2. Fuentes oficiales y criterios

Se consultaron en modo lectura las historias MGDST-1 a MGDST-12 de [Jira](https://smart-table.atlassian.net/jira/software/projects/MGDST/list). Sus 59 criterios coincidieron con docs/evidencias-ia/etapas/02-requerimientos/01-generacion-hu-criterios/02-respuesta-ia-compartida.md al normalizar espacios y viñetas. Se conserva el texto consultado en [criterios-jira.json](qa-funcional-71f7a90f/criterios-jira.json). Los IDs CA-HUxx-n de este informe son etiquetas de trazabilidad asignadas en el orden oficial; no se atribuyen como campos originales de Jira. HU10 es historial y HU11 detalle. El README local mantiene la numeración intercambiada.

Ambigüedades que siguen abiertas: HU03 no define cuándo ni con qué alcance es única la serie/identificación; HU08 no distingue fecha de ejecución, de registro o general de tarea. Para HU12 se usa el alcance estricto de la pantalla de supervisión como consulta: crear una tarea desde esa pantalla contradice ese alcance. El modal de revisión, considerado aisladamente, sí es de solo lectura. Si el equipo separa formalmente asignación y supervisión, deberá documentar el cambio de alcance y reevaluar CA-HU12-05.

## 3. Resultados por nivel de prueba

| Nivel | Resultado y límite |
|---|---|
| Compilación frontend | Correcta en fase 1: npm.cmd run build --prefix front, salida 0. No se repitió en esta ejecución porque no cambió el código. |
| Compilación backend | Correcta en fase 1: npm.cmd run build --prefix back, salida 0. No se repitió en esta ejecución. |
| Unitarias | Fase 1: seis aprobadas, cero fallidas; estados e imágenes. No se presentan como una nueva ejecución de fase 2. No hay unitarias frontend identificadas. |
| API e integración | 80 solicitudes registradas en el ejecutor principal: 78 códigos HTTP esperados y 2 discordancias, ambas 500 ante IDs mal formados. El diagnóstico temporal adicional realizó cinco solicitudes HTTP, todas 200. Las respuestas y su contenido se revisaron para las aserciones descritas. |
| Navegador | 25 observaciones guardadas. Incluyen sondeos previos a terminar respuestas asíncronas; estos no son casos fallidos. Los registros con sufijo settled documentan el resultado definitivo. No se publica un porcentaje de éxito de navegador. |
| Aceptación por criterio | 56 Cumple; 1 Cumple parcialmente; 1 No cumple; 1 No verificada. Total: 59. |

Los conteos de solicitudes HTTP, observaciones de navegador y criterios son unidades diferentes. No se midió cobertura porcentual, carga, rendimiento bajo concurrencia ni aceptación con usuarios reales.

## 4. Matriz de las 12 HU

| HU / Jira | Funcionalidad | Estado | Criterios y observaciones |
|---|---|---|---|
| HU01 / [MGDST-1](https://smart-table.atlassian.net/browse/MGDST-1) | Registro de usuario | **Cumple** | Cinco criterios comprobados mediante API y formulario de acceso. |
| HU02 / [MGDST-2](https://smart-table.atlassian.net/browse/MGDST-2) | Inicio y cierre de sesión | **Cumple parcialmente** | Cinco criterios oficiales aprobados; D01 impide aceptar el aislamiento entre sesiones. Logout administrativo excluido. |
| HU03 / [MGDST-3](https://smart-table.atlassian.net/browse/MGDST-3) | Registro de equipos | **Cumple parcialmente** | Cuatro criterios aprobados; unicidad comprobada solo por identificador y propietario. |
| HU04 / [MGDST-4](https://smart-table.atlassian.net/browse/MGDST-4) | Creación de tareas técnicas | **Cumple** | Cinco criterios aprobados; referencias inválidas rechazadas. |
| HU05 / [MGDST-5](https://smart-table.atlassian.net/browse/MGDST-5) | Consulta de tareas | **Cumple** | Cuatro criterios aprobados; listas actualizadas separan propietarios. |
| HU06 / [MGDST-6](https://smart-table.atlassian.net/browse/MGDST-6) | Gestión del estado de tareas | **Cumple parcialmente** | Cinco criterios oficiales aprobados; D03 falla al completar con cambios pendientes. |
| HU07 / [MGDST-7](https://smart-table.atlassian.net/browse/MGDST-7) | Problema y diagnóstico | **Cumple** | Cinco criterios aprobados para documentación guardada; bloqueo al completar comprobado. |
| HU08 / [MGDST-8](https://smart-table.atlassian.net/browse/MGDST-8) | Actividades y resultados | **Cumple parcialmente** | Cuatro criterios aprobados; semántica de fecha de actividad sin resolver. |
| HU09 / [MGDST-9](https://smart-table.atlassian.net/browse/MGDST-9) | Adjuntar evidencias | **Cumple** | Cinco criterios aprobados; tres formatos válidos y rechazo de ejemplos inválidos. |
| HU10 / [MGDST-10](https://smart-table.atlassian.net/browse/MGDST-10) | Historial del equipo | **Cumple parcialmente** | Cinco criterios oficiales aprobados en sesión propia; D01 expone historial anterior al cambiar de cuenta. |
| HU11 / [MGDST-11](https://smart-table.atlassian.net/browse/MGDST-11) | Detalle de tarea | **Cumple parcialmente** | Cinco criterios oficiales aprobados en sesión propia; D01 mantiene detalle ajeno pese al 404. |
| HU12 / [MGDST-12](https://smart-table.atlassian.net/browse/MGDST-12) | Supervisión administrativa | **Cumple parcialmente** | Cuatro criterios aprobados; C05 falla bajo el alcance de supervisión solo de consulta de Jira. |

## 5. Evaluación de los 59 criterios

Los identificadores API y UI remiten a [api-final.json](qa-funcional-71f7a90f/api-final.json), [navegador-final.json](qa-funcional-71f7a90f/navegador-final.json) y al diagnóstico [fecha-actividad.json](qa-funcional-71f7a90f/fecha-actividad.json). Las referencias agrupadas con barras indican los IDs completos que comparten el prefijo.

### HU01 — Registro de usuario

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU01-01**: El usuario puede ingresar los datos requeridos para registrarse. | Navegador: abrir registro y examinar campos; API: enviar nombre, correo y contraseña válidos. | Formulario con los tres campos; ambas solicitudes válidas aceptadas. | Cumple | UI-REGISTER-required; API-REGISTER-qaA/qaB |
| **CA-HU01-02**: El sistema valida que los campos obligatorios estén completos. | API: enviar registro vacío y datos inválidos; navegador: comprobar campos requeridos. | HTTP 400 para datos inválidos; los tres campos indican required y valueMissing al estar vacíos. | Cumple | API-REGISTER-missing/email/short; UI-REGISTER-required |
| **CA-HU01-03**: El sistema evita registrar un correo que ya exista. | API: repetir el correo de QA A. | HTTP 409, mensaje de cuenta existente. | Cumple | API-REGISTER-duplicate |
| **CA-HU01-04**: Si el registro es válido, se crea la cuenta y se confirma el registro. | API: registrar QA A y QA B; iniciar sesión posteriormente. | HTTP 201 y confirmación de cuenta; logins posteriores HTTP 200. | Cumple | API-REGISTER-qaA/qaB; API-LOGIN-qaA-verify/qaB-verify |
| **CA-HU01-05**: Si hay datos inválidos, el sistema informa el error y no crea la cuenta. | API: omitir campos, usar correo inválido y contraseña corta. | HTTP 400 con mensajes de error y sin respuesta de creación; inventario final de dos cuentas QA. | Cumple | API-REGISTER-missing/email/short |

### HU02 — Inicio y cierre de sesión

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU02-01**: El usuario puede ingresar sus credenciales. | Navegador: introducir credenciales QA en el formulario. | Acceso de QA A y QA B completado sin revelar credenciales. | Cumple | UI-ACCOUNT-residual-history; UI-DOC-reload; API-LOGIN-qaA-verify/qaB-verify |
| **CA-HU02-02**: El sistema valida las credenciales. | API: contrastar credenciales correctas e incorrectas. | Correctas: HTTP 200; incorrectas: HTTP 401. | Cumple | API-LOGIN-qaA-verify/qaB-verify; API-LOGIN-invalid |
| **CA-HU02-03**: Con credenciales válidas, el usuario accede a la aplicación. | Navegador: iniciar sesión y acceder a consola y formularios. | QA A accedió a consola, creó equipo y tarea y guardó documentación. | Cumple | UI-EQUIPMENT-created; UI-TASK-created; UI-DOC-save |
| **CA-HU02-04**: Con credenciales inválidas, el sistema muestra un mensaje de error. | API y navegador: intentar login con contraseña incorrecta. | HTTP 401 y mensaje visible Correo o contraseña incorrectos. | Cumple | API-LOGIN-invalid; UI-LOGIN-invalid |
| **CA-HU02-05**: El usuario no puede acceder a las funciones protegidas sin autenticarse. | API: consultar tareas, administración y evidencia sin token; navegador: cerrar sesiones QA. | HTTP 401 en consultas anónimas; el cierre vuelve a la pantalla de acceso. Los tokens anteriores de ambas cuentas QA reciben 401. La fuga entre cuentas autenticadas se registra aparte como D01. | Cumple | API-ANON-tasks; API-ADMIN-anonymous; API-IMAGE-anonymous; API-LOGOUT-revoked; API-LOGOUT-B-revoked |

### HU03 — Registro de equipos

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU03-01**: El técnico puede registrar un equipo con la información básica requerida. | Navegador: registrar MAIN_A; API: registrar EMPTY_A y MAIN_B. | Tres equipos creados y recuperados mediante consultas nuevas. | Cumple | UI-EQUIPMENT-created; API-EQUIPMENT-empty/B; API-EQUIPMENT-final-A/B |
| **CA-HU03-02**: El sistema valida los campos obligatorios. | API: enviar equipo vacío; navegador: comprobar obligatoriedad. | HTTP 400; los seis campos del formulario son obligatorios. | Cumple | API-EQUIPMENT-missing; UI-EQUIPMENT-required |
| **CA-HU03-03**: El identificador o número de serie no puede duplicarse cuando corresponda. | API: repetir assetTag de MAIN_A dentro de QA A. | HTTP 409 para identificador repetido del mismo propietario. No se comprobó unicidad global ni de serial; la condición cuando corresponda carece de alcance preciso. | Cumple parcialmente | API-EQUIPMENT-duplicate |
| **CA-HU03-04**: El equipo registrado queda disponible para asociarlo a tareas. | Navegador: seleccionar MAIN_A al crear tarea; API: consultar equipos y tarea. | Equipo disponible en selector y vinculado por su ID a FLOW_A. | Cumple | UI-TASK-created; API-DETAIL-integrity-final |
| **CA-HU03-05**: El sistema confirma el registro exitoso. | Navegador y API: guardar equipos válidos. | Mensaje visible Equipo registrado correctamente y confirmaciones HTTP 201. | Cumple | UI-EQUIPMENT-created; API-EQUIPMENT-empty/B |

### HU04 — Creación de tareas técnicas

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU04-01**: El técnico puede crear una tarea indicando la actividad a realizar. | Navegador: crear FLOW_A indicando título y descripción. | Tarea creada, formulario cerrado y título visible en listado. | Cumple | UI-TASK-created |
| **CA-HU04-02**: La tarea puede asociarse a un equipo registrado. | Navegador: seleccionar MAIN_A; API: intentar equipos ajeno e inexistente. | Vínculo correcto con MAIN_A; referencias ajenas o inexistentes rechazadas con 404. | Cumple | UI-TASK-created; API-TASK-foreign-equipment/unknown-equipment; API-DETAIL-integrity-final |
| **CA-HU04-03**: La tarea registra la información básica necesaria para realizar el trabajo. | API: recuperar tarea y contrastar sus datos iniciales. | Título, descripción, equipo, propietario y estado presentes. | Cumple | API-TASK-list-A; API-DETAIL-integrity-final |
| **CA-HU04-04**: Una tarea nueva queda inicialmente en estado Pendiente. | Navegador y API: observar tarea recién creada. | Estado inicial PENDING, mostrado como Pendiente. | Cumple | UI-TASK-created; API-TASK-list-A; API-TASK-B |
| **CA-HU04-05**: La tarea aparece en la lista de tareas del técnico. | Navegador: comprobar lista tras creación; API: volver a consultar. | FLOW_A aparece en lista propia; QA B recupera su tarea y la asignada por administrador. | Cumple | UI-TASK-created; API-FINAL-list-A/B; API-ASSIGNMENT-visible |

### HU05 — Consulta de tareas

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU05-01**: El técnico puede visualizar sus tareas. | API y navegador: consultar listados de QA A y QA B. | QA A tiene sus dos tareas; QA B sus dos tareas. Tras cambiar a QA B, el listado actualizado contiene solo ISOLATION_B en el momento observado. | Cumple | API-FINAL-list-A/B; UI-ACCOUNT-task-list |
| **CA-HU05-02**: Cada tarea muestra al menos su título, equipo asociado y estado. | Navegador: observar tabla; API: inspeccionar tareas recuperadas. | Cada fila presenta título, equipo y selector de estado. | Cumple | UI-TASK-created; API-FINAL-list-A/B |
| **CA-HU05-03**: El técnico puede identificar las tareas pendientes, en progreso y completadas. | Navegador: observar tarea nueva, avanzar y completar; API: consultar inventario final. | Se observaron Pendiente, En progreso y Completada; el inventario final conserva los estados respectivos. | Cumple | UI-TASK-created; API-DOC-persist-first; UI-STATUS-completed; API-FINAL-list-A/B |
| **CA-HU05-04**: La lista se actualiza cuando se crean o modifican tareas. | Navegador: crear tarea y actualizar estado y documentación. | La tarea aparece al crearla y su estado cambia en la tabla; nuevas consultas recuperan los cambios. | Cumple | UI-TASK-created; UI-STATUS-completed; API-TASK-list-A; API-FINAL-list-A |

### HU06 — Gestión del estado de tareas

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU06-01**: El técnico puede cambiar el estado de una tarea. | Navegador: avanzar FLOW_A mediante el selector. | Avance a En progreso y después Completada. | Cumple | API-DOC-persist-first; UI-STATUS-completed; API-DETAIL-integrity-final |
| **CA-HU06-02**: Los estados disponibles son Pendiente, En progreso y Completada. | Navegador: examinar opciones; API: enviar CANCELLED y retroceso. | Flujo con los tres estados; desconocido rechazado con 400 y retroceso con 409. | Cumple | API-STATUS-unknown/backward; UI-STATUS-completed |
| **CA-HU06-03**: El sistema guarda el nuevo estado. | API: volver a leer tarea tras cambios. | FLOW_A y UNSAVED_A persisten COMPLETED; ISOLATION_B persiste IN_PROGRESS. | Cumple | API-DETAIL-integrity-final; API-UNSAVED-persisted; API-FINAL-list-B |
| **CA-HU06-04**: El nuevo estado se refleja en la lista y detalle de la tarea. | Navegador: observar estado y recargar; API: comparar lista y detalle. | Listado y detalle reflejan estado persistido. | Cumple | UI-STATUS-completed; UI-UNSAVED-after-reload; API-FINAL-list-A; API-DETAIL-integrity-final |
| **CA-HU06-05**: Una tarea completada no pierde la información previamente registrada. | Guardar documentación y evidencias, completar y consultar de nuevo. | Se conservan diagnóstico guardado, actividades, resultado y tres evidencias. D03 afecta cambios todavía no guardados, no pérdida de datos previamente registrados. | Cumple | API-DETAIL-integrity-final; API-IMAGE-read-jpeg/png/webp |

### HU07 — Problema y diagnóstico

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU07-01**: El técnico puede registrar el problema reportado. | Navegador: introducir y guardar problema reportado. | Valor PROBLEMA_GUARDADO recuperado después de recargar. | Cumple | UI-DOC-save/reload; API-DETAIL-integrity-final |
| **CA-HU07-02**: El técnico puede registrar el diagnóstico realizado. | Navegador: guardar diagnóstico y editarlo antes de completar. | DIAGNOSTICO_1 persiste tras recarga; edición a DIAGNOSTICO_2 persiste al finalizar. | Cumple | UI-DOC-reload; API-DETAIL-integrity-final |
| **CA-HU07-03**: La información queda asociada a la tarea y al equipo correspondiente. | API: comprobar propietario, tarea y equipo del documento. | Documentación de FLOW_A vinculada a QA A y MAIN_A; intento de QA B rechazado. | Cumple | API-DETAIL-integrity-final; API-DOC-foreign |
| **CA-HU07-04**: El sistema permite editar la información mientras la tarea no haya finalizado. | Navegador: editar antes de finalizar; API: intentar editar tras finalizar. | Edición anterior aceptada; controles bloqueados y HTTP 409 después de completar. | Cumple | UI-DOC-reload; UI-STATUS-completed; API-FINAL-doc-locked |
| **CA-HU07-05**: La información registrada queda disponible en el detalle de la tarea. | Navegador: reabrir detalle tras recarga; API: recuperar detalle. | Problema y diagnóstico guardados disponibles. D01 afecta confidencialidad de datos ya cargados en otra sesión. | Cumple | UI-DOC-reload; API-DETAIL-integrity-final |

### HU08 — Actividades y resultados

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU08-01**: El técnico puede registrar las actividades ejecutadas. | Navegador: guardar actividades; API: registrar actividad de QA B. | ACTIVIDAD_1 y ACTIVIDAD_B recuperadas. | Cumple | UI-DOC-save/reload; API-DETAIL-integrity-final; API-ACTIVITY-date-semantics |
| **CA-HU08-02**: Puede describir el resultado obtenido después de la intervención. | Navegador y API: guardar y recuperar resultados. | RESULTADO_1 y RESULTADO_B conservados. | Cumple | UI-DOC-reload; API-DETAIL-integrity-final; API-ACTIVITY-date-semantics |
| **CA-HU08-03**: La información queda asociada a la tarea y al equipo. | API: consultar tarea documentada y comprobar IDs. | Actividad y resultado vinculados a su tarea, propietario y equipo. | Cumple | API-DETAIL-integrity-final; API-FINAL-list-B |
| **CA-HU08-04**: El registro conserva la fecha de la actividad. | API: guardar actividad, leer, cambiar solo estado y volver a leer; inspección del modelo. | Hay fechas generales de creación y actualización; la de actualización cambia sin cambiar la actividad. No hay campo propio de fecha de actividad. Falta definir si Jira exige fecha de ejecución o registro y si una fecha general resulta aceptable. | No verificada | API-ACTIVITY-date-semantics; fecha-actividad.json; back/src/models/Task.ts |
| **CA-HU08-05**: Las actividades quedan disponibles para consultas posteriores. | Navegador: recargar y abrir historial; API: consultar después de completar. | Actividades y resultados recuperables en nuevas consultas. | Cumple | UI-DOC-reload; UI-HISTORY-own-settled; API-DETAIL-integrity-final |

### HU09 — Adjuntar evidencias

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU09-01**: El técnico puede adjuntar imágenes a una tarea. | API: subir JPEG y PNG; navegador: adjuntar WEBP. | Tres imágenes adjuntadas; WEBP cargada mediante selector de archivo. | Cumple | API-IMAGE-jpeg/png; UI-IMAGE-upload |
| **CA-HU09-02**: El sistema valida el formato y las restricciones definidas para los archivos. | API: enviar archivo falso, truncado, MIME discordante, PDF, sin archivo y tamaño superior a 5 MB. | HTTP 400 en formatos/contenido inválidos y ausencia de archivo; HTTP 413 para tamaño excesivo. Total final: tres evidencias válidas. | Cumple | API-IMAGE-fake/truncated/mismatch/pdf/missing/oversize; API-DETAIL-integrity-final |
| **CA-HU09-03**: Las evidencias quedan asociadas a la tarea correcta. | API: comprobar IDs de evidencia; intentar leer evidencia A desde tarea B. | Tres evidencias en FLOW_A; combinación tarea B/evidencia A rechazada con 404. | Cumple | API-DETAIL-integrity-final; API-EVIDENCE-task-mismatch |
| **CA-HU09-04**: El técnico puede consultar las evidencias posteriormente. | Navegador: observar galería; API: descargar contenido autenticado. | Las tres imágenes se decodifican en galería; HTTP 200, MIME correcto y bytes recuperables. Acceso anónimo 401 y ajeno 404. | Cumple | UI-IMAGE-upload; API-IMAGE-read-jpeg/png/webp; API-IMAGE-foreign/anonymous |
| **CA-HU09-05**: La evidencia se conserva junto con la documentación de la intervención. | Completar tarea y recuperar documentación e imágenes. | Tres imágenes permanecen asociadas; hashes de JPEG/PNG coinciden con cargas y WEBP con archivo sintético. | Cumple | API-DETAIL-integrity-final; API-IMAGE-read-jpeg/png/webp |

### HU10 — Historial del equipo

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU10-01**: El técnico puede seleccionar un equipo registrado. | Navegador: seleccionar EMPTY_A y MAIN_A desde equipos. | Ambos equipos abren sus historiales correspondientes en sesión QA A. | Cumple | UI-HISTORY-empty-settled; UI-HISTORY-own-settled |
| **CA-HU10-02**: El sistema muestra las actividades realizadas sobre ese equipo. | Navegador y API: consultar historial de MAIN_A. | Se muestran FLOW_A y UNSAVED_A, con resumen de actividad/problema. El historial B contiene sus dos tareas. D01 demuestra persistencia indebida de historial A al cambiar de cuenta. | Cumple | UI-HISTORY-own-settled; API-FINAL-history; API-HISTORY-B-final; UI-ACCOUNT-residual-history |
| **CA-HU10-03**: El historial muestra información temporal de las intervenciones. | Navegador: observar información temporal; API: revisar presencia de fechas sin guardarlas en evidencias. | La interfaz presenta fecha de actualización por intervención. La semántica de fecha de actividad se mantiene pendiente en HU08. | Cumple | UI-HISTORY-own-settled; API-ACTIVITY-date-semantics |
| **CA-HU10-04**: Cada registro permite identificar la tarea o actividad realizada. | Navegador: revisar títulos y abrir entrada; API: comprobar IDs. | Cada entrada identifica su tarea; las consultas corresponden al equipo indicado. | Cumple | UI-HISTORY-own-settled; API-FINAL-history |
| **CA-HU10-05**: Si el equipo no tiene historial, el sistema informa que no existen intervenciones registradas. | Navegador y API: consultar EMPTY_A. | Mensaje Este equipo aún no tiene historial y colección tasks vacía. | Cumple | UI-HISTORY-empty-settled; API-HISTORY-empty-final |

### HU11 — Detalle de tarea

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU11-01**: El técnico puede abrir una tarea desde su lista. | Navegador: abrir FLOW_A desde la lista de QA A. | Modal Detalle de intervención accesible. D01 confirma que también queda accesible información en caché de otra cuenta. | Cumple | UI-DOC-save/reload; UI-ACCOUNT-residual-detail |
| **CA-HU11-02**: El detalle muestra la información básica de la tarea y su estado. | Navegador y API: examinar detalle antes y después de finalizar. | Título, información básica y estado disponibles y persistidos. | Cumple | UI-STATUS-completed; API-DETAIL-integrity-final |
| **CA-HU11-03**: El detalle muestra el equipo asociado. | Navegador y API: comprobar equipo del detalle. | MAIN_A identificado y asociado por ID. | Cumple | UI-TASK-created; API-DETAIL-integrity-final |
| **CA-HU11-04**: El detalle muestra problema, diagnóstico, actividades y resultado cuando estén registrados. | Navegador: recuperar campos después de recarga. | Problema, diagnóstico, actividades y resultado guardados disponibles. | Cumple | UI-DOC-reload; API-DETAIL-integrity-final |
| **CA-HU11-05**: El detalle permite consultar las evidencias asociadas. | Navegador: consultar galería; API: recuperar evidencias de detalle. | Tres imágenes visibles y cargadas en galería. | Cumple | UI-IMAGE-upload; API-DETAIL-integrity-final |

### HU12 — Supervisión administrativa

| Criterio oficial | Prueba ejecutada | Resultado observado | Estado | Evidencia |
|---|---|---|---|---|
| **CA-HU12-01**: El administrador puede consultar las actividades registradas por los técnicos. | API y navegador: abrir supervisión como administrador. | Se consultan actividades QA de ambos técnicos; técnico y anónimo reciben 403 y 401 respectivamente. | Cumple | UI-ADMIN-list-settled; API-ADMIN-final-activities; API-ADMIN-denied/anonymous |
| **CA-HU12-02**: Puede identificar qué técnico realizó cada actividad. | Navegador y API: examinar propietario de cada actividad QA. | Nombre de QA A o QA B e ID de propietario recuperados. | Cumple | UI-ADMIN-list-settled; API-ADMIN-final-activities |
| **CA-HU12-03**: Puede consultar la tarea y equipo asociados. | Navegador: revisar FLOW_A; API: obtener detalle administrativo. | Tarea, técnico y equipo asociados presentes. | Cumple | UI-ADMIN-review; API-ADMIN-detail |
| **CA-HU12-04**: Puede visualizar el estado y la información registrada de la actividad. | Navegador: revisar campos de solo lectura, estado e imágenes. | Campos técnicos disponibles, cero controles editables en el modal y tres imágenes cargadas. | Cumple | UI-ADMIN-review; UI-ADMIN-images-settled; API-ADMIN-detail/evidence |
| **CA-HU12-05**: El administrador no modifica la información mediante esta funcionalidad de consulta. | Navegador: observar supervisión y crear la cuarta tarea QA desde Asignar nueva tarea. | La vista de supervisión permite una escritura: ADMIN_ASSIGNED_B se crea y aparece en la API. El modal de revisión sí es de solo lectura; no se comprobó ni se afirma edición de documentación ajena. La clasificación aplica al alcance de la pantalla completa de supervisión. | No cumple | UI-ADMIN-assignment; API-ASSIGNMENT-visible |

## 6. Errores y desviaciones reproducidos

**D01 — Alta: historial y documentación de otra cuenta visibles en memoria del frontend.** Pasos: entrar como QA A; consultar el historial de MAIN_A; cerrar QA A; iniciar QA B en la misma pestaña. Resultado: se mantiene el encabezado y las entradas del equipo de QA A. Abrir FLOW_A muestra problema, diagnóstico, actividades, resultado y recomendaciones de QA A. La API responde 404, pero la interfaz conserva el modal con datos previos. Se comprobaron separadamente listados actualizados de QA B: solo contienen sus propios registros. No se demostró acceso a binarios de evidencia ajenos ni evasión de permisos de la API. Evidencia: UI-ACCOUNT-residual-history/detail, API-FINAL-foreign-detail y capturas. Recomendación: limpiar todo el estado sensible al cambiar de sesión, proteger renderizado por rol/propietario y abrir detalle únicamente después de obtener una respuesta autorizada; descartar respuestas pendientes de la sesión anterior.

![Perfil de QA B](qa-funcional-71f7a90f/sesion-qa-b.png)

![Documentación de QA A visible durante la sesión QA B](qa-funcional-71f7a90f/detalle-ajeno-visible.png)

**D02 — Media: HTTP 500 para identificadores mal formados.** GET /tasks/invalid-id y GET /equipment/invalid-id/history, autenticados como QA A, devolvieron 500 y mensaje genérico de error interno. El esperado del caso de robustez era 400; un ID bien formado inexistente sí devolvió 404. No se escribió información. Evidencia: API-DETAIL-malformed y API-HISTORY-malformed. Recomendación: validar parámetros y traducir CastError a respuesta controlada de cliente.

**D03 — Media: finalizar sin guardar muestra un valor que no quedó persistido.** En UNSAVED_A se guardó BASELINE, se cambió el diagnóstico a SIN_GUARDAR y se completó sin pulsar Guardar documentación. El formulario deshabilitado mostró SIN_GUARDAR. Tras recargar, mostró BASELINE; la API confirmó BASELINE y estado COMPLETED. No se perdió la versión guardada previamente; se descartó el cambio pendiente sin aviso y la pantalla sugirió conservarlo. Evidencia: UI-UNSAVED-before-reload/after-reload y API-UNSAVED-persisted. Recomendación: detectar cambios pendientes antes de completar y exigir guardar o descartar expresamente; sincronizar los valores mostrados con la respuesta persistida.

**D04 — Media, alcance: Supervisión incorpora creación/asignación.** Se creó ADMIN_ASSIGNED_B desde esa pantalla, para QA B y su equipo MAIN_B. La API confirmó la nueva tarea y su vínculo. El modal de revisión tenía cero controles editables y permitió consultar las tres imágenes. No se afirma que el administrador pueda editar documentación de otros técnicos. Evidencia: UI-ADMIN-assignment/review/images-settled y API-ASSIGNMENT-visible. Recomendación: separar la asignación del flujo de consulta o aprobar y documentar expresamente la ampliación del alcance.

**D05 — Baja, contrato: /auth/me devuelve id y el cliente tipa _id.** La respuesta efectiva incluye id, name, email y role, mientras types.ts declara _id. No se reprodujo una caída de interfaz por este motivo. Evidencia: API-ME-contract e inspección de front/src/types.ts. Recomendación: unificar el contrato y añadir una prueba de integración.

**D06 — Baja, contrato: metadatos de evidencia distintos entre listado/historial y detalle.** FLOW_A tiene tres evidencias en detalle, pero el listado e historial devuelven evidence vacío desde el campo embebido de Task. El detalle obtiene la colección Evidence; la interfaz recupera las imágenes al pedir ese detalle. No se demostró pérdida de imágenes. Evidencia: API-FINAL-history, API-FINAL-list-A y API-DETAIL-integrity-final; inspección de Task y taskWithEvidence. Recomendación: establecer qué representan esas respuestas y evitar dos fuentes de verdad para el mismo campo.

## 7. Hallazgos que no equivalen a un fallo de aceptación confirmado

- HU08: se confirmó ausencia de campo independiente y cambio de fecha general al modificar estado, conservando actividad y resultado. No se declara fallido el criterio temporal hasta que el equipo concrete su semántica; la fecha general de creación también existe.
- HU03: se confirmó 409 para assetTag duplicado del mismo propietario. No se probó duplicado de serial ni de identificador entre propietarios porque falta acordar la regla y se alcanzó el límite autorizado de tres equipos.
- Aislamiento de API: las pruebas ejecutadas rechazaron equipo/tarea ajenos, cambios de documentación/estado ajenos, evidencia ajena, combinación tarea/evidencia incorrecta y consultas administrativas de técnicos. Esto no elimina D01, localizado en datos ya cargados en el frontend.
- Inspección pendiente de reproducción: errores de base de datos traducidos a 401, revocación fallida silenciosa ante fallo de red, respuestas tardías, escrituras concurrentes, consumo de memoria/cuotas de evidencias y estado de salud tras una desconexión real.
- El límite Unicode/bcrypt fue comprobado aisladamente en fase 1; no se creó una cuenta adicional ni se cambió una contraseña para repetirlo funcionalmente.

## 8. Pruebas no ejecutadas y límites

1. Cambio administrador → técnico mediante logout del administrador: excluido expresamente; no se revocaron sus sesiones.
2. Fallos reales de Atlas, desconexión del backend y fallos durante logout: no se interrumpieron servicios ni se alteró infraestructura.
3. Doble envío de altas que pudiera crear entidades adicionales: no se ejecutó después de consumir los cupos autorizados. No se afirma que el riesgo haya sido descartado.
4. Respuestas deliberadamente demoradas y carreras de finalización/documentación/evidencia: no se controló el transporte ni se instrumentó la aplicación; permanecen pendientes.
5. Registro válido completo desde navegador: las dos altas se ejecutaron por API; el formulario de registro y sus campos requeridos se observaron en navegador. La aceptación de registro por API está comprobada, pero no se presenta como recorrido exitoso de registro por interfaz.
6. Unicidad de serial/global y significado de fecha de actividad: requieren definición de producto antes de decidir sus criterios afectados.
7. Pruebas responsive, accesibilidad completa, expiración natural de JWT, carga, cuotas agregadas y totalidad de variantes de archivos corruptos: no ejecutadas. Los ejemplos de archivos rechazados no prueban todos los formatos maliciosos posibles.
8. No se inspeccionaron directamente documentos de MongoDB ni hashes almacenados; el almacenamiento se verificó a través de nuevas consultas API, logins y recargas. Tampoco se obtuvo una instantánea de toda la información previa para comparar modificaciones externas concurrentes. Las operaciones de este ejecutor y navegador se limitaron a altas QA y actualizaciones de las nuevas tareas.

## 9. Inventario conservado e integridad

| Tipo | Identificador QA | ID | Estado final comprobado |
|---|---|---|---|
| Usuario técnico | QA_TECHTRACK_71F7A90F_qaA | 6acde127d210ffe076320e5e | Cuenta creada; login y logout QA comprobados |
| Usuario técnico | QA_TECHTRACK_71F7A90F_qaB | 6acde127d210ffe076320e61 | Cuenta creada; login y logout QA comprobados |
| Equipo | QA_TECHTRACK_71F7A90F_EMPTY_A | 6acde150d210ffe076320e66 | Persistido; propietario qaA |
| Equipo | QA_TECHTRACK_71F7A90F_MAIN_B | 6acde151d210ffe076320e69 | Persistido; propietario qaB |
| Equipo | QA_TECHTRACK_71F7A90F_MAIN_A | 6acde1e2d210ffe076320e74 | Persistido; propietario qaA |
| Tarea | QA_TECHTRACK_71F7A90F_UNSAVED_A | 6acde274d210ffe076320e89 | COMPLETED |
| Tarea | QA_TECHTRACK_71F7A90F_FLOW_A | 6acde212d210ffe076320e78 | COMPLETED |
| Tarea | QA_TECHTRACK_71F7A90F_ADMIN_ASSIGNED_B | 6acde55ed210ffe076320fc3 | PENDING |
| Tarea | QA_TECHTRACK_71F7A90F_ISOLATION_B | 6acde273d210ffe076320e83 | IN_PROGRESS |
| Evidencia | QA_TECHTRACK_71F7A90F.jpeg | 6acde31dd210ffe076320ef2 | image/jpeg, 268 bytes; asociada a FLOW_A |
| Evidencia | QA_TECHTRACK_71F7A90F.png | 6acde31dd210ffe076320ef9 | image/png, 95 bytes; asociada a FLOW_A |
| Evidencia | QA_TECHTRACK_71F7A90F.webp | 6acde359d210ffe076320f00 | image/webp, 64 bytes; asociada a FLOW_A |

Total conservado: **dos cuentas técnicas, tres equipos, cuatro tareas y tres imágenes válidas**. JPEG, PNG y WEBP se recuperaron con MIME correcto y hashes coincidentes. No hubo limpieza automática.

## 10. Evidencias y recomendaciones para el pipeline

- [Texto oficial de criterios](qa-funcional-71f7a90f/criterios-jira.json).
- [Registro final de 80 solicitudes API](qa-funcional-71f7a90f/api-final.json).
- [Observaciones finales de navegador](qa-funcional-71f7a90f/navegador-final.json).
- [Diagnóstico temporal: cinco solicitudes HTTP](qa-funcional-71f7a90f/fecha-actividad.json).
- [Documentación guardada](qa-funcional-71f7a90f/documentacion-guardada.png).
- [Revisión administrativa](qa-funcional-71f7a90f/revision-administrativa.png).
- [Detalle ajeno visible](qa-funcional-71f7a90f/detalle-ajeno-visible.png) y [perfil QA B](qa-funcional-71f7a90f/sesion-qa-b.png).

Las capturas son recortes directos del navegador, sin edición de contenido, elegidos para excluir fechas y secretos. Las evidencias JSON omiten credenciales, tokens y valores temporales. api-preliminar.json y navegador.json son instantáneas intermedias conservadas; para las conclusiones se usan las versiones finales. El inventario del ejecutor registra altas y no actualiza todos los campos de las entidades: los estados y el número final de evidencias se toman de las lecturas finales, no de esa instantánea de altas. Las observaciones UI-HISTORY-empty, UI-HISTORY-own, UI-ADMIN-list y UI-ADMIN-review.images se tomaron antes de terminar respuestas asíncronas; los correspondientes registros settled resuelven esos estados transitorios.

**Orden recomendado de corrección, sin cambios aplicados:** resolver D01 y añadir regresión de cambio de cuenta; controlar IDs inválidos; advertir cambios sin guardar al completar; concretar HU03/HU08 y alcance de HU12; unificar contratos y evidencias; completar pruebas de concurrencia, transporte, interfaz y seguridad pendientes. Después de cada corrección ejecutar la regresión correspondiente y actualizar la trazabilidad criterio → caso → resultado → versión → validación humana.

Para etapa 06, este informe aporta casos y resultados verificables. Para etapa 08, documentar numeración correcta, contratos y límites efectivos. Para etapa 09, registrar defectos abiertos y decisiones HITL; no convertir cinco HU calificadas Cumple en una aceptación global mientras D01 permanezca abierto. No se modificaron 07-pruebas.md ni 09-evaluacion.md.
