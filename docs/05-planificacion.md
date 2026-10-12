# Planificación, Release Plan y Sprints – TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa del pipeline:** 3. Planificación  
**Metodología:** Scrum aumentado con IA  
**Versión:** 1.3  
**Estado:** Planificación del MVP organizada en dos Sprints.

## 1. Objetivo

Organizar el desarrollo incremental del MVP de TechTrack mediante dos Sprints, distribuyendo las 12 historias de usuario de acuerdo con sus prioridades, dependencias y estimaciones de esfuerzo.

La planificación se desarrolla bajo el marco de trabajo Scrum aumentado con Inteligencia Artificial, incorporando mecanismos de validación humana (HITL) y trazabilidad de las actividades.

Este documento mantiene correspondencia con los requisitos y criterios de aceptación establecidos en `03-requerimientos.md` y `04-product-backlog.md`.

## 2. Línea base de planificación

El MVP de TechTrack se organizó en dos Sprints, cada uno conformado por seis historias de usuario.

| Sprint | Historias de usuario | Story Points | Objetivo |
|---|---|---:|---|
| Sprint 1 | HU01–HU06 | 19 SP | Implementar las funcionalidades fundamentales de acceso, registro de equipos y gestión de tareas técnicas. |
| Sprint 2 | HU07–HU12 | 28 SP | Implementar la documentación técnica, gestión de evidencias, consulta del historial y supervisión de actividades. |
| **Total** | **12 historias de usuario** | **47 SP** | Desarrollo del MVP de TechTrack. |

Los Story Points corresponden a las estimaciones de esfuerzo establecidas para la planificación. No equivalen directamente a horas de trabajo.

## 3. Equipo y responsabilidades

El equipo de desarrollo de TechTrack está conformado por tres integrantes.

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Erik Santiago Amarles Solarte | Scrum Master y QA | Coordinación de Scrum, seguimiento del trabajo, organización de actividades, pruebas funcionales y aseguramiento de calidad. |
| Carlos Castillo | Frontend y base de datos | Desarrollo de interfaces con React y TypeScript, formularios, navegación, integración visual y apoyo al diseño de la base de datos. |
| Juan José Mafla | Backend y despliegue | Desarrollo de la API con Node.js y TypeScript, lógica de negocio, integración con MongoDB y configuración del despliegue. |

Aunque existen responsabilidades principales, las historias de usuario pueden requerir colaboración entre los integrantes.

Las decisiones de implementación y aceptación de propuestas generadas por IA son responsabilidad del equipo.

## 4. Preparación del desarrollo — Sprint Cero

Antes de los dos Sprints de implementación se contempla una fase de preparación técnica y metodológica denominada Sprint Cero.

Esta fase comprende las siguientes actividades:

1. Definir el problema, los objetivos, los usuarios y el alcance de TechTrack.
2. Elaborar el pipeline de Ingeniería de Software Aumentada con IA.
3. Especificar los requisitos funcionales y no funcionales.
4. Definir las 12 historias de usuario y sus criterios de aceptación.
5. Organizar y priorizar el Product Backlog en Jira.
6. Seleccionar el stack tecnológico.
7. Preparar la estructura del repositorio.
8. Definir la arquitectura inicial de la aplicación.
9. Establecer las responsabilidades del equipo.
10. Definir mecanismos de versionamiento, pruebas y validación HITL.

### 4.1. Stack tecnológico

| Componente | Tecnología |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript |
| Base de datos | MongoDB |
| Gestión del proyecto | Jira |
| Control de versiones | Git y GitHub |
| Herramientas de IA | ChatGPT, Claude y otras herramientas registradas durante el desarrollo |

## 5. Release Plan del MVP

El Release Plan organiza las 12 historias de usuario en dos incrementos principales.

El objetivo es construir progresivamente el flujo de gestión y trazabilidad de actividades de soporte técnico.

### 5.1. Sprint 1 — Funcionalidades fundamentales

**Historias:** HU01–HU06  
**Estimación:** 19 Story Points

**Objetivo del Sprint:**

Desarrollar la base funcional de TechTrack, permitiendo el acceso de usuarios, el registro de equipos y la creación, consulta y actualización de tareas técnicas.

| ID | Historia de usuario | Funcionalidad |
|---|---|---|
| HU01 | Registro de usuarios | Permitir la creación de cuentas. |
| HU02 | Inicio de sesión | Permitir el acceso autenticado. |
| HU03 | Registro de equipos | Registrar equipos informáticos. |
| HU04 | Creación de tareas técnicas | Crear tareas asociadas a equipos. |
| HU05 | Consulta de tareas | Visualizar las tareas registradas. |
| HU06 | Gestión del estado de tareas | Actualizar el estado de una tarea. |

Al finalizar el Sprint, las funcionalidades deberán estar implementadas, integradas y validadas mediante sus respectivos criterios de aceptación.

### 5.2. Sprint 2 — Documentación y trazabilidad técnica

**Historias:** HU07–HU12  
**Estimación:** 28 Story Points

**Objetivo del Sprint:**

Completar el flujo principal de TechTrack incorporando diagnósticos, registro de intervenciones, evidencias, historial técnico y supervisión administrativa.

| ID | Historia de usuario | Funcionalidad |
|---|---|---|
| HU07 | Registro de problema y diagnóstico | Documentar el problema reportado y el diagnóstico técnico. |
| HU08 | Registro de actividades realizadas | Registrar las acciones ejecutadas durante una intervención. |
| HU09 | Adjuntar evidencias | Asociar fotografías o capturas a las tareas. |
| HU10 | Consulta del historial de un equipo | Visualizar intervenciones anteriores. |
| HU11 | Consulta del detalle de una tarea | Visualizar la información completa de una actividad. |
| HU12 | Supervisión de actividades por administrador | Consultar las actividades registradas por los técnicos. |

