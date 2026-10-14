# Informe de regresión — mejoras integrales del MVP

## Alcance y referencia

Correcciones locales sobre `fix/mejoras-integrales-mvp`, base HEAD `6021f89bcd4926f91cfb7f4283231fb7731ebe09`. No hay commit nuevo. Se evaluaron D01, D02, D03, D05 y D06; se revisó D04 sin alterar su alcance.

El [informe anterior](informe-funcional-71f7a90f.md) permanece intacto. Sus resultados históricos son: 5 historias cumplen, 7 cumplen parcialmente; 56 de 59 criterios cumplidos, 1 parcial, 1 incumplido y 1 no verificado; 6 pruebas unitarias aprobadas y compilaciones correctas. **Esta regresión no modifica esos conteos ni constituye una nueva evaluación de los 59 criterios.**

Se consultaron los criterios oficiales de las 12 historias y la épica en Jira. HU10 es historial y HU11 es detalle.

## Entorno y protección de datos

Node.js 22.18.0 y dependencias ya instaladas. Backend: Express real en un puerto dinámico de loopback, JWT ficticios y modelos Mongoose simulados. No se importa `server.ts`, no se carga dotenv, no se llama a `connect()` y se desactiva el buffering de Mongoose. El test comprueba al terminar que no existe conexión de base de datos.

Frontend: Vite local, configuración de prueba sin `.env`, navegador Chromium de Microsoft Edge controlado con Playwright del runtime existente. Todas las respuestas de API se interceptan con perfiles A/B y datos ficticios. No se prueba el backend real desde ese navegador: la suite HTTP del backend se ejecuta por separado.

No hubo conexión a Atlas, creación de usuarios/equipos/tareas/evidencias compartidos, modificación de registros, semillas, migraciones, borrados, logout administrativo o instalación de dependencias. El aislamiento inicial impedía las solicitudes HTTP; las ejecuciones finales usaron el acceso local permitido por la revisión automática.

## Ejecuciones finales

| Comando | Resultado observado | Evidencia |
|---|---|---|
| `npm.cmd run build --prefix back` | Código 0, compilación TypeScript correcta | [Salida](../05-desarrollo/correcciones/mejoras-integrales-mvp/compilacion-backend.txt) |
| `npm.cmd test --prefix back` | Código 0, 14 pruebas aprobadas y ninguna fallida | [TAP](../05-desarrollo/correcciones/mejoras-integrales-mvp/ejecucion-backend.txt) |
| `npm.cmd run build --prefix front` | Código 0, TypeScript y Vite correctos | [Salida](../05-desarrollo/correcciones/mejoras-integrales-mvp/compilacion-frontend.txt) |
| `npm.cmd run test:regression` en `front` | Código 0, 10 escenarios aprobados | [Salida](../05-desarrollo/correcciones/mejoras-integrales-mvp/ejecucion-navegador.txt) |
| `git diff --check` | Sin errores | Terminal |

Las 14 pruebas backend incluyen las 6 unitarias existentes y 8 nuevas pruebas HTTP agrupadas. Los 10 escenarios de navegador tienen una unidad distinta. No se presenta su suma como cobertura, aceptación o cantidad de criterios Jira aprobados.

## Casos de regresión observados

| Caso | Defecto / HU | Ejecución y observación | Resultado |
|---|---|---|---|
| R01 | D01 / HU02, HU10, HU11 | A consulta historial, detalle e imagen; cierra detalle, se revoca la URL temporal y hace logout con respuesta remota demorada; el acceso aparece de inmediato. B entra en la misma pestaña con listas nuevas y abre su propio detalle | Aprobado con API simulada; sin datos A observados en la vigilancia de mutaciones DOM junto al perfil B |
| R02 | D01 / HU11 | Solicitud de detalle A demorada; logout y acceso B antes de responder | Aprobado; no abre un modal anterior |
| R03 | D01 / HU10 | Solicitud de historial A demorada; logout y acceso B antes de responder | Aprobado; no repone historial anterior |
| R04 | D01 / HU09, HU11 | Imagen A demorada; desmontaje del preview y cambio a B | Aprobado; no se crea URL de imagen tardía |
| R05 | D01 / HU11 | API de detalle responde 404 aun cuando la lista contiene una copia de tarea | Aprobado; no abre formulario ni muestra documentación de esa copia |
| R06 | D01 / HU02 | El transporte simulado ignora AbortSignal y devuelve JSON después de cancelar | Aprobado; el cliente rechaza con AbortError |
| R07 | D02 / HU06, HU07, HU09, HU10, HU11, HU12 | 10 variantes parametrizadas de tareas, historial, documentación, estado, carga y contenido de evidencia, incluidas rutas admin, reciben IDs mal formados | Aprobado; 400 genérico y ninguna consulta de recursos |
| R08 | D02 / HU06, HU07, HU09, HU10, HU11, HU12 | 8 rutas con ID válido inexistente | Aprobado; 404 conservado |
| R09 | D01, D02 / HU02, HU10, HU11, HU12 | Anónimo y técnico sin rol admin ante ID mal formado; recursos ajenos con filtros de propietario | Aprobado; 401/403 antes de validar y 404 para recursos no disponibles |
| R10 | D03 / HU06, HU07, HU08, HU11 | Editar los cinco campos; intentar completar; guardar con demora; completar y recargar | Aprobado; cero solicitudes de estado con borrador pendiente, controles bloqueados durante guardado y datos confirmados conservados después de recargar la API simulada |
| R11 | D03 / HU07, HU08, HU09 | Adjuntar evidencia mientras hay borrador; guardar con error; intentar completar | Aprobado; borrador conservado, valor previo persistido en la simulación y cero escrituras de estado |
| R12 | D03 / HU06, HU07, HU08, HU09 | Completar en Express con modelo simulado; intentar editar documentación y adjuntar otra imagen | Aprobado; campos y evidencia guardados conservados y operaciones posteriores devuelven 409 |
| R13 | D05 / HU02 | Express entrega perfil público con `id`, sin `_id` ni tokenVersion; adapter en navegador devuelve `User` con `_id` | Aprobado; contrato alineado sin cambiar respuesta pública |
| R14 | D06 / HU05, HU09, HU10, HU11, HU12 | Lista, historial, detalle, actividades admin y detalle admin consultan los mismos metadatos; las rutas de imagen exigen tarea/evidencia/propietario | Aprobado con mocks; nombres, MIME, tamaño, fecha de carga, ID y URL consistentes; respuesta de contenido con MIME correcto y no-store |
| R16 | D01 / HU02 | Login A demorado; evento de almacenamiento que activa sesión B antes de responder | Aprobado; el login antiguo se cancela y no reemplaza perfil ni token B |
| R15 | D04 / HU12 | Inspección de pantalla, modal, ruta de asignación y criterio oficial | Pendiente; asignación sigue compartiendo pantalla con supervisión |

