# Pipeline de Ingeniería de Software Aumentada con IA

**Proyecto:** TechTrack – Gestor de Soporte Técnico
**Asignatura:** Proyecto Integrador II
**Universidad:** Universidad del Valle
**Metodología:** Scrum aumentado con Inteligencia Artificial
**Versión:** 1.0
**Estado:** Propuesta inicial, pendiente de validación por el equipo

## 1. Introducción

TechTrack es una aplicación web orientada a la gestión y trazabilidad de actividades de soporte y mantenimiento informático. Su propósito es centralizar el registro de equipos, la administración de tareas técnicas, los diagnósticos, las intervenciones realizadas, las evidencias y el historial de mantenimiento.

Para desarrollar el Producto Mínimo Viable (MVP) se utilizará un enfoque de Ingeniería de Software Aumentada con Inteligencia Artificial, integrando herramientas de IA como apoyo en diferentes etapas del ciclo de desarrollo de software.

Este documento establece el pipeline metodológico que seguirá el equipo, definiendo las actividades, el uso de IA, los entregables y los mecanismos de validación humana correspondientes a cada etapa.

## 2. Objetivo del pipeline

Establecer un proceso de desarrollo estructurado, iterativo y trazable, basado en Scrum y apoyado transversalmente por herramientas de inteligencia artificial, que permita construir y evaluar el MVP de TechTrack.

### Objetivos específicos

- Utilizar IA como apoyo en el análisis de requerimientos, planificación, arquitectura, desarrollo, pruebas, despliegue y documentación.
- Incorporar mecanismos de validación humana (Human-in-the-Loop, HITL) para revisar las propuestas generadas por IA.
- Mantener trazabilidad entre las historias de usuario, los criterios de aceptación, las pruebas y el código implementado.
- Documentar las interacciones significativas con herramientas de IA y las decisiones tomadas por el equipo.
- Evaluar los resultados del MVP y el aporte de la inteligencia artificial al proceso de desarrollo.

## 3. Alcance

El pipeline se aplicará al desarrollo del MVP de TechTrack, conformado inicialmente por 12 historias de usuario.

El producto contempla las siguientes capacidades principales:

- Registro y autenticación de usuarios.
- Registro de equipos informáticos.
- Creación y gestión de tareas técnicas.
- Registro de problemas y diagnósticos.
- Documentación de actividades realizadas.
- Asociación de evidencias a las tareas.
- Consulta del historial técnico de los equipos.
- Supervisión básica de actividades por parte del administrador.

El enfoque principal será emplear IA durante el proceso de ingeniería de software. No se establece como requisito que todas las funcionalidades internas de TechTrack utilicen inteligencia artificial.

## 4. Metodología de desarrollo

Se utilizará Scrum como marco de trabajo ágil, complementado con herramientas de IA durante las actividades de ingeniería.

El desarrollo se organizará mediante un Product Backlog, planificación de Sprints, Sprint Backlogs e incrementos funcionales del producto.

La IA actuará como herramienta de apoyo para proponer, analizar, generar y revisar artefactos. Las decisiones finales y la aceptación de los resultados serán responsabilidad del equipo.

El proceso general será:

**Entrada o especificación → Procesamiento con IA → Validación humana (HITL) → Artefacto aprobado → Siguiente actividad.**

El pipeline no se considera estrictamente lineal. Cuando se detecten errores o cambios en los requisitos, el equipo podrá regresar a etapas anteriores para actualizar los artefactos correspondientes.

## 5. Etapas del pipeline

Se establecen nueve etapas principales.

### 5.1. Descubrimiento

**Objetivo:** Comprender el problema, identificar los usuarios y delimitar el alcance del MVP.

**Entradas:**

- Idea inicial de TechTrack.
- Descripción del problema.
- Necesidades identificadas de los técnicos de soporte.

**Aplicación de IA:**

- Analizar el problema y sus posibles causas.
- Identificar actores y necesidades.
- Proponer funcionalidades iniciales.
- Detectar riesgos de alcance.

**Validación HITL:**

El equipo revisará las propuestas generadas, descartará funcionalidades fuera del alcance y aprobará la definición del producto.

**Entregables:**

- Descripción del problema.
- Objetivos del MVP.
- Identificación de actores.
- Alcance y exclusiones.
- Propuesta de valor.

