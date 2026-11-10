# 07. Despliegue — TechTrack MVP2

## 1. Infraestructura utilizada

El MVP2 reutiliza el despliegue del MVP1: **Vercel** para la aplicación web y su API, y **MongoDB Atlas** para la persistencia. Se conserva el stack React/Vite, Node.js/Express y TypeScript. Aquí se registran únicamente las novedades del MVP2.

- **Aplicación publicada:** frontend y API en Vercel.
- **Integración inicial de voz:** PR #3, fusionado a `main`.

## 2. Configuración adicional del MVP2

| Variable de entorno del backend | Función |
|---|---|
| `ASSEMBLYAI_API_KEY` | Habilita la transcripción de audio a texto. |
| `ELEVENLABS_API_KEY` | Habilita la síntesis de texto a voz. |
| `ELEVENLABS_VOICE_ID` | Selecciona la voz de ElevenLabs. |
| `ELEVENLABS_MODEL_ID` | Selecciona el modelo de síntesis. |

Las claves se configuran **solo en el backend**, nunca en el frontend ni en GitHub. Sin el servicio de ElevenLabs, la aplicación dispone de lectura alternativa mediante la voz del navegador. La transcripción requiere que AssemblyAI esté configurado correctamente.

## 3. Integración y comprobación

La primera versión de las funciones de voz se integró en `main` mediante el PR #3. La auditoría comprobó la respuesta pública del frontend y los rechazos anónimos de rutas de voz. El equipo reportó después pruebas prácticas en localhost, cuyo registro integral sigue pendiente de adjuntar.

Para verificar una publicación del MVP2 se debe comprobar: acceso a la aplicación, autenticación, conexión con la API y MongoDB, dictado con micrófono real, creación y documentación de tareas, asignación administrativa, lectura con ElevenLabs y alternativa del navegador.

**Estado de las correcciones posteriores:** los cambios derivados de la auditoría de Codex (A01, A02, A03, A04 y A12) quedaron en la rama local `fix/mvp2-voz-estabilidad`, **sin commit, merge ni nuevo despliegue** según el informe de esa ejecución. Por tanto, las pruebas de esa rama no demuestran que la versión pública contenga dichas correcciones.

## 4. Decisión HITL

El equipo decidió **mantener la infraestructura del MVP1** y ampliar únicamente la configuración del backend para los proveedores de voz, evitando rediseñar o desplegar una arquitectura diferente. La publicación de correcciones posteriores queda sujeta a revisión y autorización humana.
