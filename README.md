# TechTrack

Aplicación web para gestionar y dar trazabilidad a intervenciones de soporte y mantenimiento informático. La estructura separa el cliente y la API para mantener responsabilidades claras y permitir que cada módulo evolucione sin concentrar la lógica en una sola aplicación.

## Tecnologías

- **Frontend:** React 19, TypeScript, Vite y Lucide.
- **Backend:** Node.js, Express 5 y TypeScript.
- **Persistencia:** MongoDB Atlas con Mongoose.
- **Validación y seguridad:** Zod, bcrypt, JWT, Helmet, CORS y limitación de intentos de acceso.
- **Voz (opcional):** AssemblyAI para transcribir dictados y ElevenLabs para leer en voz alta.

## Estructura

```text
front/
  src/
    api.ts                 Cliente HTTP y manejo común de errores
    components/
      AuthScreen.tsx       Registro e inicio de sesión
      NewTaskForm.tsx      Nueva tarea, escrita o dictada
      AssignmentForm.tsx   Asignación administrativa, escrita o dictada
    voice/                 Grabación, botones de dictado, lectura en voz alta y guiones
    TechTrackApp.tsx       Consola de tareas y equipos
    TechTrackApp.css       Sistema visual responsive
    types.ts               Contratos del cliente
back/
  src/
    config/                Entorno y conexión a MongoDB
    middleware/            Autenticación y autorización
    models/                Usuario, equipo e intervención
    modules/
      auth/                Registro, login y cierre de sesión
      equipment/           Inventario de equipos
      tasks/               Tareas, documentación y transiciones
      voice/               Clientes de AssemblyAI y ElevenLabs e intérprete de dictados
    utils/                 Errores y controladores async
```

## Ejecutar en local

Requisitos: Node.js 20 o posterior, npm y una instancia MongoDB Atlas accesible.

1. Copia `back/.env.example` a `back/.env`.
2. En `back/.env`, reemplaza `<db_username>` y `<db_password>` con el usuario de base de datos creado en Atlas. Si la contraseña contiene caracteres reservados de URL, codifícala antes de insertarla. Define también un `JWT_SECRET` aleatorio de al menos 32 caracteres.
3. En Atlas, agrega la IP de desarrollo a **Network Access** y confirma que el usuario tenga permisos sobre la base de datos.
4. Instala dependencias:

   ```powershell
   npm install --prefix back
   npm install --prefix front
   ```

5. Abre dos terminales desde la raíz:

   ```powershell
   npm run dev --prefix back
   ```

   ```powershell
   npm run dev --prefix front
   ```

La API queda en `http://localhost:4000` y el frontend en `http://localhost:5173`. `VITE_API_URL` puede usarse en `front/.env.local` para cambiar la URL de la API.

No guardes el `.env` ni credenciales reales en el repositorio. El archivo `.env.example` solo contiene marcadores.

## Funciones de voz

Son opcionales y se activan con variables de `back/.env`. Las claves solo existen en el servidor: el navegador nunca las recibe.

| Variable | Efecto |
| --- | --- |
| `ASSEMBLYAI_API_KEY` | Activa el dictado. Sin ella, las rutas de transcripción responden 503 y la aplicación sigue funcionando |
| `ELEVENLABS_API_KEY` | Activa la voz de ElevenLabs. Sin ella, o si falla, la lectura usa la voz del navegador |
| `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL_ID` | Opcionales: voz y modelo de ElevenLabs |

| Función | Dónde | Cómo se usa |
| --- | --- | --- |
| Dictado por campo | Documentación y descripciones | El micrófono de cada campo agrega el texto dictado a lo ya escrito |
| Crear tarea por voz | Nueva tarea | «Equipo PC-001. Título: cambiar disco. Descripción: hace ruido.» Sin palabras clave, la primera frase es el título |
| Asignar tarea por voz | Supervisión (`ADMIN`) | «Asignar a Ana. Equipo PC-001. Título: mantenimiento preventivo.» |
| Informe por voz | Detalle de tarea | Se dicta de corrido y se reparte por campos: «El problema era… Encontré… Hice… Como resultado… Recomiendo…» o «Diagnóstico… Actividades… Resultado… Observaciones…» |
| Resumen hablado | Panel de tareas | «Escuchar resumen» lee los conteos y las tareas por atender, primero las que están en progreso y luego las pendientes más antiguas |
| Lectura de tarea | Detalle y revisión administrativa | «Leer tarea» lee la intervención y omite las secciones vacías |

