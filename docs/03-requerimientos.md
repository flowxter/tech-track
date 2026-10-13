# Especificación de Requerimientos – TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Asignatura:** Proyecto Integrador II  
**Universidad:** Universidad del Valle  
**Metodología:** Scrum aumentado con Inteligencia Artificial  
**Etapa del pipeline:** 2. Requerimientos  
**Versión:** 1.0  
**Estado:** Propuesta inicial, pendiente de validación HITL del equipo

## 1. Introducción

TechTrack es una aplicación web orientada a la gestión y trazabilidad de actividades de soporte y mantenimiento informático. Su propósito es relacionar las tareas técnicas con los equipos intervenidos, los problemas reportados, los diagnósticos, las actividades realizadas, las evidencias y el historial de intervenciones.

Este documento transforma el alcance preliminar descrito en `02-descubrimiento.md` en requisitos verificables que servirán como referencia para el Product Backlog, la planificación, el diseño de arquitectura, la implementación y las pruebas del MVP.

La definición del problema y las necesidades de los usuarios parten de **hipótesis del equipo**, no de entrevistas, encuestas ni validación con técnicos reales. Por tanto, los requisitos aquí formulados describen el comportamiento **propuesto** para el MVP y están sujetos a revisión y aprobación humana.

### 1.1. Objetivo

Especificar los requisitos funcionales, no funcionales, reglas de negocio, restricciones y relaciones de trazabilidad necesarios para desarrollar y evaluar el MVP de TechTrack.

### 1.2. Documentos de entrada

- `docs/01-pipeline.md`: proceso de Ingeniería de Software Aumentada con IA y validación HITL.
- `docs/02-descubrimiento.md`: problema, hipótesis, usuarios, propuesta de valor y alcance.
- Propuesta inicial del proyecto TechTrack.
- Presentación *MVP – Gestor de Soporte Técnico*, que identifica las 12 historias de usuario.

### 1.3. Convenciones

- **RF:** requisito funcional; expresa qué debe hacer el sistema.
- **RNF:** requisito no funcional; expresa una condición de calidad o restricción sobre su funcionamiento.
- **RN:** regla de negocio; expresa una condición que gobierna el proceso.
- **HU:** historia de usuario, identificada del HU01 al HU12.
- **HITL:** validación humana de las propuestas generadas por IA.

Los identificadores son estables dentro de esta versión. Si algún requisito se modifica, deberá conservarse su trazabilidad.

## 2. Alcance y actores

### 2.1. Alcance funcional

El MVP permitirá que un técnico se autentique, registre o seleccione un equipo, cree una tarea, gestione su estado, documente el problema y la intervención, adjunte evidencias visuales y consulte el historial técnico correspondiente. Se contempla también un administrador con capacidad básica de supervisión.

El sistema será una **aplicación web adaptable a diferentes tamaños de pantalla**. No se contempla una aplicación móvil nativa ni una plataforma empresarial completa de tickets.

### 2.2. Actores

| Actor | Función prevista |
|---|---|
| Técnico | Registra equipos, gestiona sus tareas y documenta intervenciones. |
| Administrador o supervisor | Consulta actividades de los técnicos para supervisión básica. |
| Sistema TechTrack | Almacena, relaciona y presenta la información conforme a las reglas definidas. |

**Aclaración:** la IA se utilizará de forma transversal **para desarrollar** TechTrack; no se ha definido una función obligatoria de IA **dentro del producto**.

## 3. Requisitos funcionales

Los requisitos siguientes se derivan del alcance propuesto y las historias de usuario de la presentación. Su redacción detallada constituye una especificación inicial, no una aprobación definitiva.

