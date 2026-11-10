# Auditoría técnica del MVP2 — TechTrack

Actúa como un ingeniero de software senior especializado en React, TypeScript, Node.js, Express, MongoDB, integración de APIs de IA, testing y arquitectura de software.

## 1. Contexto del proyecto

El proyecto se llama **TechTrack** y es una aplicación web para gestionar actividades de soporte y mantenimiento informático.

Repositorio: [https://github.com/flowxter/tech-track](https://github.com/flowxter/tech-track)

Despliegue: [https://tech-track-a27t.vercel.app/](https://tech-track-a27t.vercel.app/)

Stack:

- Frontend: React, TypeScript y Vite.
- Backend: Node.js, Express y TypeScript.
- Base de datos: MongoDB Atlas con Mongoose.
- Reconocimiento de voz a texto: AssemblyAI.
- Síntesis de texto a voz: ElevenLabs, con respaldo mediante la voz del navegador.

La estructura principal del repositorio contiene `front/`, `back/` y `docs/`.

El proyecto corresponde al Taller 2 de Proyecto Integrador II, cuyo objetivo principal es ampliar el MVP1 mediante reconocimiento del habla.

## 2. Estado actual

Las integraciones de AssemblyAI y ElevenLabs ya fueron desarrolladas y fusionadas en la rama `main` mediante el PR #3.

Las funcionalidades existentes incluyen:

1. Dictado por voz en campos individuales.
2. Creación de borradores de tareas mediante dictado.
3. Asignación de tareas a técnicos mediante voz.
4. Dictado de informes técnicos completos, distribuyendo el contenido entre problema, diagnóstico, actividades, resultado y observaciones.
5. Lectura en voz alta de tareas.
6. Resumen hablado de tareas pendientes.
7. Alternativa de síntesis de voz mediante el navegador.
8. Confirmación humana antes de guardar información dictada.

**No debes implementar nuevamente estas funcionalidades. Primero debes verificar su funcionamiento y calidad.**

## 3. Objetivo de esta solicitud

Realiza una auditoría técnica integral del código existente, especialmente del módulo de voz, para identificar defectos, riesgos, problemas arquitectónicos, inconsistencias y pruebas faltantes.

En esta primera etapa, trabaja exclusivamente en modo auditoría.

**No modifiques archivos, no generes commits, no crees Pull Requests y no cambies la configuración del proyecto.**

## 4. Aspectos que debes revisar

### A. Integración con AssemblyAI

Revisa `back/src/modules/voice/` y `front/src/voice/`.

Verifica:

- Captura correcta del audio mediante MediaRecorder.
- Formatos de audio aceptados y compatibilidad entre navegadores.
- Envío seguro del audio al backend.
- Compatibilidad de las solicitudes con la API actual de AssemblyAI.
- Selección de modelos, idioma español y tratamiento de las respuestas.
- Manejo de solicitudes asíncronas, polling y tiempos de espera.
- Errores de conexión, audio vacío, transcripciones incorrectas y límites.
- Liberación del micrófono al detener o cerrar una grabación.
- Seguridad de las credenciales y prevención de solicitudes no autorizadas.

Analiza si el comportamiento es adecuado para el backend desplegado en Vercel.

### B. Interpretación del dictado

Revisa `taskDictation.ts`, `documentationDictation.ts` y `spokenText.ts`.

Verifica:

- Extracción de títulos y descripciones.
- Identificación de equipos y técnicos.
- Manejo de nombres ambiguos.
- Separación de diagnósticos, actividades, resultados y observaciones.
- Conservación del texto original cuando no se reconocen palabras clave.
- Tratamiento de acentos, signos de puntuación y errores de transcripción.
- Prevención de asignaciones incorrectas.
- Confirmación humana antes de guardar.

Identifica situaciones reales en español donde las reglas puedan interpretar incorrectamente el dictado.

### C. Integración con ElevenLabs

Revisa `elevenLabsClient.ts`, `useSpeechPlayer.ts`, `ReadAloudButton.tsx` y `voiceScripts.ts`.

Verifica:

- Compatibilidad con la API de ElevenLabs.
- Generación y reproducción de audio.
- Manejo de errores y tiempos de espera.
- Lectura de tareas completas.
- Generación de resúmenes hablados.
- Detención de la reproducción.
- Cancelación al cambiar de tarea o cerrar sesión.
- Funcionamiento alternativo mediante SpeechSynthesis.
- Protección de datos y credenciales.

### D. Arquitectura y Clean Code

Evalúa:

- Separación de responsabilidades.
- Acoplamiento y cohesión de los componentes.
- Reutilización de código.
- Tipado TypeScript.
- Validación de entradas y respuestas.
- Manejo centralizado de errores.
- Seguridad de las rutas.
- Mantenibilidad.
- Documentación de funciones relevantes.

Evita proponer una refactorización completa si el código actual es suficiente para el MVP2.

### E. Pruebas existentes

Inspecciona todas las pruebas relacionadas con las funcionalidades del MVP2.

Ejecuta las pruebas locales que sean seguras, usando datos simulados y sin modificar información real.

Comandos de referencia:

- `npm run build --prefix back`
- `npm run build --prefix front`
- `npm test --prefix back`
- `npm run test:regression --prefix front`

Si es necesario instalar dependencias, utiliza los archivos lock existentes.

Distingue expresamente:

- Pruebas ejecutadas y aprobadas.
- Pruebas ejecutadas y fallidas.
- Pruebas no ejecutadas.
- Pruebas simuladas.
- Pruebas que requieren credenciales reales.
- Pruebas que requieren acceso al despliegue.

No afirmes que una API externa funciona porque sus mocks hayan aprobado.

### F. Despliegue

Revisa la configuración de frontend, backend y Vercel.

Presta especial atención a:

- Variables de entorno y CORS.
- Conexión con MongoDB.
- Protección de las claves de AssemblyAI y ElevenLabs.
- Límites de solicitudes y archivos.
- Compatibilidad de los tiempos de espera con funciones serverless.
- Comportamiento del módulo de voz en producción.
- Diferencias entre el código local, la rama `main` y la versión publicada.

No ejecutes operaciones que modifiquen datos de producción.

### G. Correspondencia con historias de usuario

Revisa la documentación existente y las historias HU01–HU12, asociadas en Jira a MGDST-1 hasta MGDST-12.

Para las funcionalidades de voz, utiliza provisionalmente estas historias:

- HU13: dictado en campos individuales.
- HU14: creación de tareas mediante voz.
- HU15: informes técnicos mediante voz.
- HU16: asignación administrativa mediante voz.
- HU17: lectura de tareas y resúmenes hablados.

Estas cinco HU son propuestas para el MVP2; no las consideres formalmente aprobadas en Jira.

Identifica qué está implementado, qué está probado y qué falta validar.

Ten en cuenta que HU08 y HU12 tenían aspectos pendientes en la evaluación anterior. No alteres los criterios originales para hacerlos coincidir artificialmente con el código.

## 5. Restricciones

- No cambies el stack tecnológico.
- No reimplementes funcionalidades existentes.
- No modifiques `.env` ni expongas credenciales.
- No uses claves reales ni consumas créditos de los proveedores durante esta auditoría.
- No ejecutes scripts de seed ni operaciones sobre bases de datos reales.
- No generes commits ni modifiques `main`.
- No inventes resultados de pruebas.
- Prioriza soluciones sencillas, seguras y compatibles con el MVP.

## 6. Formato del informe

Al finalizar, presenta:

**1. Resumen ejecutivo:** estado técnico del MVP2.

**2. Funcionalidades verificadas:** qué existe realmente en el código y qué nivel de evidencia tiene.

**3. Tabla de hallazgos:** ID, gravedad (crítico, alto, medio o bajo), archivo, problema, evidencia, impacto y solución recomendada.

**4. Resultados de pruebas:** comandos, número de pruebas aprobadas y fallidas, pruebas omitidas y limitaciones del entorno.

**5. Problemas de integración:** AssemblyAI, ElevenLabs, MongoDB y Vercel.

**6. Revisión de arquitectura:** evaluación de Clean Code, mantenibilidad y seguridad.

**7. Plan de correcciones priorizado:** orden recomendado, archivos afectados, esfuerzo estimado y criterios de aceptación.

**8. Checklist final:** qué debo comprobar manualmente antes de entregar el MVP2.

## 7. Instrucción final

Quiero un diagnóstico basado en el código real, no una explicación genérica.

Identifica primero los problemas que realmente afectan el funcionamiento del MVP2.

Diferencia claramente entre un defecto comprobado, un riesgo potencial y algo que todavía no se ha podido verificar.

**Detente al terminar el informe y espera mi autorización antes de implementar cualquier corrección.**
