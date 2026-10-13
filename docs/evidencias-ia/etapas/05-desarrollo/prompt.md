# Prompt — Desarrollo de TechTrack

**Etapa:** 05 — Desarrollo  
**Herramienta:** Claude  
**Interacción:** solicitud inicial de implementación

## 1. Contexto proporcionado antes de programar

Antes de solicitar la implementación, el equipo compartió con la IA el contexto académico de Proyecto Integrador II: desarrollo de un MVP mediante Scrum, uso transversal de inteligencia artificial en el pipeline de ingeniería de software, documentación de evidencias y revisión humana (HITL). También explicó la idea y el alcance de TechTrack.

El archivo `fuentes/contexto-previo-claude.md` sintetiza ese contexto. **No constituye una transcripción literal** del mensaje anterior ni una segunda solicitud de generación de código.

## 2. Prompt original de implementación (transcripción íntegra)

El siguiente es el **único prompt inicial de implementación** proporcionado por el equipo. Se reproduce sin corregir su redacción. La copia original también está en `fuentes/primer-prompt-claude.txt`.

```text
Quiero que tomes el rol de un desarrolador web con experiencia de 10 años en el sector y me ayudes a generar la estructura de mi proyeco con las siguientes tecnologias usaremos en el front typescript, react , en el backend node js con typescript , para la base de datos usaremos mongo DB, alguna sugerencia para esta estrucutra me la podrias comentar, crea dos carpetas una de front y otra de back , en base la descripcion y objetivo de mi proyecto que es esta:   > “Nuestro proyecto se llama TechTrack y consiste en una aplicación web para la gestión y trazabilidad de actividades de soporte y mantenimiento informático.
>
> La problemática que identificamos es que los técnicos normalmente manejan información de sus trabajos en diferentes lugares, como notas, fotografías, mensajes o archivos. Esto hace difícil saber qué tareas están pendientes, qué se hizo sobre un equipo anteriormente y qué evidencias existen de una intervención.
>
> Por eso nuestra propuesta es centralizar todo este proceso en una sola aplicación. El técnico podrá registrar un equipo, crear una tarea, indicar el problema reportado, registrar su diagnóstico, documentar las actividades realizadas, adjuntar evidencias y finalmente completar la tarea. Toda esta información quedará asociada al equipo y podrá consultarse posteriormente mediante un historial técnico.
>
> Nuestro usuario principal es el técnico de soporte y mantenimiento informático, aunque también tendremos un administrador o supervisor que podrá consultar las actividades realizadas.
>
> Las principales funciones serán la gestión de usuarios, registro de equipos, gestión de tareas, documentación técnica, carga de evidencias y consulta del historial.
>
> La diferencia frente a un gestor de tareas tradicional es que nosotros no solamente queremos saber si una tarea está pendiente o completada, sino conservar la trazabilidad completa de la intervención: qué equipo fue atendido, cuál era el problema, qué diagnóstico se realizó, qué actividades se hicieron, cuál fue el resultado y qué evidencia quedó.
>
> Finalmente, utilizaremos inteligencia artificial como apoyo durante el proceso de ingeniería de software, por ejemplo para requerimientos, desarrollo, pruebas y documentación, manteniendo siempre la revisión y decisión final por parte del equipo.
>
> *En resumen, buscamos que el técnico pueda saber qué tiene que hacer, qué está haciendo, qué hizo y qué evidencia dejó, todo desde un mismo lugar.”y en base a estas HU que genere con estos criterios de aceptacion crea el proyecto #attachment:Pasted text #1 . Usa una peleta de colores amigable y que de ese aire de web de mantenimiento y gestion de tareas , usa la teoria del color para esto, estructura bien todo usando clean code y trata de documentar las fucniones principales , tambien puedes usar glassmorfismo para darle un toque diferente al estilo
```

## 3. Observaciones sobre la entrada

- **Tecnologías:** React y TypeScript para frontend, Node.js y TypeScript para backend y MongoDB fueron seleccionados previamente por el equipo. Claude recibió esas decisiones como restricciones.
- **Organización:** la división en `front/` y `back/` fue solicitada expresamente por el equipo.
- **Historias de usuario:** el prompt hacía referencia al adjunto `#attachment:Pasted text #1`. Claude informó inicialmente que no podía acceder a ese adjunto. No se afirma que hubiera verificado los 59 criterios vigentes de Jira al producir la primera versión.
- **Alcance de la evidencia:** una instrucción general pudo producir funcionalidades para varias HU; no se atribuye un prompt independiente a cada historia de usuario.

## 4. Correcciones posteriores

Las futuras solicitudes de corrección derivadas de la etapa 06 se documentarán como nuevas interacciones en `correcciones/` cuando se realicen, vinculando prompt, respuesta, cambios de código, pruebas de regresión y revisión HITL. No forman parte de esta solicitud original.
