# 07. Despliegue — TechTrack MVP2

## 1. Infraestructura utilizada

El MVP2 reutiliza la infraestructura del MVP1: **Vercel** para el despliegue de la aplicación web y su API, y **MongoDB Atlas** para la persistencia de datos. Se conserva la arquitectura existente, basada en React, TypeScript y Vite para el frontend, y Node.js, Express y TypeScript para el backend.

El segundo MVP amplía esta infraestructura incorporando servicios externos de reconocimiento y síntesis de voz, sin reemplazar los componentes anteriores.

- **Aplicación publicada:** frontend y API en Vercel.
- **Base de datos:** MongoDB Atlas.
- **Integración inicial de voz:** PR #3, fusionado a `main`.
- **Correcciones de estabilidad y documentación del MVP2:** PR #4, fusionado a `main`.

## 2. Configuración adicional del MVP2

Para implementar las funcionalidades de voz se incorporaron las siguientes variables de entorno en el backend:

| Variable de entorno | Función |
|---|---|
| `ASSEMBLYAI_API_KEY` | Permite utilizar AssemblyAI para transcribir audio a texto. |
| `ELEVENLABS_API_KEY` | Permite utilizar ElevenLabs para generar audio a partir de texto. |
| `ELEVENLABS_VOICE_ID` | Identifica la voz utilizada para la síntesis. |
| `ELEVENLABS_MODEL_ID` | Define el modelo de síntesis de voz. |

Las credenciales de los proveedores se administran mediante variables de entorno y permanecen exclusivamente en el backend. No se incluyen en el código del frontend ni se publican en GitHub.

En caso de que ElevenLabs no esté disponible, la aplicación dispone de una alternativa mediante la síntesis de voz del navegador.

## 3. Integración y control de versiones

La incorporación de las funcionalidades de voz se realizó de manera incremental, utilizando Git y GitHub para controlar los cambios.

### Primera integración — Pull Request #3

Se integró la primera versión de las funcionalidades de reconocimiento y síntesis de voz a la rama `main`.

Esta versión incorporó dictado individual, creación de borradores de tareas, documentación técnica, asignaciones administrativas y lectura de tareas mediante voz.

### Correcciones posteriores — Pull Request #4

Después de la auditoría técnica realizada con Codex, se identificaron catorce hallazgos, de los cuales el equipo priorizó inicialmente cinco: **A01, A02, A03, A04 y A12**.

Las correcciones se desarrollaron en la rama independiente `fix/mvp2-voz-estabilidad`, con el objetivo de mejorar la estabilidad de las funcionalidades de voz sin modificar directamente la rama principal.

Adicionalmente, durante las pruebas reales se identificó una limitación en la interpretación de instrucciones naturales de asignación, por lo que se incorporó una corrección adicional para HU16.

El último commit de esta corrección fue:

- **Commit:** `021d185`
- **Descripción:** `fix: mejorar interpretación de asignaciones por voz`

Una vez realizadas las validaciones correspondientes, el **Pull Request #4 fue fusionado a `main` el 9 de noviembre de 2026, hora de Colombia**.

- **PR:** https://github.com/flowxter/tech-track/pull/4
- **Commit de integración:** `040287d`
- **Estado:** fusionado y cerrado.
- **Rama principal:** `main`.

Con esta integración, las correcciones de estabilidad, las pruebas de regresión y la documentación del MVP2 quedaron incorporadas oficialmente al repositorio principal.

## 4. Verificaciones y despliegue

Antes de publicar las últimas correcciones, Codex ejecutó las verificaciones automatizadas y reportó los siguientes resultados:

| Verificación | Resultado |
|---|---|
| Pruebas backend | 114/114 aprobadas |
| Pruebas frontend | 40/40 aprobadas |
| Compilación del backend | Correcta |
| Compilación del frontend | Correcta |
| TypeScript estricto | Sin errores |
| `git diff --check` | Sin errores |
| Revisión de credenciales y archivos sensibles | Sin hallazgos en los cambios publicados |

Estas pruebas utilizaron servicios simulados y no sustituyen la validación de las APIs reales.

De manera complementaria, el equipo realizó pruebas manuales en localhost utilizando AssemblyAI real. Se verificó la transcripción de instrucciones y el llenado de formularios mediante voz, así como el manejo de asignaciones ambiguas.

Después de fusionar el PR #4, GitHub registró verificaciones exitosas de Vercel para el commit `040287d` en los proyectos `tech-track` y `tech-track-a27t`.

**Aplicación web:** https://tech-track-a27t.vercel.app/

Aunque las verificaciones de Vercel fueron exitosas, estas no sustituyen una prueba funcional integral de la versión publicada. La validación final debe comprobar la autenticación, la conexión con la API y MongoDB Atlas, el dictado con micrófono real, la creación y documentación de tareas, las asignaciones administrativas y la lectura hablada.

## 5. Decisiones humanas (HITL)

Durante el despliegue se mantuvo el enfoque **Human-in-the-Loop (HITL)**, en el cual las decisiones de integración y publicación permanecen bajo responsabilidad del equipo.

Las principales decisiones fueron:

- Conservar la arquitectura y la infraestructura existentes del MVP1.
- Configurar los servicios de voz desde el backend, protegiendo sus credenciales.
- Solicitar una auditoría técnica antes de realizar modificaciones.
- Autorizar únicamente las correcciones priorizadas.
- Desarrollar los cambios en una rama independiente.
- Ejecutar pruebas automatizadas y realizar verificaciones manuales antes de integrarlos.
- Revisar y autorizar la actualización del Pull Request y su posterior integración a `main`.

De esta manera, las herramientas de inteligencia artificial apoyaron la identificación y corrección de problemas, mientras que el equipo conservó el control sobre la aceptación y publicación de los cambios.

## 6. Resultado y estado final

El MVP2 de TechTrack quedó integrado a la rama principal del repositorio, incorporando las funcionalidades de reconocimiento y síntesis de voz y las correcciones priorizadas durante la auditoría.

El PR #4 se encuentra fusionado y las verificaciones de Vercel correspondientes al commit de integración finalizaron satisfactoriamente.

Se dispone de resultados automatizados reportados por Codex y de pruebas manuales realizadas por el equipo. **Queda pendiente incorporar al repositorio el registro completo de estas pruebas reales, con sus resultados y evidencias**, así como documentar la verificación integral de la versión publicada.

El proceso permitió mantener la trazabilidad entre las correcciones realizadas, las pruebas ejecutadas, los commits y la integración final a `main`.