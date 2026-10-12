# Descubrimiento del Proyecto – TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico
**Asignatura:** Proyecto Integrador II
**Universidad:** Universidad del Valle
**Metodología:** Scrum aumentado con Inteligencia Artificial
**Etapa del pipeline:** 1. Descubrimiento
**Versión:** 1.0
**Estado:** Propuesta inicial, pendiente de validación por el equipo

## 1. Introducción

TechTrack es una aplicación web orientada a la gestión y trazabilidad de actividades de soporte y mantenimiento informático.

La iniciativa surge de identificar una problemática en la organización de los trabajos técnicos: la información relacionada con los equipos, las tareas pendientes, los diagnósticos, las intervenciones realizadas y sus evidencias puede encontrarse dispersa en diferentes medios, como notas personales, conversaciones, fotografías y archivos.

Esta situación dificulta el seguimiento de las actividades y la consulta del historial de mantenimiento de los equipos.

Como respuesta, se propone desarrollar un Producto Mínimo Viable (MVP) que centralice la información relacionada con las intervenciones técnicas, desde el registro de una tarea hasta su finalización y posterior consulta.

El proyecto se desarrollará utilizando Scrum e Ingeniería de Software Aumentada con Inteligencia Artificial, incorporando herramientas de IA como apoyo durante las diferentes etapas del proceso, con validación humana (HITL).

Este documento corresponde a la fase de descubrimiento y establece el contexto, el problema, los objetivos, los actores, la propuesta de valor, el alcance y los riesgos iniciales del producto.

## 2. Identificación del problema

### 2.1. Contexto

Los técnicos de soporte informático realizan actividades como:

- Diagnóstico de fallas en computadores.
- Mantenimiento preventivo y correctivo.
- Instalación y configuración de software.
- Sustitución de componentes de hardware.
- Solución de problemas técnicos.
- Registro de procedimientos y resultados.

Estas actividades requieren organizar los trabajos pendientes, conocer el estado de cada intervención y conservar información sobre las acciones realizadas.

Sin embargo, cuando dicha información se administra mediante herramientas independientes o registros informales, pueden presentarse problemas de organización y trazabilidad.

### 2.2. Problemáticas identificadas

A partir de la propuesta inicial del proyecto se identificaron las siguientes dificultades:

**Información dispersa:** Los datos de las intervenciones pueden encontrarse en notas, mensajes, documentos, fotografías o diferentes aplicaciones.

**Falta de seguimiento:** Puede resultar difícil identificar cuáles actividades están pendientes, cuáles se encuentran en ejecución y cuáles han finalizado.

**Poca trazabilidad:** No siempre existe un registro centralizado que relacione una intervención con el equipo atendido.

**Evidencias desorganizadas:** Las fotografías y capturas de pantalla pueden almacenarse independientemente de los trabajos realizados.

**Dificultad para consultar antecedentes:** Cuando se necesita intervenir nuevamente un equipo, puede ser complicado recuperar sus diagnósticos y mantenimientos anteriores.

**Dificultad para demostrar el trabajo realizado:** La ausencia de registros organizados limita la posibilidad de consultar las actividades efectuadas por un técnico.

Estas situaciones constituyen las hipótesis iniciales del problema y deberán contrastarse con usuarios representativos durante la validación del producto.

### 2.3. Problema central

Los técnicos de soporte y mantenimiento informático necesitan una herramienta que les permita gestionar, documentar y consultar de manera centralizada las actividades realizadas sobre los equipos, conservando información sobre su estado, diagnóstico, intervención, resultados y evidencias.

### 2.4. Consecuencias del problema

Entre las posibles consecuencias se encuentran:

- Pérdida de información relevante.
- Duplicación de registros o actividades.
- Dificultad para realizar seguimiento a trabajos pendientes.
- Mayor esfuerzo para recuperar antecedentes técnicos.
- Falta de evidencia organizada de las intervenciones.
- Dependencia de la memoria o los registros personales del técnico.

## 3. Justificación del proyecto

