# Correcciones integrales del MVP — respuesta de IA

## Alcance y fuentes

Intervención local sobre `fix/mejoras-integrales-mvp`, partiendo de HEAD `6021f89bcd4926f91cfb7f4283231fb7731ebe09`. El cambio preexistente en `.gitignore` se conservó. No se cambiaron ramas, no se hicieron commits, push ni merge.

Se leyeron el [informe funcional original](../../../06-pruebas/informe-funcional-71f7a90f.md), el código real, las pruebas existentes, `docs/06-arquitectura.md`, la arquitectura adoptada de etapa 04, `docs/07-pruebas.md`, la evidencia de Desarrollo y la guía técnica. Se consultaron mediante el conector Atlassian, exclusivamente en lectura, las descripciones y criterios de MGDST-1 a MGDST-12 y la épica MGDST-13. Jira confirma HU10 = historial y HU11 = detalle. No se modificó su contenido, estimación, planificación ni estado.

La instrucción original se conserva íntegra en [prompt.md](prompt.md), copiada del adjunto sin reformular. Su SHA256 coincide con el original: `7EBB0C73693E83959F6ADFB4E0E3B85A8CD0220E46541CD4C1B316BE52363F62`.

## Diagnóstico y cambios realizados

### D01 — Aislamiento entre sesiones

El logout original vaciaba usuario, tareas y equipos, pero conservaba historial, tarea seleccionada, revisión administrativa, opciones de asignación, vista activa y formularios. Los manejadores asíncronos podían volver a introducir datos después del logout. El detalle técnico se abría con la copia del listado antes de recibir autorización del servidor.

Se separó la raíz de autenticación del componente `SessionWorkspace`. Cada acceso crea una instancia con una clave nueva y su propio `AbortController`. El cierre elimina el token local, aborta las solicitudes y desmonta todo el espacio inmediatamente, antes de esperar la revocación remota. El siguiente acceso verifica perfil y listas desde cero. Los eventos de almacenamiento de otras pestañas reemplazan igualmente el espacio autenticado. El formulario de acceso cancela su login/registro pendiente al desmontarse, evitando que una respuesta anterior sustituya esa sesión nueva.

El cliente HTTP recibe la señal para JSON e imágenes y comprueba su cancelación después de consumir el cuerpo: una respuesta tardía tampoco se entrega si el transporte ignora la señal. El detalle se abre únicamente después de una respuesta exitosa. Los contadores de solicitudes descartan selecciones de detalle o historial anteriores dentro de la misma sesión. Los previews revocan sus URLs al desmontarse y descartan imágenes tardías.

Las consultas del backend conservan los filtros por propietario y los permisos administrativos. La cancelación del cliente no revierte operaciones que el servidor ya hubiera recibido. El fallo de revocación remota continúa sin una confirmación específica para el usuario; se garantiza la limpieza local, no la revocación del token ante una caída de red.

### D02 — Identificadores inválidos

Las rutas parametrizadas podían entregar directamente un ID inválido a Mongoose. Se agregó `validateObjectId`, registrado con `router.param` en tareas, equipos y administración, incluidos los IDs de evidencias. Exige 24 caracteres hexadecimales y devuelve 400 con un mensaje controlado antes de consultar recursos o procesar la carga de archivos.

La autenticación y el rol se verifican antes de esta validación. Un ID bien formado inexistente conserva 404; un recurso ajeno conserva el comportamiento de ocultación con 404 y el acceso administrativo de un técnico conserva 403. Los cuerpos de creación/asignación ya validaban sus referencias mediante Zod y se conservaron.

### D03 — Cambios pendientes al completar

Los campos con `defaultValue` conservaban el texto editado en el DOM aunque la respuesta del cambio de estado devolviera la versión almacenada. No existía comparación con la documentación persistida.

El formulario ahora usa un borrador controlado para problema, diagnóstico, actividades, resultado y recomendaciones. Se compara con la última tarea recuperada y se muestra un aviso si existen diferencias. Cambiar el estado queda bloqueado hasta guardar. Mientras se guarda documentación, cambia el estado o sube una imagen se serializan las operaciones y se bloquea la edición del formulario. La respuesta de guardado reemplaza el borrador con los valores confirmados por la API; una carga de evidencia conserva el borrador pendiente. Cerrar un formulario modificado requiere confirmar el descarte.

No se agregaron reglas nuevas al backend de finalización. Su comportamiento existente de conservar la documentación guardada y bloquear modificaciones después de completar se verificó con modelos simulados.