| ID | Requisito funcional propuesto | HU relacionada | Prioridad de la HU |
|---|---|---|---|
| **RF-01** | El sistema debe permitir el registro de un usuario técnico con los datos necesarios para crear una cuenta. | HU01 | Alta |
| **RF-02** | El sistema debe permitir iniciar sesión mediante credenciales válidas y rechazar las inválidas. | HU02 | Alta |
| **RF-03** | El sistema debe permitir cerrar la sesión iniciada y restringir el acceso a funciones protegidas cuando no exista una sesión válida. | HU02 | Alta |
| **RF-04** | El sistema debe permitir registrar un equipo informático con información que permita identificarlo. | HU03 | Alta |
| **RF-05** | El sistema debe permitir consultar y seleccionar equipos previamente registrados al asociarlos con una actividad técnica. | HU03, HU04 | Alta |
| **RF-06** | El sistema debe permitir crear una tarea técnica y asociarla con un equipo registrado. | HU04 | Alta |
| **RF-07** | El sistema debe permitir al técnico consultar sus tareas y conocer su estado actual. | HU05 | Alta |
| **RF-08** | El sistema debe permitir actualizar el estado de una tarea entre los estados definidos para el MVP. | HU06 | Alta |
| **RF-09** | El sistema debe permitir registrar el problema reportado y el diagnóstico técnico asociados a una tarea. | HU07 | Alta |
| **RF-10** | El sistema debe permitir documentar las actividades realizadas y el resultado de una intervención técnica. | HU08 | Alta |
| **RF-11** | El sistema debe permitir adjuntar y consultar evidencias visuales asociadas a una tarea técnica. | HU09 | Alta |
| **RF-12** | El sistema debe permitir consultar el historial de intervenciones asociadas con un equipo. | HU10 | Alta |
| **RF-13** | El sistema debe permitir consultar el detalle de una tarea, incluida la información técnica y las evidencias que tenga registradas. | HU11 | Media |
| **RF-14** | El sistema debe permitir al administrador consultar las actividades de los técnicos para realizar una supervisión básica. | HU12 | Media |

### 3.1. Información mínima propuesta

A continuación se relacionan los datos que razonablemente se requieren para implementar los RF. **La obligatoriedad exacta de cada campo debe decidirse durante el refinamiento de las HU**.

| Entidad | Datos propuestos | Observaciones |
|---|---|---|
| Usuario | Identificador, nombre, correo o identificador de acceso, credencial protegida, rol. | El mecanismo exacto de autenticación se detallará en arquitectura. |
| Equipo | Identificador, nombre o descripción, tipo, marca, modelo, número de serie. | La propuesta inicial menciona estos datos como posibles; se debe definir cuáles serán obligatorios. |
| Tarea | Identificador, equipo asociado, título o descripción, estado, técnico responsable, fecha de creación. | La necesidad de fecha límite o prioridad por tarea no está establecida en el alcance inicial. |
| Registro técnico | Problema reportado, diagnóstico, actividades realizadas, resultado. | Se asocia a la tarea correspondiente. |
| Evidencia | Identificador, tarea asociada, ubicación o referencia al archivo, tipo de archivo. | Se priorizarán imágenes y capturas. |
| Historial | Referencias a las tareas e intervenciones de un mismo equipo y sus fechas. | Puede derivarse de los registros de tareas; no se exige crear una entidad independiente. |

### 3.2. Comportamientos esperados

- Un registro exitoso debe permitir que el usuario acceda posteriormente con sus credenciales.
- Una tarea recién creada debe poder consultarse en el listado correspondiente.
- Un cambio de estado debe reflejarse en el detalle y listado de la tarea.
- La información técnica y las evidencias deben quedar asociadas a la tarea correcta.
- El historial de un equipo debe presentar sus intervenciones registradas, sin mezclar las de equipos distintos.
- La supervisión del administrador debe respetar los permisos definidos para ese rol.

Estos comportamientos orientan la especificación; los **criterios de aceptación completos y los escenarios de prueba por HU** se formalizarán en `04-product-backlog.md`.

## 4. Requisitos no funcionales

Los RNF siguientes se **proponen** a partir del alcance y los riesgos del descubrimiento. No deben considerarse metas cuantitativas aprobadas cuando no se haya establecido una medida.

