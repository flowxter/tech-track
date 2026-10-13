# Product Backlog de TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Asignatura:** Proyecto Integrador II — Universidad del Valle  
**Marco de trabajo:** Scrum aumentado con IA  
**Etapas vinculadas:** 2. Requerimientos y 3. Planificación  
**Versión:** 1.0  
**Estado:** Borrador de refinamiento basado en los documentos 01–03 verificados por el equipo; criterios detallados sujetos a contraste con las HU originales de Jira.

## 1. Propósito y fuentes

Este documento organiza las **12 historias de usuario** de TechTrack y las relaciona con los requisitos de `03-requerimientos.md`. La identificación, el nombre y las prioridades *Alta/Media* proceden de la propuesta y presentación del MVP. Los criterios detallados propuestos en este archivo **no se presentan como transcripción ni aprobación de criterios existentes en Jira**; deben contrastarse con los registros originales antes de fijar la línea base.

El problema y las necesidades del público objetivo provienen de **hipótesis del equipo**, sin entrevistas ni encuestas de validación con técnicos reales. La aprobación interna mediante HITL no equivale a una validación del producto con usuarios.

## 2. Épica y objetivo de producto

**Épica:** Gestión y trazabilidad de soporte técnico.  
**Objetivo del MVP:** permitir el recorrido completo **acceso → equipo → tarea → gestión → diagnóstico → intervención → evidencia → finalización → historial**, incorporando consulta básica de administrador.

**Definición de valor:** no limitar el producto a una lista de tareas: cada trabajo debe vincularse con un equipo, información técnica y evidencia consultable.

## 3. Inventario y trazabilidad

| ID | Nombre de la HU existente | Actor principal | Prioridad inicial | Requisitos asociados | Referencia de planificación |
|---|---|---|---|---|---|
| HU01 | Registro de usuario | Técnico | Alta | RF-01, RNF-03 | Sprint 1 (presentación) |
| HU02 | Inicio de sesión | Técnico | Alta | RF-02, RF-03, RNF-01 | Sprint 1 (presentación) |
| HU03 | Registro de equipos | Técnico | Alta | RF-04, RF-05, RNF-04 | Sprint 1 (presentación) |
| HU04 | Creación de tareas técnicas | Técnico | Alta | RF-05, RF-06, RN-01 | Sprint 1 (presentación) |
| HU05 | Consulta de tareas | Técnico | Alta | RF-07 | Sprint 1 (presentación) |
| HU06 | Gestión del estado de tareas | Técnico | Alta | RF-08, RN-02 | Sprint 1 (presentación) |
| HU07 | Registro de problema y diagnóstico | Técnico | Alta | RF-09, RN-03 | Backlog posterior (presentación) |
| HU08 | Registro de actividades realizadas | Técnico | Alta | RF-10, RN-03 | Backlog posterior (presentación) |
| HU09 | Adjuntar evidencias | Técnico | Alta | RF-11, RNF-07, RNF-08 | Backlog posterior (presentación) |
| HU10 | Consulta del historial de un equipo | Técnico | Alta | RF-12, RN-04 | Backlog posterior (presentación) |
| HU11 | Consulta del detalle de una tarea | Técnico | Media | RF-13 | Backlog posterior (presentación) |
| HU12 | Supervisión de actividades por administrador | Administrador | Media | RF-14, RNF-02, RN-05 | Backlog posterior (presentación) |

**Estimaciones conocidas de la presentación:** HU01–HU06 = **19 Story Points en conjunto**; HU07–HU12 = **28 Story Points en conjunto**. No disponemos aquí de valores verificables por historia; **no distribuir 47 puntos arbitrariamente**.

## 4. Historias y criterios de aceptación candidatos

Los siguientes criterios son una propuesta de refinamiento verificable. Deben cotejarse con los criterios originales registrados por el equipo y con las decisiones aún abiertas de `03-requerimientos.md`. La numeración `CA-HUxx-n` se utiliza para trazabilidad.

### HU01 — Registro de usuario

**Historia:** Como técnico, quiero registrarme para poder utilizar la aplicación.

- **CA-HU01-01:** Dado que el técnico dispone de los datos obligatorios definidos para el registro, cuando los envía correctamente, entonces el sistema crea su cuenta y confirma el resultado.
- **CA-HU01-02:** Cuando falta un dato obligatorio o su formato es inválido, el sistema informa el problema y no confirma la creación.
- **CA-HU01-03:** Las credenciales no se almacenan en texto plano ni se devuelven en la respuesta (RNF-03).

**Por decidir:** campos mínimos, unicidad del identificador, restricciones sobre registro público de administradores.

### HU02 — Inicio de sesión

**Historia:** Como técnico, quiero iniciar sesión para acceder de forma segura a mis tareas.

