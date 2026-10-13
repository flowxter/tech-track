# Guía técnica — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Asignatura:** Proyecto Integrador II  
**Propósito:** orientar la instalación, ejecución, comprensión y verificación técnica del MVP.

## 1. Descripción y tecnologías

TechTrack es una aplicación web para registrar equipos informáticos y documentar intervenciones de soporte técnico. Permite gestionar tareas, sus estados, diagnósticos, actividades, resultados, evidencias fotográficas e historial por equipo. Dispone de funciones diferenciadas para técnicos y administradores.

| Capa | Tecnologías |
|---|---|
| Interfaz | React, TypeScript, Vite |
| Servidor y API | Node.js, Express, TypeScript |
| Persistencia | MongoDB Atlas, Mongoose |
| Seguridad y validación | JWT, bcrypt, Zod, Helmet, CORS |
| Archivos de evidencia | Multer, Sharp; almacenamiento en MongoDB |
| Repositorio | GitHub |

La solución utiliza una **arquitectura web cliente-servidor**: el frontend consume una API HTTP/JSON, que aplica las reglas de negocio y accede a MongoDB. No es una arquitectura de microservicios.

## 2. Estructura del proyecto

```text
tech-track/
├── front/
│   └── src/
│       ├── api.ts              # Cliente HTTP
│       ├── components/         # Componentes de interfaz
│       ├── TechTrackApp.tsx    # Consola principal
│       └── types.ts            # Tipos del frontend
├── back/
│   └── src/
│       ├── config/             # Variables de entorno y conexión
│       ├── middleware/         # Autenticación y autorización
│       ├── models/             # Modelos de MongoDB
│       ├── modules/            # Autenticación, equipos, tareas y administración
│       ├── app.ts              # Rutas y manejo de errores
│       └── server.ts           # Inicio del servidor
└── docs/                       # Documentación y evidencias
```

Los modelos principales son **Usuario, Equipo, Tarea y Evidencia**. Los campos de diagnóstico, actividades y resultado pertenecen a la tarea. El historial se obtiene consultando las tareas asociadas a un equipo.

## 3. Requisitos de ejecución

- Node.js **20 o superior** y npm.
- Acceso al código de TechTrack.
- Una instancia de MongoDB Atlas disponible, con usuario autorizado y la IP de desarrollo habilitada.
- Dos terminales: una para el backend y otra para el frontend.

Repositorio: https://github.com/flowxter/tech-track

## 4. Instalación y configuración local

Los siguientes comandos se ejecutan desde la carpeta principal `tech-track/`, utilizando PowerShell.

**Backend:**

```powershell
cd back
npm install
Copy-Item .env.example .env
```

Editar `back/.env` con los valores propios del entorno:

| Variable | Uso |
|---|---|
| `PORT` | Puerto de la API; por defecto, `4000` |
| `CLIENT_ORIGIN` | Origen permitido para el frontend; por defecto, `http://localhost:5173` |
| `MONGODB_URI` | Cadena de conexión privada a MongoDB Atlas |
| `JWT_SECRET` | Secreto de firma de tokens, de al menos 32 caracteres |
| `JWT_EXPIRES_IN` | Vigencia del token; por defecto, `8h` |

El archivo `.env.example` sirve como plantilla: **sus marcadores no son credenciales funcionales**. No publicar `back/.env`, contraseñas, tokens ni claves en GitHub.

Para iniciar el backend desde `back/`:

```powershell
npm run dev
```

**Frontend:** abrir una segunda terminal desde `tech-track/`:

```powershell
cd front
npm install
npm run dev
```

Opcionalmente, puede crearse `front/.env.local` con esta configuración si se necesita definir explícitamente la dirección de la API:

```dotenv
VITE_API_URL=http://localhost:4000/api
```

**Direcciones locales:**

- Aplicación web: http://localhost:5173
- API: http://localhost:4000/api
- Comprobación básica: http://localhost:4000/api/health

La ruta `/api/health` responde con el estado de la API. Su resultado no reemplaza una prueba real de lectura y escritura en la base de datos.

## 5. Funcionalidades y API