| ID | Atributo | Requisito no funcional propuesto | Verificación prevista |
|---|---|---|---|
| **RNF-01** | Seguridad | Las funciones protegidas solo deben ser accesibles a usuarios autenticados. | Intentar acceder sin iniciar sesión. |
| **RNF-02** | Autorización | Las operaciones deben respetar los permisos del técnico y del administrador; estos controles deben aplicarse en el servidor. | Probar operaciones autorizadas y no autorizadas por rol. |
| **RNF-03** | Protección de credenciales | Las contraseñas no deben almacenarse en texto plano ni exponerse en respuestas o registros. | Inspección de implementación y almacenamiento. |
| **RNF-04** | Integridad de datos | No se deben registrar tareas vinculadas con equipos inexistentes ni evidencias desvinculadas de su tarea. | Pruebas de creación y referencias inválidas. |
| **RNF-05** | Usabilidad | La interfaz debe presentar estados, formularios y mensajes comprensibles para realizar el flujo principal. | Recorrido funcional y revisión de mensajes de error. |
| **RNF-06** | Compatibilidad | La aplicación web debe adaptarse a pantallas de escritorio y móviles. | Revisión del flujo principal en diferentes anchos de pantalla. |
| **RNF-07** | Validación de archivos | La carga de evidencias debe restringirse a tipos y tamaños permitidos, validados en el servidor. | Intentos de carga válida, inválida y excesiva. |
| **RNF-08** | Privacidad | Las evidencias y la información técnica no deben quedar públicamente accesibles por omisión. | Verificación de acceso sin autorización. |
| **RNF-09** | Rendimiento | Las operaciones esenciales deben responder de manera adecuada para una demostración del MVP. | Medir tiempos bajo un escenario de prueba definido. **Meta numérica pendiente.** |
| **RNF-10** | Mantenibilidad | El código debe estar organizado, tipado con TypeScript y versionado, separando responsabilidades del frontend y backend. | Revisión de estructura, código y repositorio. |
| **RNF-11** | Confiabilidad | El sistema debe comunicar los errores y evitar confirmar operaciones que no se guardaron correctamente. | Pruebas de fallos de validación y persistencia. |
| **RNF-12** | Verificabilidad | Las funcionalidades implementadas deben poder comprobarse mediante pruebas y evidencias vinculadas con sus requisitos. | Trazabilidad RF/HU → criterio → prueba → commit. |

### 4.1. Decisiones no funcionales pendientes

El equipo deberá acordar antes de dar por cerrados los RNF:

- Los **formatos y el tamaño máximo** admitidos para las evidencias. JPEG y PNG son opciones iniciales, no una decisión aprobada.
- El **escenario de carga** y la **meta de tiempo de respuesta** de operaciones esenciales.
- Los **navegadores y dispositivos** utilizados para verificar compatibilidad.
- El mecanismo de **autenticación y duración de sesión** que se adoptará en arquitectura.
- La política de conservación o eliminación de tareas, equipos y evidencias.

No se incorporan cifras ficticias de disponibilidad, rendimiento o volumen de usuarios.

## 5. Reglas de negocio

Las siguientes reglas se deducen del flujo de TechTrack. Se indica cuáles deben confirmarse para evitar presentar decisiones nuevas como si ya estuvieran acordadas.

| ID | Regla propuesta | Estado |
|---|---|---|
| **RN-01** | Cada tarea técnica debe estar relacionada con un equipo registrado. | Derivada del flujo del MVP; validar. |
| **RN-02** | Los estados iniciales de una tarea son **Pendiente**, **En progreso** y **Completada**. | Incluida en el descubrimiento; validar implementación. |
| **RN-03** | El diagnóstico, las actividades realizadas y las evidencias de una intervención deben asociarse con su tarea. | Derivada del alcance; validar. |
| **RN-04** | El historial de un equipo debe construirse exclusivamente a partir de intervenciones asociadas con él. | Derivada de la trazabilidad; validar. |
| **RN-05** | El administrador tendrá inicialmente funciones de consulta y supervisión, sin asumir edición general de trabajos técnicos. | Alcance propuesto; confirmar permisos. |
| **RN-06** | Las tareas de un técnico no deben poder modificarse por usuarios sin autorización. | Propuesta de seguridad; confirmar alcance de colaboración. |