- **CA-HU02-01:** Con credenciales válidas, el técnico obtiene una sesión y puede acceder a las vistas protegidas.
- **CA-HU02-02:** Con credenciales incorrectas, se rechaza el acceso sin revelar información sensible.
- **CA-HU02-03:** Después de cerrar sesión, no se permite el acceso a operaciones protegidas con la sesión invalidada.

**Por decidir:** mecanismo y tiempo de vida de sesión.

### HU03 — Registro de equipos

**Historia:** Como técnico, quiero registrar un equipo para asociarlo a actividades de soporte.

- **CA-HU03-01:** Al ingresar los datos obligatorios válidos, el técnico puede guardar un equipo y consultar su identificación.
- **CA-HU03-02:** Ante datos inválidos o incompletos, se informa el error y no se confirma un registro incorrecto.
- **CA-HU03-03:** El equipo creado está disponible para seleccionarlo desde el flujo de creación de tareas autorizado.

**Por decidir:** obligatoriedad y unicidad de identificador, serial y otros campos.

### HU04 — Creación de tareas técnicas

**Historia:** Como técnico, quiero crear una tarea para registrar un trabajo técnico pendiente.

- **CA-HU04-01:** Al crear una tarea válida y seleccionar un equipo existente, el sistema guarda la tarea vinculada con ese equipo.
- **CA-HU04-02:** La tarea recién creada se puede encontrar en su listado y presenta el estado inicial definido.
- **CA-HU04-03:** Se rechaza la creación cuando el equipo referenciado no existe o el usuario carece de permiso.

**Por decidir:** asignación de técnico, campos obligatorios, reglas del estado inicial.

### HU05 — Consulta de tareas

**Historia:** Como técnico, quiero consultar mis tareas para saber qué actividades tengo pendientes.

- **CA-HU05-01:** El técnico autenticado puede visualizar las tareas a las que tiene acceso.
- **CA-HU05-02:** Cada tarea presenta información mínima para identificarla y conocer su estado.
- **CA-HU05-03:** El sistema no muestra al técnico información de tareas que no está autorizado a consultar.

**Por decidir:** alcance de visibilidad y necesidad de filtros adicionales.

### HU06 — Gestión del estado de tareas

**Historia:** Como técnico, quiero cambiar el estado de una tarea para indicar si está pendiente, en progreso o completada.

- **CA-HU06-01:** Un técnico autorizado puede actualizar una tarea usando los estados definidos: **Pendiente, En progreso, Completada**.
- **CA-HU06-02:** El estado actualizado persiste y se refleja en el listado y en el detalle de la tarea.
- **CA-HU06-03:** Se rechazan estados desconocidos y cambios solicitados por usuarios sin permisos.

**Por decidir:** retrocesos de estado y requisitos para marcar *Completada*.

### HU07 — Registro de problema y diagnóstico

**Historia:** Como técnico, quiero registrar el problema reportado y el diagnóstico de un equipo para documentar la situación encontrada.

- **CA-HU07-01:** El técnico autorizado puede guardar un problema reportado y un diagnóstico asociados con una tarea existente.
- **CA-HU07-02:** Los datos guardados pueden recuperarse desde la tarea correcta.
- **CA-HU07-03:** Una tarea inexistente o inaccesible no permite registrar información técnica.

**Por decidir:** campos obligatorios y momento del registro.

### HU08 — Registro de actividades realizadas

**Historia:** Como técnico, quiero registrar las actividades realizadas para conservar un historial del trabajo técnico.

- **CA-HU08-01:** El técnico puede documentar las actividades ejecutadas y el resultado obtenido en una tarea autorizada.
- **CA-HU08-02:** Al volver a consultar la tarea, la información persiste correctamente.
- **CA-HU08-03:** La intervención queda vinculada con la tarea y, por medio de esta, con el equipo atendido.

**Por decidir:** un solo registro por tarea o múltiples anotaciones; edición posterior.

### HU09 — Adjuntar evidencias

**Historia:** Como técnico, quiero adjuntar evidencias a una tarea para demostrar el trabajo realizado.

- **CA-HU09-01:** Una tarea autorizada admite una imagen en uno de los formatos permitidos que defina el equipo.
- **CA-HU09-02:** La evidencia guardada se puede consultar desde la tarea correspondiente.
- **CA-HU09-03:** Archivos inválidos o mayores al límite definido son rechazados con un mensaje entendible.
- **CA-HU09-04:** Un usuario no autorizado no puede acceder libremente a evidencias de otras tareas.

**Por decidir:** formatos, tamaño, cantidad de archivos y proveedor de almacenamiento.

### HU10 — Consulta del historial de un equipo

**Historia:** Como técnico, quiero consultar el historial de un equipo para conocer las actividades realizadas anteriormente.