La gestión organizada de las actividades de soporte informático permite conservar información útil para el seguimiento de las intervenciones y el mantenimiento de los equipos.

TechTrack propone centralizar esta información en una aplicación web, facilitando que el técnico pueda consultar sus tareas y documentar los trabajos realizados.

El valor de la solución no consiste únicamente en permitir crear tareas, sino en asociar cada intervención con información técnica específica.

De esta manera, una tarea podrá relacionarse con:

- El equipo intervenido.
- El problema reportado.
- El diagnóstico realizado.
- Las actividades ejecutadas.
- El resultado de la intervención.
- Las evidencias correspondientes.
- El historial técnico del equipo.

El proyecto también representa una oportunidad académica para aplicar conocimientos de ingeniería de software, desarrollo web, bases de datos, metodologías ágiles e inteligencia artificial dentro de un proceso de desarrollo estructurado y verificable.

## 4. Objetivos del MVP

### 4.1. Objetivo general

Desarrollar un Producto Mínimo Viable de una aplicación web que permita a técnicos de soporte informático gestionar y documentar las actividades de mantenimiento realizadas sobre equipos, centralizando las tareas, diagnósticos, intervenciones, evidencias e historial técnico.

### 4.2. Objetivos específicos

1. Implementar un mecanismo básico de registro y autenticación de usuarios.

2. Permitir el registro de equipos informáticos para asociarlos con actividades de soporte y mantenimiento.

3. Facilitar la creación, consulta y actualización del estado de las tareas técnicas.

4. Permitir el registro de problemas reportados, diagnósticos, actividades realizadas y resultados obtenidos.

5. Incorporar la posibilidad de adjuntar evidencias visuales a las intervenciones.

6. Facilitar la consulta del historial de actividades realizadas sobre cada equipo.

7. Proporcionar funciones básicas de consulta y supervisión para el administrador.

8. Aplicar un proceso de desarrollo basado en Scrum, aumentado con IA y validación humana, conservando evidencias de las decisiones de ingeniería.

## 5. Identificación de usuarios y actores

### 5.1. Usuario principal: Técnico de soporte informático

Es la persona encargada de realizar actividades de soporte y mantenimiento de computadores.

Se consideran usuarios potenciales:

- Técnicos independientes.
- Técnicos de pequeñas empresas.
- Personal de departamentos de soporte informático.
- Estudiantes o practicantes que realizan labores de mantenimiento.

**Necesidades identificadas:**

- Registrar los equipos que atiende.
- Organizar sus actividades pendientes.
- Consultar el estado de los trabajos.
- Registrar diagnósticos y procedimientos.
- Adjuntar evidencias.
- Consultar mantenimientos anteriores.

**Objetivo del usuario:**

Administrar sus actividades técnicas y conservar información organizada de los trabajos realizados.

### 5.2. Usuario secundario: Administrador o supervisor

Es la persona encargada de consultar las actividades registradas por los técnicos y realizar una supervisión básica.

**Necesidades identificadas:**

- Consultar las actividades de los técnicos.
- Revisar los estados de los trabajos.
- Acceder a los registros de intervenciones realizadas.

Para el MVP no se contempla un módulo avanzado de administración empresarial.

### 5.3. Actores del sistema

| Actor             | Responsabilidad                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Técnico           | Registrar equipos, administrar tareas y documentar intervenciones.                           |
| Administrador     | Consultar y supervisar actividades registradas.                                              |
| Sistema TechTrack | Almacenar y relacionar información de equipos, tareas, diagnósticos, evidencias e historial. |

La inteligencia artificial se utilizará principalmente como herramienta de apoyo durante el proceso de desarrollo del software, por lo que no se define inicialmente como un actor funcional del MVP.

## 6. Propuesta de valor

TechTrack busca proporcionar a los técnicos de soporte informático una herramienta centralizada que permita organizar los trabajos pendientes, documentar las intervenciones realizadas y consultar posteriormente el historial técnico de los equipos.

### 6.1. Diferenciación frente a un gestor de tareas convencional

