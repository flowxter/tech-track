# TechTrack

Aplicación web para gestionar y dar trazabilidad a intervenciones de soporte y mantenimiento informático. La estructura separa el cliente y la API para mantener responsabilidades claras y permitir que cada módulo evolucione sin concentrar la lógica en una sola aplicación.

## Tecnologías

- **Frontend:** React 19, TypeScript, Vite y Lucide.
- **Backend:** Node.js, Express 5 y TypeScript.
- **Persistencia:** MongoDB Atlas con Mongoose.
- **Validación y seguridad:** Zod, bcrypt, JWT, Helmet, CORS y limitación de intentos de acceso.

## Estructura

```text
front/
  src/
    api.ts                 Cliente HTTP y manejo común de errores
    components/
      AuthScreen.tsx       Registro e inicio de sesión
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

## Despliegue en Vercel

El repositorio puede desplegarse como dos proyectos Vercel conectados al mismo repositorio:

1. **API:** crea un proyecto con `back` como **Root Directory** y deja que Vercel detecte Express. La entrada `src/app.ts` exporta la aplicación; la conexión MongoDB se asegura por solicitud y se reutiliza entre invocaciones calientes. No configures un comando de salida estática.
2. En el proyecto de la API agrega `MONGODB_URI`, `JWT_SECRET` (aleatorio, mínimo 32 caracteres), `JWT_EXPIRES_IN=8h` y `CLIENT_ORIGIN` con el origen exacto del frontend desplegado, sin barra final. Vercel administra `PORT` automáticamente.
3. **Frontend:** crea otro proyecto del mismo repositorio, con `front` como **Root Directory**, `npm run build` como comando de build y `dist` como directorio de salida.
4. En el frontend agrega `VITE_API_URL=https://<dominio-api>.vercel.app/api`. Después del primer despliegue, copia el dominio asignado y úsalo como `CLIENT_ORIGIN` en el backend; vuelve a desplegar ambos proyectos tras guardar las variables.

La API también puede permanecer en Render; en ese caso, `CLIENT_ORIGIN` debe ser el dominio Vercel y `VITE_API_URL` debe apuntar al dominio Render. Nunca expongas `MONGODB_URI` ni `JWT_SECRET` como variables `VITE_*`.

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

Las imágenes se guardan como binario en MongoDB y no se sirven desde una ruta pública. Para probar la vista administrativa localmente, el script `npm run seed:test-user --prefix back` admite `TEST_USER_ROLE=ADMIN`; por defecto crea un técnico. Define `TEST_USER_PASSWORD` solo en el `.env` local y no habilites este mecanismo como ruta pública.

El cierre incrementa la versión de token del usuario y, por tanto, revoca todas sus sesiones existentes. El token de acceso se guarda en el navegador para este MVP; antes de producción conviene migrar a cookies `HttpOnly`/`Secure` y añadir protección CSRF.

## Verificación

```powershell
npm run build --prefix front
npm run build --prefix back
npm test --prefix back
```

Las pruebas unitarias cubren transiciones de estado y firmas de imágenes permitidas/rechazadas. Para QA de integración, ejecutar el flujo con MongoDB disponible y comprobar guardado y recarga, carga múltiple, archivo sobredimensionado/corrupto, aislamiento entre cuentas, historial vacío y acceso técnico frente a administrativo.