### 5.2. Requerimientos

**Objetivo:** Especificar las funcionalidades y restricciones que debe cumplir TechTrack.

**Entradas:**

- Documentación de descubrimiento.
- Funcionalidades identificadas.
- Actores del sistema.

**Aplicación de IA:**

- Generar y refinar historias de usuario.
- Proponer criterios de aceptación.
- Identificar ambigüedades o requisitos faltantes.
- Analizar posibles dependencias.

**Validación HITL:**

El equipo verificará la coherencia de las historias, su relación con el problema y la posibilidad de comprobar sus criterios de aceptación.

**Entregables:**

- Requerimientos funcionales.
- Requerimientos no funcionales.
- Historias de usuario refinadas.
- Criterios de aceptación.
- Product Backlog.

### 5.3. Planificación

**Objetivo:** Organizar las historias de usuario para su desarrollo incremental.

**Entradas:**

- Product Backlog.
- Prioridades.
- Dependencias entre historias.
- Capacidad y disponibilidad del equipo.

**Aplicación de IA:**

- Apoyar la clasificación y priorización de historias.
- Proponer estimaciones de esfuerzo.
- Identificar dependencias.
- Proponer la organización de los Sprints.

**Validación HITL:**

El equipo revisará las estimaciones y determinará qué historias pueden desarrollarse según el tiempo y los recursos disponibles.

**Entregables:**

- Product Backlog priorizado.
- Release Plan.
- Sprint Backlog.
- Responsables de actividades.
- Estimaciones de esfuerzo.

### 5.4. Arquitectura

**Objetivo:** Definir la estructura técnica de la aplicación y las decisiones arquitectónicas necesarias.

**Entradas:**

- Requerimientos aprobados.
- Historias de usuario.
- Atributos de calidad.
- Restricciones tecnológicas.

**Aplicación de IA:**

- Proponer componentes y organización del sistema.
- Apoyar el diseño del modelo de datos.
- Proponer interfaces y endpoints de API.
- Identificar riesgos arquitectónicos.
- Comparar alternativas de implementación.

**Validación HITL:**

El equipo analizará las propuestas y comprobará su correspondencia con los requerimientos funcionales, no funcionales y las tecnologías seleccionadas.

**Entregables:**

- Arquitectura de la aplicación.
- Modelo de datos.
- Definición de componentes.
- Diseño de API.
- Decisiones arquitectónicas justificadas.

### 5.5. Desarrollo

**Objetivo:** Implementar las historias de usuario de acuerdo con la arquitectura y sus criterios de aceptación.

**Entradas:**

- Historias de usuario seleccionadas.
- Criterios de aceptación.
- Arquitectura aprobada.
- Sprint Backlog.

**Aplicación de IA:**

- Generar propuestas de código.
- Explicar soluciones técnicas.
- Apoyar la implementación de componentes.
- Identificar y corregir errores.
- Sugerir refactorizaciones.

**Validación HITL:**

El desarrollador responsable revisará, adaptará y probará el código antes de incorporarlo al repositorio.

**Entregables:**

- Código fuente estructurado.
- Componentes funcionales.
- Commits en GitHub.
- Incrementos del MVP.

### 5.6. Pruebas

**Objetivo:** Verificar el correcto funcionamiento del sistema y el cumplimiento de las historias de usuario.

**Entradas:**

- Código implementado.
- Criterios de aceptación.
- Requerimientos.
- Casos de uso.

**Aplicación de IA:**

- Proponer casos de prueba.
- Generar pruebas unitarias y de integración.
- Identificar escenarios límite.
- Apoyar el análisis de errores.
- Proponer correcciones.

**Validación HITL:**

El equipo ejecutará y verificará las pruebas, documentará los resultados y corregirá los defectos identificados.

**Entregables:**

- Casos de prueba.
- Pruebas implementadas.
- Resultados de ejecución.
- Registro de defectos y correcciones.
- Evidencias de funcionamiento.

### 5.7. Integración y despliegue (CI/CD)

**Objetivo:** Integrar los componentes del sistema y facilitar su ejecución y despliegue.

**Entradas:**

- Código aprobado.
- Configuración del proyecto.
- Dependencias.
- Requisitos del entorno de ejecución.