Un gestor de tareas convencional permite registrar actividades y controlar su estado.

TechTrack, además de estas funciones, busca conservar la información técnica asociada a cada intervención.

Su propuesta de valor se fundamenta en la relación:

**Tarea + Equipo + Diagnóstico + Intervención + Evidencia + Historial**

Esta relación permite conocer no solamente si un trabajo fue completado, sino también sobre qué equipo se realizó, cuál era el problema, qué procedimiento se ejecutó y qué resultado se obtuvo.

### 6.2. Propuesta de valor resumida

**Permitir que el técnico sepa qué tiene que hacer, qué está haciendo, qué hizo y qué evidencia dejó, desde un mismo lugar.**

## 7. Alcance del MVP

El MVP se enfocará en implementar las funcionalidades mínimas necesarias para demostrar el flujo principal de gestión y trazabilidad de las intervenciones técnicas.

### 7.1. Funcionalidades incluidas

**Gestión de usuarios**

- Registro de usuarios.
- Inicio y cierre de sesión.
- Acceso básico según el rol.

**Gestión de equipos**

- Registro de equipos informáticos.
- Identificación de equipos.
- Consulta de información básica.

**Gestión de tareas**

- Creación de tareas técnicas.
- Consulta de tareas registradas.
- Visualización del detalle de una tarea.
- Actualización del estado de las tareas.

Estados propuestos:

**Pendiente → En progreso → Completada**

**Documentación técnica**

- Registro del problema reportado.
- Registro del diagnóstico.
- Descripción de actividades realizadas.
- Registro del resultado de la intervención.

**Gestión de evidencias**

- Asociación de fotografías o capturas de pantalla con una tarea.
- Consulta de las evidencias relacionadas.

**Historial técnico**

- Consulta de las actividades realizadas sobre un equipo.
- Acceso a los registros asociados a intervenciones anteriores.

**Supervisión básica**

- Consulta de actividades registradas por parte del administrador.

Estas capacidades corresponden al alcance preliminar planteado en las 12 historias de usuario de TechTrack.

### 7.2. Funcionalidades excluidas

Para mantener un alcance viable, inicialmente no se contemplan:

- Aplicación móvil nativa.
- Sistema empresarial avanzado de tickets y SLA.
- Inventario empresarial completo.
- Facturación.
- Integración con WhatsApp.
- Integración con servicios de correo electrónico.
- Notificaciones avanzadas por SMS o aplicaciones externas.
- Chat interno entre técnicos.
- Paneles empresariales avanzados.
- Diagnóstico automático de fallas mediante IA.
- Predicción de fallas.
- Ejecución remota de comandos sobre los equipos.
- Arquitectura multiempresa.

Estas funcionalidades podrán analizarse como oportunidades de evolución del producto.

### 7.3. Delimitación

El MVP se implementará como una aplicación web adaptable a diferentes tamaños de pantalla.

Su propósito será demostrar el flujo de gestión y documentación técnica, sin intentar reemplazar inicialmente plataformas empresariales completas de soporte informático.

## 8. Flujo principal de funcionamiento

El escenario principal representa la atención y documentación de una actividad de soporte sobre un computador.

### Paso 1. Acceso

El técnico accede a TechTrack mediante su cuenta.

### Paso 2. Registro o selección del equipo

El técnico registra un nuevo equipo o selecciona uno existente.

### Paso 3. Creación de la tarea

El técnico registra una actividad de soporte asociada al equipo, indicando el trabajo que debe realizar.

### Paso 4. Gestión del estado

La tarea inicia en estado pendiente y puede actualizarse a medida que se desarrolla la intervención.

### Paso 5. Diagnóstico

El técnico registra el problema reportado y el diagnóstico correspondiente.

### Paso 6. Documentación de la intervención

El técnico describe las actividades ejecutadas y el resultado obtenido.

### Paso 7. Registro de evidencias

El técnico adjunta fotografías o capturas que permitan documentar la intervención.

### Paso 8. Finalización