El dictado nunca guarda por sí solo: rellena el formulario y la persona revisa y confirma. El equipo o técnico solo se selecciona si la coincidencia es única; ante una ambigüedad queda sin seleccionar. Cada grabación dura como máximo 3 minutos y cada cuenta tiene un cupo de 60 solicitudes de voz cada 15 minutos.

TechTrack no almacena el audio, pero la voz y los textos leídos se envían a AssemblyAI y ElevenLabs, sujetos a sus políticas de datos. El micrófono requiere HTTPS o `localhost`.

## Despliegue en Vercel

El repositorio puede desplegarse como dos proyectos Vercel conectados al mismo repositorio:

1. **API:** crea un proyecto con `back` como **Root Directory** y deja que Vercel detecte Express. La entrada `src/app.ts` exporta la aplicación; la conexión MongoDB se asegura por solicitud y se reutiliza entre invocaciones calientes. No configures un comando de salida estática.
2. En el proyecto de la API agrega `MONGODB_URI`, `JWT_SECRET` (aleatorio, mínimo 32 caracteres), `JWT_EXPIRES_IN=8h` y `CLIENT_ORIGIN` con el origen exacto del frontend desplegado, sin barra final. Para las funciones de voz agrega también `ASSEMBLYAI_API_KEY` y `ELEVENLABS_API_KEY`. Vercel administra `PORT` automáticamente.
3. **Frontend:** crea otro proyecto del mismo repositorio, con `front` como **Root Directory**, `npm run build` como comando de build y `dist` como directorio de salida.
4. En el frontend agrega `VITE_API_URL=https://<dominio-api>.vercel.app/api`. Después del primer despliegue, copia el dominio asignado y úsalo como `CLIENT_ORIGIN` en el backend; vuelve a desplegar ambos proyectos tras guardar las variables.

La API también puede permanecer en Render; en ese caso, `CLIENT_ORIGIN` debe ser el dominio Vercel y `VITE_API_URL` debe apuntar al dominio Render. Nunca expongas `MONGODB_URI`, `JWT_SECRET` ni las claves de voz como variables `VITE_*`.

## Flujo implementado

El Sprint 1 cubre registro, inicio/cierre de sesión, equipos, tareas y transiciones de estado. El Sprint 2 completa la documentación de las intervenciones, sus evidencias, el historial por equipo y la consulta administrativa. Los técnicos solo consultan tareas y equipos de su cuenta; la supervisión requiere rol `ADMIN`.

| Historia | Estado de esta base |
| --- | --- |
| HU-01 Registro | Formulario, validación, correo duplicado, hash bcrypt y respuestas HTTP |
| HU-02 Sesión | Login, vistas autenticadas, JWT de 8 horas y revocación al cerrar sesión |
| HU-03 Equipos | Registro/listado, campos obligatorios y aislamiento por técnico |
| HU-04 Crear tarea | Equipo requerido, fecha automática y estado Pendiente |
| HU-05 Consultar tareas | Listado propio, estado visible, búsqueda y estado vacío |
| HU-06 Cambiar estado | Pendiente → En progreso → Completada; validación en cliente y servidor |
| HU-07/08 Documentación | Edición de problema, diagnóstico, actividades, resultado y recomendaciones; bloqueada al completar la tarea |
| HU-09 Evidencias | JPG, PNG y WEBP; máximo 5 MB; firma y decodificación validadas, persistencia en MongoDB y lectura autenticada |
| HU-10 Detalle completo | Detalle autorizado con equipo, estado, fechas, documentación y galería de evidencias |
| HU-11 Historial de equipo | Consulta por equipo ordenada por última actualización, con acceso al detalle de cada tarea |
| HU-12 Supervisión | Revisión global de tareas y documentos, evidencia autenticada y asignación de tareas a técnicos; limitado al rol `ADMIN` |