Al finalizar el Sprint, las funcionalidades deberán estar integradas con las del Sprint 1 y verificadas mediante sus criterios de aceptación, permitiendo realizar el flujo completo de una intervención técnica.

### 5.3. Resumen del Release Plan

| Elemento | Sprint 1 | Sprint 2 |
|---|---|---|
| Historias | HU01–HU06 | HU07–HU12 |
| Story Points | 19 | 28 |
| Enfoque | Funcionalidades fundamentales | Documentación y trazabilidad |
| Incremento | Gestión de usuarios, equipos y tareas | Gestión integral de intervenciones |
| Validación | Criterios HU01–HU06 | Criterios HU07–HU12 |

Los dos Sprints conforman la planificación del MVP de TechTrack.

## 6. Planificación y desarrollo de los Sprints

### 6.1. Sprint 1

**Objetivo:** Implementar las funcionalidades fundamentales del sistema.

**Historias seleccionadas:** HU01, HU02, HU03, HU04, HU05 y HU06.

**Estimación:** 19 Story Points.

**Actividades técnicas:**

- Implementación de formularios de registro e inicio de sesión.
- Desarrollo de la autenticación de usuarios.
- Implementación del registro de equipos.
- Desarrollo de formularios de creación de tareas.
- Implementación de la consulta de tareas.
- Desarrollo de los cambios de estado.
- Integración entre frontend, backend y base de datos.
- Elaboración de pruebas y documentación técnica.

### 6.2. Sprint 2

**Objetivo:** Implementar las funcionalidades de documentación, evidencia, historial y supervisión.

**Historias seleccionadas:** HU07, HU08, HU09, HU10, HU11 y HU12.

**Estimación:** 28 Story Points.

**Actividades técnicas:**

- Implementación del registro de problemas y diagnósticos.
- Desarrollo del registro de actividades realizadas.
- Implementación de la carga y consulta de evidencias.
- Desarrollo del historial técnico.
- Implementación de la consulta del detalle de tareas.
- Desarrollo de las funciones de supervisión administrativa.
- Integración con las funcionalidades del Sprint 1.
- Elaboración de pruebas y documentación técnica.

### 6.3. Validación y finalización de los Sprints

Para completar cada Sprint, se deberán validar las funcionalidades desarrolladas y verificar el cumplimiento de los criterios de aceptación de las historias de usuario correspondientes.

Las actividades de validación contemplan:

1. Comprobar el funcionamiento de cada historia de usuario.
2. Verificar su integración con los demás componentes del sistema.
3. Ejecutar las pruebas funcionales correspondientes.
4. Corregir los errores identificados.
5. Registrar las evidencias de funcionamiento.
6. Confirmar que las historias cumplan los criterios establecidos para considerarse completadas.

Las historias que no cumplan sus criterios de aceptación deberán mantenerse pendientes hasta realizar los ajustes necesarios.

## 7. Dependencias entre historias de usuario

La secuencia de implementación considera las siguientes dependencias funcionales.

### 7.1. Sprint 1

- **HU01 → HU02:** Registro de usuarios y autenticación.
- **HU03 → HU04:** Registro de equipos y asociación con tareas.
- **HU04 → HU05:** Creación y consulta de tareas.
- **HU04 → HU06:** Creación y actualización del estado de las tareas.

### 7.2. Sprint 2

- **HU04 → HU07:** Asociación de problemas y diagnósticos con tareas.
- **HU04 → HU08:** Registro de actividades realizadas.
- **HU04 → HU09:** Asociación de evidencias con tareas.
- **HU03 y HU04 → HU10:** Consulta de intervenciones relacionadas con equipos.
- **HU04, HU07, HU08 y HU09 → HU11:** Visualización de la información completa de una tarea.
- **HU02 y control de roles → HU12:** Acceso administrativo a las actividades.

Estas dependencias permiten organizar el trabajo y establecer una secuencia coherente de implementación.

## 8. Eventos Scrum

El desarrollo de TechTrack se organiza tomando como referencia los eventos establecidos por Scrum.

| Evento | Propósito | Evidencia |
|---|---|---|
| Sprint Planning | Definir el objetivo y las historias de cada Sprint. | Sprint Goal e historias seleccionadas. |
| Daily Scrum | Revisar avances e impedimentos. | Registro de seguimiento, cuando corresponda. |
| Product Backlog Refinement | Revisar criterios, prioridades y estimaciones. | Actualizaciones del Product Backlog. |
| Sprint Review | Revisar y demostrar los incrementos. | Demostración y verificación de criterios de aceptación. |
| Sprint Retrospective | Analizar el proceso y proponer mejoras. | Registro de lecciones aprendidas. |

## 9. Evidencias y validación HITL

La inteligencia artificial se utiliza como apoyo en la organización de historias, el análisis de dependencias y la planificación de actividades técnicas.

Las propuestas generadas se someten a revisión humana antes de ser incorporadas al proceso de desarrollo.

| Evidencia | Ubicación |
|---|---|
| Prompts y respuestas de IA utilizadas en planificación | `docs/evidencias-ia/etapas/03-planificacion/` |
| Registro de decisiones y modificaciones HITL | `docs/evidencias-ia/etapas/03-planificacion/validacion-hitl.md` |
| Historias y criterios de aceptación | Jira y `04-product-backlog.md` |
| Código fuente y versionamiento | GitHub |
| Evidencias de desarrollo y pruebas por historia | `docs/evidencias-ia/historias-usuario/HUxx/` |

Las evidencias deberán corresponder a actividades y validaciones efectivamente realizadas por el equipo.