**Aplicación de IA:**

- Proponer configuraciones de integración continua.
- Apoyar la creación de flujos automatizados.
- Identificar problemas de compilación o despliegue.
- Proponer correcciones de configuración.

**Validación HITL:**

El equipo verificará los resultados de compilación, pruebas y despliegue antes de dar por aprobada la versión.

**Entregables:**

- Configuración de integración y despliegue.
- Aplicación ejecutable.
- Evidencia de despliegue.
- Registro de problemas y soluciones.

### 5.8. Documentación

**Objetivo:** Mantener actualizada la documentación técnica, funcional y metodológica del proyecto.

**Entradas:**

- Código aprobado.
- Arquitectura.
- Requerimientos.
- Resultados de pruebas.
- Decisiones técnicas.

**Aplicación de IA:**

- Generar borradores de documentación.
- Apoyar la elaboración del README.
- Documentar funciones principales y APIs.
- Proponer instrucciones de instalación.
- Elaborar borradores del manual de usuario.

**Validación HITL:**

El equipo comprobará que la documentación represente fielmente el funcionamiento real del sistema.

**Entregables:**

- README actualizado.
- Documentación técnica.
- Manual básico de usuario.
- Documentación de arquitectura y API.
- Registro de decisiones y cambios.

Esta etapa será transversal: los documentos se actualizarán a medida que se produzcan modificaciones en el sistema.

### 5.9. Evaluación

**Objetivo:** Analizar el cumplimiento de los objetivos del MVP y evaluar los resultados del proceso aumentado con IA.

**Entradas:**

- MVP implementado.
- Historias de usuario.
- Resultados de pruebas.
- Evidencias de uso de IA.
- Observaciones del equipo.

**Aplicación de IA:**

- Apoyar el análisis de los resultados.
- Identificar oportunidades de mejora.
- Organizar las lecciones aprendidas.
- Proponer mejoras para futuras iteraciones.

**Validación HITL:**

El equipo verificará las conclusiones y determinará las mejoras que resulten pertinentes.

**Entregables:**

- Evaluación del MVP.
- Análisis del aporte de IA.
- Métricas del proceso.
- Lecciones aprendidas.
- Mejoras propuestas.

## 6. Human-in-the-Loop (HITL)

La validación humana constituye un mecanismo de control transversal a todas las etapas del pipeline.

La IA no podrá considerarse responsable final de una decisión de ingeniería.

Cada actividad significativa asistida por IA seguirá el siguiente procedimiento:

1. Un integrante proporciona una especificación o prompt.
2. La herramienta de IA genera una propuesta.
3. El responsable revisa la propuesta frente a los requisitos establecidos.
4. La propuesta se acepta, modifica o rechaza.
5. Se documenta la decisión y su justificación.
6. El artefacto aprobado se incorpora al proceso de desarrollo.

Para cada validación se registrará, cuando corresponda:

| Campo         | Descripción                                  |
| ------------- | -------------------------------------------- |
| Identificador | Etapa, tarea o historia de usuario           |
| Responsable   | Integrante que realiza la validación         |
| Resultado     | Aceptado, modificado o rechazado             |
| Criterio      | Condiciones utilizadas para revisar          |
| Justificación | Motivo de la decisión                        |
| Evidencia     | Artefacto, prueba o registro correspondiente |

## 7. Herramientas tecnológicas

El proyecto utilizará el siguiente stack tecnológico, definido previamente por el equipo:

| Componente       | Tecnología                                  |
| ---------------- | ------------------------------------------- |
| Frontend         | React + TypeScript                          |
| Backend          | Node.js + TypeScript                        |
| Base de datos    | MongoDB                                     |
| Versionamiento   | Git + GitHub                                |
| Gestión ágil     | Jira                                        |
| Asistencia de IA | ChatGPT y otras herramientas por determinar |

Las herramientas de IA adicionales deberán registrarse cuando sean seleccionadas e incorporadas al proceso.

El uso de estas herramientas no sustituye la revisión del código, las pruebas ni las decisiones del equipo.

## 8. Roles y responsabilidades

La distribución inicial de responsabilidades es la siguiente:

| Integrante                    | Rol principal            | Responsabilidad                                    |
| ----------------------------- | ------------------------ | -------------------------------------------------- |
| Erik Santiago Amarles Solarte | Scrum Master y QA        | Coordinación, seguimiento, pruebas y calidad       |
| Carlos Castillo               | Frontend y base de datos | Interfaces, interacción y apoyo al diseño de datos |
| Juan José Mafla               | Backend y despliegue     | API, lógica del servidor, integración y despliegue |

Todos los integrantes participarán en la validación de las propuestas de IA correspondientes a las actividades bajo su responsabilidad.

## 9. Trazabilidad y registro de evidencias

El proyecto conservará evidencia del uso de IA durante el desarrollo.

Por cada historia de usuario se documentarán los siguientes elementos:

1. **Entrada o especificación:** prompt e información proporcionada a la IA.
2. **Respuesta de la IA:** propuesta generada, conservando su versión original.
3. **Validación HITL:** revisión, correcciones, decisiones y justificación.
4. **Código y pruebas:** implementación final y pruebas relacionadas.
5. **Control de riesgos:** errores, alucinaciones, fallos lógicos o problemas identificados.
6. **Evidencia de operación:** resultados que demuestren el cumplimiento de la historia.

Los registros se almacenarán en `docs/evidencias-ia/`, organizados por historia de usuario.

Se buscará mantener la siguiente trazabilidad:

**Historia de usuario → Criterio de aceptación → Prueba → Commit**

Además, los artefactos relevantes del desarrollo se versionarán en el repositorio.

## 10. Métricas y evaluación del uso de IA

Para analizar la participación de las herramientas de IA se propone registrar:

### 10.1. Tasa de aceptación de salidas de IA

**Tasa de aceptación = (Salidas aceptadas / Total de salidas evaluadas) × 100**

Se considerará aceptada una salida utilizada sin modificaciones sustanciales. Las salidas modificadas o rechazadas se registrarán por separado.

### 10.2. Modificaciones y rechazos

Se contabilizarán las propuestas de IA que requirieron ajustes y aquellas que fueron descartadas, junto con sus principales causas.

### 10.3. Cumplimiento de historias de usuario

Se verificará qué historias cumplen sus criterios de aceptación y cuentan con evidencia funcional.

### 10.4. Defectos detectados

Se registrarán los problemas encontrados durante la implementación y las pruebas, incluidos los relacionados con contenido generado por IA.

### 10.5. Lecciones aprendidas

Se documentarán las actividades en las que la IA resultó útil, sus limitaciones y las decisiones humanas que mejoraron los resultados.

## 11. Seguridad y uso responsable de IA

Durante el desarrollo se aplicarán las siguientes consideraciones:

- No proporcionar contraseñas, credenciales ni información sensible a las herramientas de IA.
- Tratar las respuestas de IA como propuestas que requieren verificación.
- Revisar el código generado antes de utilizarlo.
- Validar las entradas y salidas del sistema.
- Mantener secretos y variables sensibles fuera del repositorio.
- Revisar los riesgos de seguridad relacionados con las dependencias, la autenticación y el tratamiento de datos.
- Registrar los fallos relevantes detectados en las propuestas de IA.

Cuando el sistema incorpore componentes basados en LLM, se deberán considerar también los controles de seguridad para prompts, entradas externas y respuestas del modelo.

## 12. Gestión de cambios y mejora continua

Los artefactos aprobados se mantendrán versionados.

Cuando cambie un requerimiento o una decisión arquitectónica, el equipo analizará qué historias, componentes, pruebas y documentos se ven afectados.

Las modificaciones deberán actualizarse en los artefactos correspondientes para conservar la coherencia del proyecto.

El pipeline podrá ajustarse durante el desarrollo, siempre que los cambios sean documentados y aprobados por el equipo.

## 13. Resultado esperado

La aplicación de este pipeline deberá permitir obtener un MVP funcional de TechTrack, desarrollado mediante Scrum y con apoyo transversal de herramientas de inteligencia artificial.

Además del producto implementado, el proyecto deberá conservar evidencia verificable de los requisitos, las decisiones de ingeniería, la intervención de la IA, las validaciones humanas, el código, las pruebas y los resultados de evaluación.

El principio fundamental del proceso será:

**La IA propone y asiste; el equipo analiza, decide, implementa y valida.**