### D05 — Contrato de identidad

Se confirmó por inspección que login/registro devuelven `_id` y `/auth/me` devuelve `id`. No se reprodujo una caída funcional causada por esa diferencia. El adaptador `api.me` convierte el perfil público a `User` con `_id` en el frontend. El backend y sus respuestas públicas permanecen sin cambios. Se probaron ambos lados del contrato.

### D06 — Metadatos de evidencia

El detalle usaba la colección `Evidence`, pero lista, historial y supervisión exponían el arreglo embebido de `Task`, normalmente vacío. Se agregó `withTaskEvidence` para obtener en una consulta por conjunto los metadatos de la colección `Evidence`, agrupados por tarea y propietario. Lista, historial y detalles técnicos/administrativos usan el mismo mapeo de `_id`, `filename`, `mimeType`, `size`, `uploadedAt` y `url`.

Las URLs siguen las rutas protegidas de cada rol. No se incluyen binarios en JSON ni se cambian las rutas de recuperación. Se conserva el campo embebido del esquema por compatibilidad y no se migraron datos. No se inspeccionó si existen registros históricos que contengan exclusivamente evidencias embebidas.

## Verificación ejecutada

| Ejecución final | Resultado | Evidencia |
|---|---|---|
| `npm.cmd run build --prefix back` | Salida 0, TypeScript correcto | [Compilación backend](compilacion-backend.txt) |
| `npm.cmd test --prefix back` | 14 aprobadas, 0 fallidas: 6 existentes y 8 nuevas | [TAP backend](ejecucion-backend.txt) |
| `npm.cmd run build --prefix front` | Salida 0, TypeScript y Vite correctos | [Compilación frontend](compilacion-frontend.txt) |
| `npm.cmd run test:regression` desde `front` | Salida 0, 10 escenarios aprobados en Chromium de Edge | [Regresión navegador](ejecucion-navegador.txt) |
| `git diff --check` | Sin errores de espacios | Comprobación en terminal |

Se utilizó Node.js 22.18.0. No se instalaron dependencias. El navegador usa Playwright ya disponible en el runtime de Codex, resuelto por `TECHTRACK_TEST_NODE_MODULES`, con `TECHTRACK_TEST_BROWSER_CHANNEL=msedge`. La suite inicia Vite con configuración aislada, sin cargar archivos `.env`, y sustituye la API por respuestas ficticias interceptadas. El backend de pruebas inicia Express en loopback, simula los modelos, desactiva el buffering y nunca llama a `connect()`.

Durante el desarrollo hubo errores de tipado en el nuevo test de backend, bloqueos HTTP del entorno aislado y dos supuestos incorrectos del test de navegador: el nombre accesible exacto del textarea y una única solicitud de imagen bajo StrictMode. Se corrigió el código de pruebas y se repitieron las verificaciones. Los registros enlazados corresponden a las ejecuciones finales, no ocultan fallos pendientes del producto. El acceso local fuera del aislamiento fue permitido por la revisión automática; no se requirió ni recibió permiso de escritura en Atlas.

## Estado real y decisiones

| Defecto | Estado final | Límite |
|---|---|---|
| D01 | Corregido y verificado en entorno aislado | Navegador real con API simulada; falta recorrido contra backend y Atlas reales |
| D02 | Corregido y verificado en entorno aislado | Express real con persistencia simulada |
| D03 | Corregido y verificado en entorno aislado | Formulario y recarga con API simulada; conservación en backend con modelos simulados |
| D04 | Pendiente | El usuario dejó la separación de asignación/supervisión para aprobación del equipo |
| D05 | Contrato corregido y verificado; fallo funcional previo no reproducido | Adapter probado en navegador y contrato público en Express |
| D06 | Corregido y verificado en entorno aislado | Mapeo y rutas con mocks; datos históricos de Atlas no inspeccionados |

El usuario decidió conservar el identificador único por técnico para HU03. No cambió el índice existente ni se declaró una nueva aceptación de esa HU. Dejó HU08 y HU12/D04 pendientes. Las alternativas y consecuencias están en [validacion-hitl.md](validacion-hitl.md).

No hubo conexión ni escrituras de pruebas en Atlas, altas compartidas, semillas, migraciones, borrados, logout administrativo, cambios de secretos o modificaciones de archivos `.env`. El informe anterior y sus cifras se conservaron. No se declara aceptación global del MVP: siguen pendientes D04, la semántica temporal de HU08 y la integración con persistencia real.
