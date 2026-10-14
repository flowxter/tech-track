# Validación humana y decisiones de alcance

## Autorización recibida

El usuario entregó la instrucción original conservada en [prompt.md](prompt.md). Autorizó analizar y modificar código local para D01, D02, D03, D05 y D06, refactorizar lo necesario, agregar pruebas, ejecutar compilaciones/pruebas locales y documentar resultados.

Prohibió cambiar de rama, hacer commit/push/merge, alterar datos compartidos de Atlas, ejecutar semillas/migraciones/limpiezas, crear registros compartidos, ejecutar logout administrativo, modificar secretos o revelar `.env`, cambiar Jira y sobrescribir el informe previo. Se respetaron estas restricciones. Las variables y tokens ficticios de los tests son exclusivos de los procesos de prueba; no se modificaron credenciales reales ni archivos de entorno.

La ejecución local de pruebas HTTP y navegador fuera del aislamiento recibió permiso del revisor automático. Ese permiso operativo no es aprobación humana del producto ni autorización de escritura en Atlas. No hubo rechazo de revisión automática pendiente.

## Decisiones expresadas por el usuario

| Tema | Respuesta humana recibida | Efecto aplicado |
|---|---|---|
| HU03 | «Conservar identificador único por técnico (recomendado)» | Se conserva el índice único existente `{ owner: 1, assetTag: 1 }`. No se cambia la regla ni se exige serial único |
| HU08 | «Dejar pendiente hasta acordar la semántica (recomendado)» | No se agrega fecha de ejecución ni se rellenan registros anteriores |
| HU12/D04 | «Dejar la propuesta documentada para aprobación del equipo (recomendado)» | No se separa aún la pantalla ni se elimina la asignación; se documenta la propuesta |

Estas respuestas son decisiones del usuario en esta conversación. No se atribuye una aprobación independiente de todos los integrantes del equipo, ni aceptación del MVP, ni autorización de cambios en Jira.

## HU03 — Alternativas y consecuencias

Hoy `Equipment` exige identificador y serial, pero solo impone unicidad de `assetTag` dentro de `owner`. El mismo identificador puede existir en cuentas diferentes; el serial no tiene índice único.

| Alternativa | Consecuencia |
|---|---|
| Identificador único por técnico | Mantiene el inventario aislado de cada cuenta y evita cambios de datos/índices. Puede representar un mismo equipo físico varias veces entre técnicos |
| Identificador único global | Facilita un inventario central de activos, pero limita que técnicos diferentes registren el mismo activo; requiere definir acceso compartido o transferencia y auditar duplicados antes de cambiar índices |
| Serial único por técnico o global | Acerca la regla a la identidad física; requiere acordar normalización y manejo de series reutilizadas, genéricas o incorrectas y revisar duplicados existentes |
| Identificador y serial únicos por separado | Rechaza duplicados de cualquiera de los dos; más restrictivo, con las mismas necesidades de normalización y revisión previa |
| Combinación identificador+serial, por técnico o global | Solo prohíbe repetir la pareja exacta; permite reutilizar el identificador con otro serial y el serial con otro identificador, por lo que no equivale a unicidad individual |

Recomendación para el alcance actual: conservar identificador único por técnico, opción elegida por el usuario. No se inspeccionaron ni alteraron índices o duplicados reales en Atlas; se comprobó el esquema local y se conservó la evidencia previa de 409 por duplicado del mismo propietario.

## HU08 — Semántica pendiente

`Task` guarda `activities` como un texto único por intervención, además de `createdAt`, `updatedAt` y `statusHistory.changedAt`. `Evidence` tiene `uploadedAt`. No existe una fecha independiente de ejecución de actividad. `updatedAt` puede cambiar al modificar estado, por lo que no debe renombrarse ni presentarse como fecha de ejecución.

Propuesta pendiente: `activityPerformedAt` opcional por intervención, indicado por el técnico, con validación y representación explícita de zona horaria. `createdAt` seguiría representando creación del registro y `updatedAt`, su última modificación. Los registros anteriores quedarían sin fecha de ejecución conocida, sin deducirla de otros campos.

Antes de implementar, el equipo debe definir si quiere fecha de ejecución o de registro, si necesita día o instante, si acepta fecha futura, qué zona usa y si requiere varias actividades con fechas independientes. En ese último caso un solo campo por tarea sería insuficiente y habría que diseñar una colección o arreglo de actividades. El usuario decidió mantener esta definición pendiente; no hay autorización para agregar el requisito.

## HU12 / D04 — Separación propuesta

Jira exige que la supervisión sea de consulta. El modal administrativo tiene campos de solo lectura. La creación/asignación se realiza en un formulario distinto y un endpoint propio `POST /admin/tasks`, pero ambos flujos comparten la pantalla de supervisión. Existe separación técnica de rutas, no separación del flujo visible que resuelva el hallazgo original.

Propuesta: conservar `POST /admin/tasks`, sus permisos y su formulario, ubicando este último en una vista administrativa «Asignación». «Supervisión» conservaría listado, revisión y evidencias de solo lectura. La navegación expondría ambas opciones únicamente a administradores. Esto preserva la función existente y evita convertir una consulta en un punto de escritura.

Falta aprobación del equipo para esa separación y definición de dónde se documenta la asignación como funcionalidad distinta. El usuario dejó la propuesta pendiente: D04 sigue abierto y no se cambiaron criterios de Jira.

## Validación todavía no recibida

No existe aprobación humana de las correcciones implementadas ni aceptación global del MVP. Las pruebas finales son evidencia técnica aislada. El recorrido con frontend, backend y persistencia compartida sigue pendiente; cualquier prueba que escriba en Atlas requiere autorización específica con inventario de registros a crear o modificar.