Los IDs Rxx organizan este informe; no son campos de Jira ni equivalen uno a uno a los casos `node:test`. El código reproducible está en `back/src/regression.test.ts` y `front/tests/regression.mjs`.

## Reproducción

Compilar y ejecutar backend desde la raíz con los comandos de la tabla. La suite no necesita un MongoDB disponible. Para el navegador se requiere Playwright ya instalado y un Chromium disponible. En este entorno se usó PowerShell desde `front`:

```powershell
$env:TECHTRACK_TEST_NODE_MODULES = 'C:/Users/crlsc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
$env:TECHTRACK_TEST_BROWSER_CHANNEL = 'msedge'
npm.cmd run test:regression
```

En otro entorno, ajustar la ruta al runtime existente. Si Playwright se resuelve normalmente, la primera variable es innecesaria; si se dispone del Chromium de Playwright, la variable del canal es innecesaria. No se agregó Playwright al manifiesto ni se instalaron navegadores/dependencias.

Hubo intentos intermedios fallidos por restricciones HTTP y por errores en el nuevo código de pruebas, incluidos el tipado de una importación CommonJS, un selector de textarea y la duplicación de efectos en StrictMode. Se corrigieron antes de las ejecuciones finales. Los logs enlazados corresponden únicamente a los comandos finales completos y exitosos.

## Estado final y limitaciones

| Defecto | Clasificación final | Alcance de verificación |
|---|---|---|
| D01 | Corregido y verificado | Navegador real con API simulada; cancelación y aislamiento comprobados en los escenarios descritos |
| D02 | Corregido y verificado | HTTP contra Express real con modelos simulados |
| D03 | Corregido y verificado | Navegador con API simulada y conservación en backend con modelos simulados |
| D04 | Pendiente | Usuario solicita dejar separación para aprobación del equipo |
| D05 | Corregido y verificado como contrato; falla funcional previa no reproducida | Contrato público y adapter comprobados |
| D06 | Corregido y verificado | Consistencia de respuestas y recuperación HTTP con modelos simulados |

“Corregido y verificado” se limita explícitamente al entorno aislado. **No se ejecutó un recorrido con navegador → backend real → MongoDB Atlas después de las correcciones.** La recarga de R10 comprueba estado de la API simulada, no durabilidad en MongoDB. No se verificaron escrituras concurrentes de distintos clientes, expiración natural de JWT, caída real de infraestructura, totalidad de variantes de imágenes, rendimiento ni migración de evidencias embebidas antiguas. La limpieza local ante logout no garantiza la revocación remota si esta falla. Se probó el listener de almacenamiento mediante un evento simulado en navegador; no se ejecutó un recorrido entre dos pestañas reales.

HU03: el usuario eligió conservar identificador único por técnico; no se modificó el índice ni se reevaluó su aceptación. HU08: fecha de ejecución independiente pendiente por decisión del usuario. HU12/D04: propuesta de separación documentada y aún no aprobada. No se declara MVP terminado ni aceptado globalmente.

Evidencias complementarias: [respuesta de IA](../05-desarrollo/correcciones/mejoras-integrales-mvp/respuesta-ia.md), [trazabilidad e inventario de archivos](../05-desarrollo/correcciones/mejoras-integrales-mvp/trazabilidad.md) y [validación HITL](../05-desarrollo/correcciones/mejoras-integrales-mvp/validacion-hitl.md).
