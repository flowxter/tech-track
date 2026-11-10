# Respuesta original de Codex — Auditoría

**1. Resumen ejecutivo**

El MVP2 tiene implementadas las funcionalidades de voz solicitadas y una separación de responsabilidades razonable para su alcance. **Todavía no lo consideraría validado para entrega:** encontré defectos reproducibles en la interpretación del dictado, conservación de información, lectura completa y liberación del micrófono, además de un riesgo importante de compatibilidad con el modelo configurado de AssemblyAI.

Resultados principales:

- Los builds del frontend y backend aprobaron.
- Las **33 pruebas del backend aprobaron**, usando proveedores y persistencia simulados.
- La regresión del frontend no pudo iniciar: falta Playwright, que tampoco está declarado en sus dependencias.
- Ejecuté **10 comprobaciones adicionales en memoria** que reprodujeron comportamientos problemáticos.
- El frontend publicado respondió HTTP 200. Su JavaScript y CSS coinciden mediante SHA-256 con el build del código auditado al utilizar la URL pública de su API.
- Tres rutas de voz publicadas rechazaron solicitudes anónimas con 401; el preflight CORS respondió correctamente.

**Versiones revisadas:** el repositorio local permanece en `31ac07a`, anterior al módulo de voz. Audité una copia temporal del `main` remoto, `92abf9d`, correspondiente a la fusión del [PR #3](https://github.com/flowxter/tech-track/pull/3).

No modifiqué el repositorio de trabajo, su configuración ni sus archivos `.env`. No generé commits o PR, ejecuté seeds, utilicé claves reales ni consumí créditos de proveedores.

**2. Funcionalidades verificadas**

“Nivel de evidencia” distingue existencia en código, ejecución simulada y comprobación pública.

| Funcionalidad | Implementación y evidencia | Pendiente |
|---|---|---|
| Dictado por campo | `DictableTextarea`, `DictationButton`, captura de audio y envío multipart. Existe regresión específica. | Ejecución completa en navegador y audio real. |
| Creación de tareas por voz | Endpoint de borrador, interpretación y formulario editable. Parser probado. | Resolver pérdida de información y selecciones anteriores. |
| Asignación administrativa | Endpoint protegido por rol y búsqueda de técnicos/equipos. | Corregir interpretación ambigua y negaciones. |
| Informe técnico completo | Distribución entre problema, diagnóstico, actividades, resultado y recomendaciones. Pruebas unitarias aprobadas. | Narración sin puntuación y conservación visible del original. |
| Lectura de tareas | Generación de guion, solicitud de audio y reproducción. | El guion recorta contenido y puede omitir secciones completas. |
| Resumen hablado | Conteos, tareas en progreso y hasta cinco tareas para mencionar. | Reproducción real; antigüedad de tareas en progreso no ordenada explícitamente. |
| Alternativa del navegador | `SpeechSynthesis`, idioma `es-ES`, ante errores de síntesis remota. | Disponibilidad y comportamiento en navegadores reales. |
| Confirmación humana | Los endpoints de dictado devuelven borradores; guardar requiere una acción posterior. | Evitar que la revisión conserve asociaciones anteriores inadvertidamente. |
| Protección de rutas | Pruebas locales aprobadas; tres rechazos anónimos comprobados en producción. | Roles y aislamiento autenticado en el despliegue. |

La cobertura frontend descrita en esta tabla **fue inspeccionada, pero no ejecutada**.

La correspondencia con historias queda así:

| Historias | Código existente | Evidencia actual y faltantes |
|---|---|---|
| HU01–HU02 | Registro, login, logout, JWT y versión de token. | Regresión simulada parcial; no revalidé todos los criterios ni persistencia real. |
| HU03–HU05 | Equipos, creación y consulta de tareas por propietario. | Código y regresión simulada; falta aceptación completa por criterio. |
| HU06 | Transiciones de estado y bloqueo de edición al completar. | Unitarias y regresión backend aprobadas. |
| HU07 | Problema y diagnóstico persistibles. | Código y regresión simulada de documentación. |
| **HU08** | Actividades y resultado. | Sigue pendiente determinar la **fecha de actividad** exigida por CA-HU08-04; `createdAt`/`updatedAt` no resuelven automáticamente ese criterio. |
| HU09 | Evidencias con validación y acceso autorizado. | Pruebas aprobadas; incompatibilidad de tamaño con Vercel pendiente. |
| HU10–HU11 | Historial y detalle de intervenciones. | Regresión backend aprobada; frontend y persistencia real no reejecutados. |
| **HU12** | Supervisión y asignación administrativa. | Persiste la diferencia con CA-HU12-05: la pantalla también permite crear/asignar tareas. |
| HU13 propuesta | Dictado individual. | Implementada; falta validación real y corrección del ciclo del micrófono. |
| HU14 propuesta | Tareas por voz. | Implementada y parser probado; conservación de texto pendiente. |
| HU15 propuesta | Informes por voz. | Implementada y probada con textos preparados; narración libre pendiente. |
| HU16 propuesta | Asignación por voz. | Implementada; defectos de ambigüedad y selección previa reproducidos. |
| HU17 propuesta | Lectura y resumen. | Implementada; lectura completa y reproducción real pendientes. |

Jira devolvió **401** al consultar MGDST-1–MGDST-12. Por eso, los criterios pendientes anteriores proceden de la documentación versionada, especialmente [07-pruebas.md](https://github.com/flowxter/tech-track/blob/92abf9d/docs/07-pruebas.md), y no de una nueva lectura de Jira. Los resultados históricos de 57/59 criterios **no son resultados nuevos de esta auditoría**. HU13–HU17 permanecen como propuestas.

**3. Tabla de hallazgos**

Clasificación de evidencia: **R** = reproducido con datos o APIs simulados; **C** = comprobado por inspección del código; **P** = riesgo cuya manifestación real no fue verificada.

Los enlaces apuntan a la versión remota auditada.

| ID | Gravedad | Archivo | Problema | Evidencia | Impacto | Solución recomendada |
|---|---|---|---|---|---|---|
| A01 | Alto | [assemblyAiClient.ts:5](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/assemblyAiClient.ts#L5) | Configura `universal-3-pro`, modelo con retirada/incompatibilidad anunciada oficialmente. | **C/P:** el mock exige ese mismo valor antiguo; no hubo llamada real. | Puede bloquear todas las funciones de dictado. | Elegir un modelo vigente compatible con español y actualizar la prueba de contrato. |
| A02 | Alto | [useVoiceRecorder.ts:40](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/voice/useVoiceRecorder.ts#L40) | Constructor e inicio de `MediaRecorder` quedan fuera del manejo de errores; tampoco se bloquean inicios concurrentes. | **R:** fallo del constructor dejó un stream abierto; dos inicios dejaron uno sin liberar al desmontar. | Micrófono activo después del fallo o cierre. | Estado de inicialización, exclusión de inicios simultáneos y limpieza garantizada de tracks, temporizador y recorder. |
| A03 | Alto | [taskDictation.ts:34](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/taskDictation.ts#L34) | La longitud de nombres parciales decide entre personas mencionadas; no interpreta negaciones. | **R:** “Técnico Juan o Carlos” seleccionó Carlos; “no asignar a Juan Pérez” seleccionó Juan. | Propone una asignación incorrecta. | Ante varias personas o negación, devolver selección pendiente y advertencia explícita. |
| A04 | Alto | [AssignmentForm.tsx:33](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/components/AssignmentForm.tsx#L33), [NewTaskForm.tsx:22](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/components/NewTaskForm.tsx#L22) | Los valores `null` del nuevo borrador no limpian asociaciones anteriores. | **R** en asignación: un borrador ambiguo conservó técnico Ana y equipo PC-001 previamente seleccionados. **C** en nueva tarea. | El formulario puede guardar una asociación que el dictado actual no identificó. | Invalidar asociaciones no resueltas o exigir reconfirmación explícita antes de guardar. |
| A05 | Medio | [taskDictation.ts:61](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/taskDictation.ts#L61) | Contenido de secciones de equipo/técnico no utilizado en la asociación desaparece del borrador. | **R:** “Equipo PC-001 no enciende. Título: revisar” produjo descripción vacía. | Se pierde el síntoma dictado. | Conservar texto residual y ofrecer el original para revisión. |
| A06 | Medio | [taskDictation.ts:68](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/taskDictation.ts#L68), [appendDictation.ts](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/voice/appendDictation.ts) | Recortes silenciosos de título, descripción y campos. | **R:** un título explícito largo perdió su final; un campo lleno descartó todo el dictado añadido. | Información incompleta sin aviso al usuario. | Avisar del exceso y conservarlo en un borrador recuperable. |
| A07 | Medio | [spokenText.ts:25](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/spokenText.ts#L25) | La separación depende de puntuación antes de los marcadores. | **R:** sin puntuación, actividades y resultado quedaron dentro del diagnóstico. | Informe distribuido incorrectamente. | Advertir cuando no se reconoce una estructura fiable y permitir revisar el texto completo. |
| A08 | Medio | [voiceScripts.ts:22](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/voice/voiceScripts.ts#L22) | “Leer tarea” limita todo el guion a 2.500 caracteres y retrocede hasta una frase anterior. | **R:** con diagnóstico largo, devolvió solamente 71 caracteres, omitiendo diagnóstico, actividades, resultado y recomendaciones. | La lectura aparentemente completa puede excluir información esencial. | Dividir en segmentos reproducibles y anunciar cualquier omisión. |
| A09 | Medio | [voice.routes.ts:24](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/voice.routes.ts#L24) | El cupo usa almacenamiento en memoria del proceso. | **C/P:** no se configura un almacén compartido. | Reinicios o varias instancias serverless impiden garantizar 60 solicitudes por cuenta cada 15 minutos. | Si el cupo debe ser efectivo, persistir su control; documentar entretanto su alcance real. |
| A10 | Medio | [useSpeechPlayer.ts:41](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/voice/useSpeechPlayer.ts#L41), [api.ts:35](https://github.com/flowxter/tech-track/blob/92abf9d/front/src/api.ts#L35) | Detener o cerrar el reproductor descarta resultados, pero no cancela individualmente la solicitud; el backend tampoco propaga la desconexión al proveedor. | **C/P:** la señal HTTP corresponde a toda la sesión. | Trabajo y posible consumo remoto después de cancelar. | Cancelación por operación y propagación al cliente externo cuando corresponda. |
| A11 | Medio | [assemblyAiClient.ts:25](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/assemblyAiClient.ts#L25), [elevenLabsClient.ts:29](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/elevenLabsClient.ts#L29), [voice.routes.ts:55](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/voice/voice.routes.ts#L55) | Respuestas externas asumidas mediante tipos; audio entrante validado solo por MIME declarado; MP3 saliente sin comprobación de contenido vacío. | **C/P.** | Errores tardíos y mensajes poco precisos ante respuestas o archivos inválidos. | Validaciones mínimas de estructura, tamaño y contenido antes de continuar. |
| A12 | Medio | [front/package.json](https://github.com/flowxter/tech-track/blob/92abf9d/front/package.json), [regression.mjs:10](https://github.com/flowxter/tech-track/blob/92abf9d/front/tests/regression.mjs#L10) | La regresión requiere una dependencia externa ausente del manifiesto y lockfile. | **Comprobado:** `MODULE_NOT_FOUND: playwright` después de `npm ci`. | Una instalación limpia no reproduce la QA frontend. | Declarar una dependencia de pruebas fijada y documentar la instalación del navegador. |
| A13 | Medio | [task.routes.ts:16](https://github.com/flowxter/tech-track/blob/92abf9d/back/src/modules/tasks/task.routes.ts#L16) | Evidencias de hasta 5 MiB frente al límite de payload de Vercel. | **C:** incompatibilidad documentada; no se cargaron archivos en producción. | Archivos admitidos por la aplicación pueden ser rechazados por la plataforma. | Ajustar el tamaño efectivo, incluyendo multipart, y probar su frontera. |
| A14 | Bajo | [08-despliegue.md](https://github.com/flowxter/tech-track/blob/92abf9d/docs/08-despliegue.md), [README.md](https://github.com/flowxter/tech-track/blob/92abf9d/README.md) | Documentación desactualizada respecto a conexión MongoDB, publicación y numeración HU10/HU11. | **C:** despliegue sigue registrado como pendiente; README invierte esas dos HU respecto al backlog. | Confusión al reproducir y presentar evidencias. | Actualizar trazabilidad y registro del despliegue sin modificar criterios originales. |

No comprobé un defecto de gravedad crítica. Los hallazgos altos justifican corregir y revalidar antes de entregar.

**4. Resultados de pruebas**

Ejecutadas sobre la copia temporal del commit auditado, con Node.js `22.18.0` y dependencias instaladas mediante los lockfiles existentes.

| Comando o comprobación | Resultado |
|---|---|
| `npm ci --prefix back --ignore-scripts --no-audit --no-fund` | Aprobado. |
| `npm ci --prefix front --ignore-scripts --no-audit --no-fund` | Aprobado. |
| `npm run build --prefix back` | Aprobado. |
| `npm run build --prefix front` | Aprobado. |
| `npm test --prefix back`, primera ejecución restringida | **23 aprobadas, 10 fallidas** por `fetch failed` contra localhost. |
| Mismo comando, repetido fuera de la restricción de red | **33 aprobadas, 0 fallidas, 0 omitidas.** |
| `npm run test:regression --prefix front` | Falló el arranque por Playwright ausente: **0 casos ejecutados; 18 pendientes**, ocho específicos de voz. |
| Comprobaciones diagnósticas adicionales mediante Node/VM | **10 reproducciones confirmadas** de los comportamientos descritos; sin crear archivos de pruebas. |
| HTTP público | Frontend y recursos: 200; tres rutas anónimas: 401; preflight: 204 y origen esperado. |
| Correspondencia del frontend publicado | SHA-256 idéntico para el JavaScript y CSS comparados. |

Las 33 pruebas backend incluyen seis de imágenes/estados, 17 unitarias de voz y diez de regresión HTTP.

**Alcance de las simulaciones:** `fetch` sustituido para proveedores; modelos y conexión Mongoose simulados en regresión. Los mensajes “Conexión con MongoDB establecida” emitidos durante esas pruebas **no acreditan conexión real con Atlas**.

Tampoco acredita una llamada real el nombre del test “transcripción real de AssemblyAI”: ejecuta un texto preparado.

No se ejecutaron:

- Transcripción o síntesis con credenciales reales.
- Persistencia y recarga con Atlas real.
- Captura con micrófono físico.
- Compatibilidad efectiva en Safari, Firefox, Chrome y móviles.
- Regresión frontend completa, reproducción audible o sesiones autenticadas de producción.

Las reproducciones con React, MediaRecorder y estado simulados comprueban rutas lógicas; no sustituyen pruebas en navegador.

**5. Problemas de integración**

**AssemblyAI.** El flujo REST de upload → creación → polling, la autorización del servidor y `language_code: 'es'` corresponden al mecanismo documentado. Existe un tiempo máximo global de 50 segundos y tratamiento de silencio, texto vacío y fallo remoto.

El punto prioritario es `speech_models: ['universal-3-pro', 'universal-2']`. La documentación actual recomienda `universal-3-5-pro`, y el changelog anuncia errores para solicitudes fijadas al modelo anterior. Es una **incompatibilidad documentada que requiere atención inmediata**, aunque no comprobé el resultado de esa combinación con la cuenta del proyecto. [Selección actual de modelos](https://www.assemblyai.com/docs/pre-recorded-audio/select-the-speech-model), [anuncio de migración](https://www.assemblyai.com/changelog?3b7e7275_page=3).

El fallback de modelos sirve para idiomas soportados; no debe suponerse que recuperará automáticamente un identificador retirado. Además, los errores HTTP, incluido 429, se convierten inmediatamente en 502: no hay tratamiento de `Retry-After` ni recuperación del trabajo tras timeout.

**ElevenLabs.** Endpoint, cabecera `xi-api-key`, texto y `model_id` coinciden con la API oficial. Hay timeout de 30 segundos y alternativa en el navegador. No detecté una incompatibilidad equivalente a la de AssemblyAI. Permanecen sin validar voz disponible para la cuenta, permisos, cuota y audio real. [Referencia oficial](https://elevenlabs.io/docs/api-reference/text-to-speech/convert).

La reproducción atiende finalización y rechazo inicial de `play()`, pero no instala un manejador de error del elemento de audio durante la reproducción. El fallback se intenta ante cualquier fallo remoto, incluidos errores de autorización: conviene distinguir recuperación de voz de problemas de sesión.

**MongoDB.** El `main` remoto ya incorpora conexión reutilizable, recuperación ante fallo y conexión previa en autenticación; `/api/health` también espera la conexión. Por tanto, el problema de inicialización descrito como pendiente en la guía **no debe darse por vigente sin contrastarlo con este código**.

No verifiqué red de Atlas, permisos, índices existentes ni persistencia real.

**Vercel.** El límite de audio de 4 MiB deja margen nominal frente a 4,5 MB para multipart; el límite de evidencias de 5 MiB no es compatible en toda su extensión. La documentación oficial establece el límite de payload de 4,5 MB. [Límites de Functions](https://vercel.com/docs/functions/limitations).

El timeout de 50 segundos de AssemblyAI **no demuestra por sí solo incompatibilidad serverless**: Vercel documenta duraciones actuales superiores, dependiendo de la configuración. Falta verificar la duración efectiva del proyecto y contemplar recepción, autenticación y consultas adicionales.

El frontend publicado utiliza `https://tech-track-drab.vercel.app/api`. Su correspondencia binaria con el build auditado es fuerte evidencia sobre los dos recursos comparados; **no prueba el commit del backend**, sus variables privadas ni su configuración operativa.

**6. Revisión de arquitectura**

La arquitectura es suficiente para el MVP2 y no necesita una reescritura.

Aspectos favorables:

- Clientes de proveedores separados y con transporte inyectable.
- Parsers puros, fáciles de probar.
- Componentes reutilizables para dictado y lectura.
- TypeScript estricto, validación Zod de entradas y errores HTTP centralizados.
- Autenticación antes del procesamiento de voz y rol administrativo antes de recibir asignaciones.
- Selección de equipos propios y validación posterior de la relación técnico–equipo al guardar.
- Credenciales ubicadas en el backend; sin claves de proveedores encontradas en el código frontend revisado.
- Desmontaje del espacio de sesión y aborto de su transporte al reemplazarla.

Las debilidades se concentran en los límites entre esas piezas: el parser devuelve selecciones sin expresar ambigüedad, el formulario conserva valores anteriores, el texto original se devuelve pero no se presenta para revisión, y los hooks no cubren todos los estados asíncronos.

La confirmación humana existe y reduce el riesgo, pero no compensa por completo una propuesta incorrecta presentada como selección válida.

La normalización de acentos y dígitos ayuda con “PC cero cero uno”; no resuelve errores como “PC ciento uno”, homófonos, negaciones o nombres alternativos. Es preferible pedir selección manual ante incertidumbre antes que ampliar reglas frágiles indiscriminadamente.

En privacidad, el README informa del envío a proveedores y el servidor devuelve mensajes generales. Quedan por comprobar políticas de retención aplicables y contenido efectivo de logs. No hay evidencia suficiente para afirmar una fuga de credenciales.

**7. Plan de correcciones priorizado**

Estimaciones orientativas para una persona, incluyendo verificación; no incluyen esperas por accesos externos.

| Orden | Hallazgos y archivos | Esfuerzo | Criterio de aceptación |
|---|---|---:|---|
| 1 | A01: cliente y pruebas AssemblyAI | 1–3 h | Modelo vigente para español; prueba de contrato actualizada; validación real posterior, expresamente autorizada. |
| 2 | A02: `useVoiceRecorder`, `DictationButton` | 3–5 h | Constructor, inicio, error, permiso tardío, doble clic y cierre dejan todos los tracks detenidos. |
| 3 | A03–A04: parser y formularios | 4–7 h | Ambigüedad o negación no asignan automáticamente; no persisten asociaciones anteriores sin reconfirmación. |
| 4 | A05–A07: parsers, aplicación del borrador y límites | 4–7 h | Todo texto queda recuperable; recortes y secciones inciertas se avisan antes de guardar. |
| 5 | A08 y reproducción: guiones y reproductor | 3–5 h | Tarea larga se lee por segmentos, sin omisiones silenciosas; errores liberan recursos. |
| 6 | A10–A11: API, rutas y clientes | 3–5 h | Cancelación por operación; respuestas malformadas, audio vacío y errores temporales tienen tratamiento comprobable. |
| 7 | A09 y A13: cuotas y tamaños | 3–6 h | Cuota con alcance definido; tamaños admitidos compatibles con Vercel y probados en sus fronteras. |
| 8 | A12 y A14: dependencias de pruebas y documentación | 2–4 h | Instalación limpia reproduce los 18 casos frontend; documentación identifica versiones y limitaciones vigentes. |

No propondría introducir webhooks, colas u otro servicio únicamente por anticipación. Primero conviene medir si los dictados admitidos terminan de forma fiable dentro del plazo configurado.

**8. Checklist final antes de entregar**

- [ ] Identificar y registrar commits del frontend y backend publicados.
- [ ] Actualizar y validar la selección de modelo de AssemblyAI.
- [ ] Ejecutar la regresión frontend desde una instalación reproducible.
- [ ] Probar audio real en los navegadores y dispositivos de la demostración.
- [ ] Verificar permisos denegados, permiso concedido tarde, doble clic, cierre y logout durante grabación.
- [ ] Confirmar que el indicador del micrófono desaparece en todos esos recorridos.
- [ ] Probar nombres ambiguos, negaciones, equipos repetidos y equipos ajenos.
- [ ] Confirmar que un segundo dictado no conserva asociaciones incorrectas.
- [ ] Revisar narraciones con poca puntuación y campos cerca de sus límites.
- [ ] Escuchar una tarea larga hasta resultado y recomendaciones.
- [ ] Comprobar detener lectura, cerrar detalle, cambiar de sesión y alternativa del navegador.
- [ ] Validar timeout, 429, falta de cuota, silencio y archivo inválido.
- [ ] Comprobar CORS, duración efectiva y límites de payload de Vercel.
- [ ] Verificar persistencia autorizada en un entorno de pruebas con Atlas.
- [ ] Mantener explícitos los pendientes originales de HU08 y HU12.
- [ ] Presentar HU13–HU17 como propuestas hasta su aprobación formal.

**Auditoría terminada. No implementé correcciones; quedo a la espera de tu autorización.**
