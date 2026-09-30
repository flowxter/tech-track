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

## Flujo implementado

El incremento inicial cubre el flujo del Sprint 1: registro, inicio/cierre de sesión, alta/listado de equipos, creación/listado de tareas asociadas, filtros y avance de estado. Los técnicos solo consultan sus propios registros. El modelo también conserva transiciones de estado y contiene campos para ampliar la documentación técnica.

| Historia | Estado de esta base |
| --- | --- |
| HU-01 Registro | Formulario, validación, correo duplicado, hash bcrypt y respuestas HTTP |
| HU-02 Sesión | Login, vistas autenticadas, JWT de 8 horas y revocación al cerrar sesión |
| HU-03 Equipos | Registro/listado, campos obligatorios y aislamiento por técnico |
| HU-04 Crear tarea | Equipo requerido, fecha automática y estado Pendiente |
| HU-05 Consultar tareas | Listado propio, estado visible, búsqueda y estado vacío |
| HU-06 Cambiar estado | Pendiente → En progreso → Completada; validación en cliente y servidor |
| HU-07/08 Documentación | Campos y endpoint de actualización preparados en la API; falta el formulario de edición en la interfaz |
| HU-09 Evidencias | Pendiente: carga, almacenamiento y validación de imágenes |
| HU-10 Detalle completo | Endpoint de detalle disponible; falta integrar toda la documentación/evidencia en la vista |
| HU-11 Historial de equipo | Pendiente: endpoint y vista de historial |
| HU-12 Supervisión | El rol está modelado; falta el alta administrativa y el módulo de consulta |

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

El cierre incrementa la versión de token del usuario y, por tanto, revoca todas sus sesiones existentes. El token de acceso se guarda en el navegador para este MVP; antes de producción conviene migrar a cookies `HttpOnly`/`Secure` y añadir protección CSRF.

## Verificación

```powershell
npm run build --prefix front
npm run build --prefix back
npm test --prefix back
```

Las pruebas unitarias iniciales cubren transiciones válidas e inválidas de estado. Para QA de integración, ejecutar el flujo con MongoDB disponible y probar además duplicidad de correo/identificador, rutas privadas, propiedad de equipos y persistencia tras recargar.