El técnico marca la tarea como completada una vez que ha terminado el trabajo.

### Paso 9. Consulta del historial

Posteriormente, el técnico puede consultar las intervenciones asociadas al equipo.

**Flujo resumido:**

Acceso → Equipo → Tarea → Gestión → Diagnóstico → Intervención → Evidencia → Finalización → Historial

### 8.1. Ejemplo de uso

**Escenario:** Sustitución de una unidad de almacenamiento.

Un técnico recibe un computador que presenta problemas relacionados con su unidad de almacenamiento.

1. Accede a TechTrack.
2. Registra o selecciona el computador.
3. Crea una tarea de revisión del almacenamiento.
4. Registra el problema reportado.
5. Documenta el diagnóstico.
6. Registra el procedimiento realizado para sustituir la unidad.
7. Adjunta una fotografía o captura como evidencia.
8. Marca la tarea como completada.
9. El trabajo queda asociado al historial del equipo.

Este escenario permite ilustrar el funcionamiento del producto sin requerir funcionalidades empresariales adicionales.

## 9. Riesgos y consideraciones iniciales

### 9.1. Crecimiento excesivo del alcance

**Riesgo:** Incorporar funciones adicionales que dificulten finalizar el MVP.

**Mitigación propuesta:** Priorizar el flujo principal de soporte y mantener separadas las funcionalidades de versiones posteriores.

### 9.2. Convertirse en un gestor de tareas genérico

**Riesgo:** Concentrar el desarrollo en la creación y actualización de tareas, dejando de lado la documentación técnica.

**Mitigación propuesta:** Mantener como eje funcional la relación entre tarea, equipo, diagnóstico, intervención, evidencia e historial.

### 9.3. Complejidad de almacenamiento de evidencias

**Riesgo:** Implementar una gestión de archivos demasiado amplia para el alcance disponible.

**Mitigación propuesta:** Limitar inicialmente las evidencias a formatos de imagen permitidos y definir posteriormente límites de tamaño y almacenamiento.

### 9.4. Problemas de seguridad y acceso

**Riesgo:** Exponer datos de usuarios, equipos o intervenciones por controles insuficientes.

**Mitigación propuesta:** Incorporar autenticación, autorización por rol, validación de datos y controles básicos de acceso desde el diseño.

### 9.5. Dependencia excesiva de IA

**Riesgo:** Aceptar propuestas generadas por IA sin revisar su calidad o compatibilidad con las necesidades del proyecto.

**Mitigación propuesta:** Aplicar validación HITL y conservar evidencia de las modificaciones realizadas.

### 9.6. Necesidades de usuarios no verificadas

**Riesgo:** Desarrollar funcionalidades basadas exclusivamente en suposiciones del equipo sin comprobar su utilidad práctica.

**Mitigación propuesta:** Validar el flujo principal con al menos un usuario representativo y recoger observaciones antes de dar por comprobada la propuesta de valor.

## 10. Indicadores iniciales de éxito

Para evaluar posteriormente el MVP se proponen los siguientes indicadores.

| Indicador                  | Forma de verificación                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Flujo funcional completo   | Ejecutar una intervención desde la creación de la tarea hasta su consulta en el historial.  |
| Trazabilidad               | Comprobar que cada intervención de prueba esté asociada a su equipo correspondiente.        |
| Registro de evidencias     | Verificar que las imágenes permitidas puedan adjuntarse y consultarse en la tarea correcta. |
| Cumplimiento de requisitos | Ejecutar pruebas asociadas a los criterios de aceptación de las historias de usuario.       |
| Utilidad para el técnico   | Obtener retroalimentación de usuarios representativos sobre el flujo de trabajo.            |

Estos indicadores son preliminares. Las metas cuantitativas deberán establecerse y aprobarse antes de la evaluación del MVP. No se reportan resultados de pruebas de usuario en esta etapa.

## 11. Aplicación de inteligencia artificial en el descubrimiento