## API inicial

Todas las rutas salvo salud, registro y login requieren `Authorization: Bearer <token>`.

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API y conexión inicializada |
| POST | `/api/auth/register` | Crear cuenta de técnico |
| POST | `/api/auth/login` | Autenticar credenciales |
| GET | `/api/auth/me` | Consultar sesión actual |
| POST | `/api/auth/logout` | Revocar los tokens emitidos a esa cuenta |
| GET / POST | `/api/equipment` | Listar o registrar equipos propios |
| GET / POST | `/api/tasks` | Listar o crear tareas propias |
| GET | `/api/tasks/:id` | Consultar detalle autorizado |
| PATCH | `/api/tasks/:id/status` | Avanzar el estado de la tarea |
| PATCH | `/api/tasks/:id/documentation` | Guardar documentación técnica |
| POST | `/api/tasks/:id/evidence` | Adjuntar una imagen JPG, PNG o WEBP (máximo 5 MB) como campo multipart `image` |
| GET | `/api/tasks/:id/evidence/:evidenceId/content` | Leer una evidencia con autenticación |
| GET | `/api/equipment/:id/history` | Consultar intervenciones propias asociadas al equipo |
| GET | `/api/admin/technicians` | Consultar técnicos y equipos disponibles para asignación; requiere rol `ADMIN` |
| GET | `/api/admin/activities` | Consultar actividades; requiere rol `ADMIN` |
| POST | `/api/admin/tasks` | Crear y asignar una tarea a un técnico con un equipo de su inventario; requiere rol `ADMIN` |
| GET | `/api/admin/tasks/:id` | Revisar documentación, estado e imágenes de cualquier tarea; requiere rol `ADMIN` |
| GET | `/api/admin/tasks/:taskId/evidence/:evidenceId/content` | Leer evidencia desde la revisión administrativa autenticada |
| POST | `/api/voice/transcribe` | Transcribir una grabación (multipart `audio`, máximo 4 MB) |
| POST | `/api/voice/task-draft` | Transcribir y proponer un borrador de tarea con los equipos propios |
| POST | `/api/voice/assignment-draft` | Transcribir y proponer una asignación con técnicos y sus equipos; requiere rol `ADMIN` |
| POST | `/api/voice/documentation-draft` | Transcribir y repartir un informe entre los campos de la documentación |
| POST | `/api/voice/speech` | Generar audio MP3 de un texto de hasta 2500 caracteres |

Las imágenes se guardan como binario en MongoDB y no se sirven desde una ruta pública. Para probar la vista administrativa localmente, el script `npm run seed:test-user --prefix back` admite `TEST_USER_ROLE=ADMIN`; por defecto crea un técnico. Define `TEST_USER_PASSWORD` solo en el `.env` local y no habilites este mecanismo como ruta pública.

El cierre incrementa la versión de token del usuario y, por tanto, revoca todas sus sesiones existentes. El token de acceso se guarda en el navegador para este MVP; antes de producción conviene migrar a cookies `HttpOnly`/`Secure` y añadir protección CSRF.

## Verificación

```powershell
npm run build --prefix front
npm run build --prefix back
npm test --prefix back
```

Las pruebas unitarias cubren transiciones de estado, firmas de imágenes permitidas/rechazadas, los clientes de voz (sin llamar a los proveedores) y la interpretación de dictados. `npm run test:regression --prefix front` ejercita la interfaz en Chromium con micrófono simulado y API simulada; requiere Playwright (`TECHTRACK_TEST_NODE_MODULES` indica dónde está instalado y `TECHTRACK_TEST_BROWSER_CHANNEL=msedge` usa el navegador del sistema). Para QA de integración, ejecutar el flujo con MongoDB disponible y comprobar guardado y recarga, carga múltiple, archivo sobredimensionado/corrupto, aislamiento entre cuentas, historial vacío y acceso técnico frente a administrativo.