**Reglas todavía no definidas:** si una tarea puede marcarse como completada sin diagnóstico, resultado o evidencia; si los estados pueden retroceder; si pueden eliminarse equipos con historial; y cómo se asigna una tarea a un técnico. Estas decisiones se deberán resolver y documentar, no presuponer.

## 6. Restricciones y exclusiones

### 6.1. Restricciones tecnológicas acordadas

| Componente | Tecnología prevista |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript |
| Base de datos | MongoDB |
| Repositorio y control de versiones | Git + GitHub |
| Gestión del trabajo | Jira |
| Apoyo de IA | ChatGPT y otras herramientas que el equipo registre cuando las utilice |

Estas selecciones son el punto de partida; la arquitectura detallada, bibliotecas y servicios de despliegue se documentarán en su etapa.

### 6.2. Fuera del alcance del MVP

Quedan fuera de esta especificación inicial la aplicación móvil nativa, el sistema empresarial de tickets con SLA, el inventario avanzado, la facturación, el chat entre técnicos, las integraciones con WhatsApp o correo, las notificaciones externas avanzadas, el diagnóstico y predicción automática de fallas con IA, la ejecución remota de comandos, los tableros empresariales avanzados y la arquitectura multiempresa.

Estas exclusiones siguen lo establecido en `02-descubrimiento.md` y ayudan a evitar ampliaciones no planificadas.

## 7. Matriz de trazabilidad inicial

La siguiente matriz relaciona las historias ya presentadas con los requisitos formulados aquí. No sustituye los criterios de aceptación detallados del futuro Product Backlog.

| HU | Descripción de la historia existente | Requisitos relacionados | Prioridad preliminar |
|---|---|---|---|
| HU01 | Registro de usuario | RF-01; RNF-03 | Alta |
| HU02 | Inicio de sesión | RF-02, RF-03; RNF-01 | Alta |
| HU03 | Registro de equipos | RF-04, RF-05; RNF-04 | Alta |
| HU04 | Creación de tareas técnicas | RF-05, RF-06; RN-01 | Alta |
| HU05 | Consulta de tareas | RF-07 | Alta |
| HU06 | Gestión del estado de tareas | RF-08; RN-02 | Alta |
| HU07 | Registro de problema y diagnóstico | RF-09; RN-03 | Alta |
| HU08 | Registro de actividades realizadas | RF-10; RN-03 | Alta |
| HU09 | Adjuntar evidencias | RF-11; RNF-07, RNF-08 | Alta |
| HU10 | Consulta del historial de un equipo | RF-12; RN-04 | Alta |
| HU11 | Consulta del detalle de una tarea | RF-13 | Media |
| HU12 | Supervisión de actividades por administrador | RF-14; RNF-02, RN-05 | Media |

**Trazabilidad que se completará durante el desarrollo:** `HU → RF/RNF/RN → criterio de aceptación → caso de prueba → resultado → commit`.

## 8. Escenarios generales de verificación

Se proponen escenarios integradores para comprobar la coherencia de los requisitos. Sus resultados no se han ejecutado ni reportado todavía.

| Escenario | Requisitos principales | Resultado que deberá comprobarse |
|---|---|---|
| E-01. Registro y acceso | RF-01 a RF-03 | Un técnico puede registrarse, iniciar sesión y cerrar sesión; credenciales inválidas son rechazadas. |
| E-02. Equipo y tarea | RF-04 a RF-08 | Un técnico registra un equipo, crea una tarea asociada, la consulta y actualiza su estado. |
| E-03. Documentación y evidencia | RF-09 a RF-11 | El registro técnico y la evidencia quedan asociados con la tarea correcta. |
| E-04. Historial y detalle | RF-12 y RF-13 | Se consulta el detalle de una tarea y el historial de intervenciones del equipo correspondiente. |
| E-05. Supervisión y permisos | RF-14; RNF-01, RNF-02 | El administrador consulta actividades conforme a sus permisos y se rechazan accesos no autorizados. |

Los casos detallados, datos de prueba y criterios de aprobación se definirán al refinar las HU y durante la etapa de Pruebas.