De acuerdo con el pipeline del proyecto, la IA se utiliza como herramienta de apoyo para analizar el problema, organizar la información y proponer mejoras a la definición del MVP.

### 11.1. Entradas utilizadas

Se toman como referencia los siguientes materiales del proyecto:

- Propuesta inicial del gestor de actividades y documentación para técnicos de soporte informático.
- Presentación del MVP – Gestor de Soporte Técnico.
- Descripción y objetivo de TechTrack.
- Pipeline de Ingeniería de Software Aumentada con IA (`01-pipeline.md`).

### 11.2. Actividades asistidas por IA

- Organización y estructuración del problema.
- Identificación de necesidades de los usuarios.
- Formulación de objetivos.
- Delimitación del alcance.
- Identificación de riesgos.
- Propuesta de indicadores iniciales.
- Elaboración de la documentación de descubrimiento.

### 11.3. Resultado generado por IA

La salida corresponde a la propuesta de documento `02-descubrimiento.md`, que organiza la información disponible y plantea consideraciones adicionales para su revisión.

Esta versión constituye un borrador y no representa una validación automática de las necesidades de los usuarios.

## 12. Validación humana (HITL)

La validación humana tendrá como propósito comprobar que la definición del producto representa la intención del equipo y mantiene un alcance realizable.

### 12.1. Responsables

La revisión será realizada por los integrantes del equipo TechTrack:

- Erik Santiago Amarles Solarte.
- Carlos Castillo.
- Juan José Mafla.

### 12.2. Criterios de validación

Se revisarán las siguientes condiciones:

- El problema está expresado claramente.
- Los usuarios identificados corresponden al público objetivo.
- Los objetivos están relacionados con el problema.
- La propuesta de valor diferencia a TechTrack de un gestor de tareas convencional.
- El alcance es coherente con las 12 historias de usuario preliminares.
- Las funcionalidades excluidas no impiden demostrar el flujo principal.
- Los riesgos identificados son pertinentes.
- Los indicadores propuestos permiten evaluar el funcionamiento del MVP.

### 12.3. Registro de validación

| Campo                     | Registro                                |
| ------------------------- | --------------------------------------- |
| Etapa                     | Descubrimiento                          |
| Artefacto                 | `02-descubrimiento.md`                  |
| Herramienta de IA         | ChatGpt - Claude                        |
| Resultado de IA           | Borrador estructurado de descubrimiento |
| Responsable de validación | Equipo TechTrack                        |
| Estado HITL               | Pendiente de revisión                   |
| Decisión                  | Pendiente                               |
| Justificación y cambios   | Registrar después de la revisión        |

### 12.4. Aspectos pendientes de confirmación

Antes de aprobar este documento, el equipo deberá confirmar:

1. Que los usuarios y necesidades identificadas corresponden con el contexto real que se desea atender.
2. Que las funcionalidades incluidas y excluidas mantienen el alcance previsto.
3. Que el administrador conservará únicamente funciones básicas de supervisión en el MVP.
4. Que el flujo principal representa correctamente el proceso de soporte técnico.
5. Que los indicadores propuestos son adecuados para la demostración y evaluación del producto.

Las observaciones y modificaciones deberán registrarse como evidencia de HITL, junto con la versión finalmente aprobada.

## 13. Conclusión del descubrimiento

La etapa de descubrimiento permite establecer el problema que TechTrack pretende resolver, identificar sus principales usuarios y delimitar las capacidades previstas para el MVP.

El producto se centrará en la gestión de tareas asociadas a equipos informáticos, incorporando el registro de diagnósticos, intervenciones, evidencias e historial técnico.

Su principal característica diferenciadora será la trazabilidad de las actividades de soporte, más allá del control convencional de tareas pendientes y completadas.

La definición aquí presentada servirá como entrada para la siguiente etapa del pipeline: **Requerimientos**, donde se formalizarán los requisitos funcionales y no funcionales y se revisarán las historias de usuario y sus criterios de aceptación.

**Estado final de la etapa:** Pendiente de validación humana y aprobación del equipo.