- **CA-HU10-01:** Al seleccionar un equipo, se muestran las intervenciones registradas y vinculadas con él.
- **CA-HU10-02:** No se mezclan intervenciones pertenecientes a equipos distintos.
- **CA-HU10-03:** Si no existen intervenciones, se informa que el historial está vacío sin mostrar registros ficticios.

**Por decidir:** orden, criterios de búsqueda y tratamiento de registros editados.

### HU11 — Consulta del detalle de una tarea

**Historia:** Como técnico, quiero consultar el detalle completo de una tarea para revisar su información, actividades y evidencias.

- **CA-HU11-01:** El técnico con permiso puede consultar la información general y técnica disponible de una tarea.
- **CA-HU11-02:** El detalle permite identificar equipo, estado, problema, diagnóstico, actividades, resultado y evidencias cuando existan.
- **CA-HU11-03:** Se informa adecuadamente cuando la tarea no existe o el usuario no tiene autorización.

### HU12 — Supervisión de actividades por administrador

**Historia:** Como administrador, quiero consultar las actividades realizadas por los técnicos para supervisar el trabajo registrado.

- **CA-HU12-01:** Un administrador autenticado puede consultar las actividades permitidas de los técnicos.
- **CA-HU12-02:** Un técnico sin permisos de administrador no puede ingresar a las consultas exclusivas de supervisión.
- **CA-HU12-03:** La vista de supervisión conserva la relación entre técnico, tarea, equipo y estado cuando corresponda.

**Por decidir:** si el rol administrador puede modificar, reasignar o solamente consultar. El alcance vigente propone **solo consulta**.

## 5. Dependencias lógicas sugeridas

- HU02 depende de disponer del mecanismo de cuentas de HU01 (o una cuenta creada por el sistema).
- HU04 requiere selección de un equipo registrado (HU03); HU05–HU06 operan sobre tareas existentes (HU04).
- HU07–HU09 requieren tareas existentes; HU10 depende de que existan intervenciones asociadas a equipos.
- HU11 presenta los datos construidos a través de HU03–HU09, según disponibilidad.
- HU12 requiere roles y datos de actividad existentes.

Estas son **dependencias de producto propuestas**, no bloqueos ya configurados o comprobados en Jira.

## 6. Priorización, estimación y refinamiento

**Prioridad heredada:** Alta para HU01–HU10; Media para HU11–HU12. La prioridad no equivale a estimación ni a orden definitivo de entrega. Se recomienda revisar el orden con la dependencia, la capacidad real y la necesidad de demostrar el flujo completo.

**Método sugerido para estimar:** Planning Poker con escala Fibonacci (1, 2, 3, 5, 8, 13...), mediante acuerdo del equipo. Registrar los puntos reales por HU en Jira, sin reconstruirlos a partir de los subtotales.

**Definición de preparada (Definition of Ready) propuesta:** historia entendible, actor y valor claros, criterios verificables, dependencias reconocidas, restricciones conocidas o decisión pendiente visible, estimación aceptada por el equipo.

**Definición de terminada (Definition of Done) propuesta:** cambios integrados y revisados; criterios de aceptación satisfechos; pruebas relevantes ejecutadas y registradas; sin errores bloqueantes conocidos; documentación y evidencia HITL actualizadas; commit o PR vinculable a la historia.

## 7. Formato de seguimiento por historia en Jira

Para cada HU conservar: ID de origen, clave real de Jira, descripción, criterios aprobados, prioridad, puntos, sprint, responsable, estado, dependencias, requisitos RF/RNF/RN, enlaces a commits/PR, pruebas, evidencia de funcionamiento y registro de IA/HITL.

**No asociar las claves de otros proyectos de Jira a TechTrack.** Las claves reales se completarán desde el proyecto correcto cuando se tengan disponibles.

## 8. Asistencia de IA y validación HITL

**Entradas:** `02-descubrimiento.md`, `03-requerimientos.md`, presentación original (HU01–HU12 y prioridades) y subtotales de estimación publicados en la exposición.  
**Aporte de IA:** estructuración, redacción candidata de criterios verificables, propuesta de dependencias y trazabilidad.  
**Validación requerida:** cotejar contra Jira, aceptar/corregir/rechazar criterios, confirmar puntos por HU y aprobar DoR/DoD.

| Registro | Estado a diligenciar |
|---|---|
| Responsable de aprobación | Equipo TechTrack |
| Decisión sobre criterios candidatos | Pendiente |
| Verificación con registros originales de Jira | Pendiente |
| Estimaciones individuales | No disponibles en las fuentes revisadas |
| Evidencia | `docs/evidencias-ia/etapas/02-requerimientos/` y carpetas `historias-usuario/HUxx/` |

## 9. Salida hacia planificación