## 9. Cuestiones abiertas para el refinamiento

Antes de aprobar esta especificación, el equipo debe revisar especialmente:

1. **Identificación del usuario:** datos obligatorios para registro e inicio de sesión.
2. **Identificación del equipo:** campos requeridos y forma de tratar equipos con datos faltantes.
3. **Asignación y visibilidad:** quién crea, consulta y modifica tareas cuando existen varios técnicos.
4. **Finalización:** qué datos se exigirán para pasar una tarea al estado Completada.
5. **Evidencias:** formatos, tamaño máximo, cantidad permitida y si son obligatorias.
6. **Permisos del administrador:** solo consulta o alguna operación de gestión adicional.
7. **Historial:** orden de presentación y comportamiento ante edición o eliminación de registros.
8. **RNF medibles:** valores realistas de rendimiento y entorno de prueba.

Estas preguntas no impiden elaborar la especificación preliminar, pero las decisiones que afecten una historia deberán cerrarse antes de implementarla.

## 10. Aplicación de IA en la etapa de requerimientos

### 10.1. Entradas

- Documentos `01-pipeline.md` y `02-descubrimiento.md`.
- Propuesta y presentación de TechTrack.
- Lista existente de historias HU01–HU12.
- Aclaración del equipo: las necesidades de usuarios se basan **únicamente en hipótesis**, sin investigación directa con técnicos.

### 10.2. Actividades asistidas por IA

- Conversión del alcance preliminar en requisitos identificables.
- Separación entre requisitos funcionales, no funcionales y reglas de negocio.
- Relación de cada requisito con las historias existentes.
- Identificación de ambigüedades y decisiones que necesitan confirmación.
- Elaboración de escenarios generales de verificación.

### 10.3. Resultado generado

Borrador de `03-requerimientos.md`, sujeto a revisión del equipo. Los criterios de aceptación específicos de las HU se desarrollarán o contrastarán con sus registros existentes en el siguiente documento; no se atribuirán a los integrantes sin evidencia.

## 11. Validación humana (HITL)

La revisión será responsabilidad del equipo TechTrack: Erik Santiago Amarles Solarte, Carlos Castillo y Juan José Mafla.

### 11.1. Lista de verificación

- [ ] Cada requisito funcional corresponde al alcance aprobado del MVP.
- [ ] Las 12 historias de usuario existentes están cubiertas y correctamente relacionadas.
- [ ] No se incorporaron funcionalidades empresariales fuera de alcance.
- [ ] Los RNF son verificables y sus metas pendientes están identificadas.
- [ ] Las reglas de negocio están claras o marcadas para decisión.
- [ ] Los permisos y la información técnica están especificados suficientemente para iniciar el refinamiento.
- [ ] Las decisiones propuestas por IA se aceptaron, modificaron o rechazaron con justificación.

### 11.2. Registro HITL

| Campo | Registro |
|---|---|
| Etapa | 2. Requerimientos |
| Artefacto | `docs/03-requerimientos.md` |
| Asistencia de IA usada en este borrador | ChatGPT |
| Responsable de validación | Equipo TechTrack |
| Estado de validación | Pendiente |
| Decisión | Pendiente |
| Cambios y justificación | Registrar al realizar la revisión |
| Evidencias | `docs/evidencias-ia/etapas/02-requerimientos/` |

Las evidencias deberán conservar, en la medida en que existan registros originales, la instrucción utilizada, la respuesta de IA y las modificaciones humanas. No se documentarán como realizadas validaciones que aún no hayan ocurrido.

## 12. Resultado de la etapa y siguiente actividad

Este documento establece una **línea base preliminar de requisitos** de TechTrack que deberá ser revisada por el equipo antes de considerarse aprobada.

Su siguiente utilización será el refinamiento del Product Backlog en `04-product-backlog.md`, donde se detallarán las 12 historias de usuario, sus criterios de aceptación, prioridades, dependencias y la evidencia de la revisión HITL.

**Estado final de la etapa:** Pendiente de validación humana y aprobación del equipo.