| Módulo | Función principal | Rutas representativas |
|---|---|---|
| Autenticación | Registro, inicio de sesión, consulta de usuario y cierre de sesión | `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout` |
| Equipos | Registro, listado e historial | `/api/equipment`, `/api/equipment/:id/history` |
| Tareas | Creación, consulta, cambio de estado y documentación | `/api/tasks`, `/api/tasks/:id`, `/api/tasks/:id/status`, `/api/tasks/:id/documentation` |
| Evidencias | Carga y lectura autenticada de imágenes | `/api/tasks/:id/evidence`, `/api/tasks/:id/evidence/:evidenceId/content` |
| Administración | Consulta de actividades y asignación de tareas | `/api/admin/activities`, `/api/admin/tasks` |

La mayoría de las rutas exige el encabezado `Authorization: Bearer <token>`. El backend diferencia los roles `TECHNICIAN` y `ADMIN`.

Los estados de una tarea son **Pendiente → En progreso → Completada**. Las imágenes admitidas son JPEG, PNG y WEBP, con límite de **5 MB por archivo**; se almacenan en MongoDB y su lectura requiere autenticación.

**Referencia funcional:** HU01–HU12 en Jira (`MGDST-1` a `MGDST-12`). HU10 corresponde al **historial del equipo** y HU11 al **detalle de tarea**, aunque el README del repositorio presenta esos dos números intercambiados.

## 6. Compilación y pruebas

Desde la carpeta `front/`:

```powershell
npm run build
```

Desde la carpeta `back/`:

```powershell
npm run build
npm test
```

El backend contiene pruebas unitarias de **transiciones de estado** y **validación de formatos de imagen**. En la auditoría realizada con Codex, ambas compilaciones finalizaron correctamente y se aprobaron **6 pruebas unitarias**.

La evaluación funcional posterior comprobó las 12 historias frente a **59 criterios de aceptación de Jira**, mediante API y navegador: **56 cumplen, 1 parcialmente, 1 no cumple y 1 no se verificó**. Estos resultados corresponden a la versión evaluada; no deben presentarse como una nueva ejecución de pruebas.

Los procedimientos y hallazgos se documentan en `docs/evidencias-ia/etapas/06-pruebas/` y en el documento general `docs/07-pruebas.md` cuando se incorpore su actualización.

## 7. Seguridad, límites y precauciones

- No subir archivos `.env` ni `.env.test.local` al repositorio. El `.gitignore` los excluye.
- No ejecutar el script `seed:test-user` sin autorización: **crea o actualiza una cuenta en MongoDB**.
- El cierre de sesión revoca los tokens existentes del usuario; evitar hacerlo sobre cuentas administrativas compartidas durante pruebas.
- Las cuentas y registros QA deben identificarse y mantenerse separados de la información del equipo.
- El uso de JWT en almacenamiento del navegador corresponde al alcance actual del MVP; requiere revisión antes de un entorno de producción.

**Limitaciones identificadas en las pruebas:**

| ID | Hallazgo |
|---|---|
| D01 | Información de una sesión anterior puede permanecer visible en el frontend al cambiar de cuenta. |
| D02 | Algunos identificadores mal formados producen respuestas HTTP 500. |
| D03 | Al completar una tarea, cambios de documentación no guardados pueden parecer persistidos hasta recargar. |
| D04 | La pantalla administrativa permite asignar tareas, funcionalidad que debe conciliarse con el alcance de consulta de HU12. |

También quedan por definir la unicidad del identificador/serial de equipos (HU03) y el significado de la fecha de actividad (HU08). **El hallazgo D01 impide recomendar la aceptación global del MVP hasta corregirlo y repetir las pruebas pertinentes.**

## 8. Documentación relacionada

- `README.md`: presentación general y descripción de la API.
- `docs/03-requerimientos.md`: alcance y requisitos.
- `docs/06-arquitectura.md`: diseño de arquitectura.
- `docs/07-pruebas.md`: estrategia y resultados de pruebas, una vez actualizado.
- `docs/09-evaluacion.md`: evaluación del MVP, una vez actualizado.
- `docs/evidencias-ia/`: prompts, respuestas de IA, trazabilidad y validaciones humanas.

Esta guía describe la **implementación y el entorno local examinados**, sin afirmar que exista un pipeline CI/CD o un despliegue público verificados.