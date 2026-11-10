# Validación HITL — Arquitectura

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa:** 04. Arquitectura  
**Evidencias:** Presentación del MVP, decisiones del equipo, primera respuesta de Claude y auditoría técnica del repositorio.

## 1. Decisiones arquitectónicas del equipo

Antes de utilizar IA, el equipo definió las tecnologías y la organización general de TechTrack:

| Elemento | Decisión del equipo |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript |
| Base de datos | MongoDB |
| Repositorio y colaboración | GitHub |
| Organización | Separación en carpetas `front/` y `back/` |

Estas decisiones se establecieron previamente y se documentaron en la presentación del MVP.

Por tanto, **no se consideran propuestas generadas por IA ni decisiones aceptadas mediante HITL**.

## 2. Intervención de IA y revisión humana

Posteriormente, se consultó a Claude para solicitar una estructura inicial del proyecto utilizando las tecnologías previamente seleccionadas.

| Intervención de Claude | Validación |
|---|---|
| Retomó la separación entre frontend y backend solicitada por el equipo. | **Coincide con una decisión humana previa; no es una propuesta arquitectónica original de Claude.** |
| Sugirió organizar equipos, órdenes de servicio e historial como recursos diferenciados. | **Contraste con la implementación:** equipos y tareas tienen modelos diferenciados; el historial se consulta a partir de las tareas del equipo. No se ha establecido si esta organización fue adoptada directamente de la sugerencia de Claude. |
| Advirtió que no tenía acceso al adjunto con las historias de usuario. | **Limitación identificada.** La cobertura de requisitos se contrastó posteriormente con los criterios oficiales de Jira. |
| Propuso verificar el entorno de Node.js y npm antes de continuar. | El equipo confirmó que revisó y validó los pasos iniciales para generar la base del proyecto. |

La validación humana consistió en revisar las indicaciones iniciales de Claude y autorizar la continuación del trabajo, manteniendo las decisiones tecnológicas definidas por el equipo.

La auditoría del repositorio permitió contrastar la estructura implementada con las sugerencias iniciales, sin atribuir automáticamente su autoría a Claude.

## 3. Resultado de la validación

Se mantuvo la arquitectura general establecida por el equipo, con un frontend en React y TypeScript, un backend en Node.js y TypeScript, y MongoDB como base de datos.

Claude intervino como herramienta de apoyo para orientar la organización inicial y su implementación, **sin sustituir las decisiones arquitectónicas previas del equipo**.

La separación en carpetas `front/` y `back/`, así como los modelos de equipos y tareas, se comprobaron en el repositorio. El historial se obtiene mediante consultas a las tareas asociadas a cada equipo.

**Resultado HITL:** se conservaron las decisiones humanas iniciales y se validaron las indicaciones preliminares para avanzar con el proyecto. La aceptación o modificación de las sugerencias arquitectónicas adicionales de Claude permanece pendiente de contrastarse con la conversación completa de desarrollo.

Las evidencias de generación de código, correcciones y decisiones posteriores corresponden a la **etapa 05 — Desarrollo**.