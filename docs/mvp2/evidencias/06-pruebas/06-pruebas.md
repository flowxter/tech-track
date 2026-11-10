# 06. Pruebas — TechTrack MVP2

## 1. Objetivo

Verificar las funcionalidades de reconocimiento y síntesis de voz (HU13–HU17), su integración con TechTrack y la estabilidad de los componentes existentes.

## 2. Resultados de las pruebas automatizadas

Se conservan las dos ejecuciones históricas de Codex: una **auditoría inicial**, sin modificar código, y una **primera validación posterior a la corrección** de los hallazgos A01, A02, A03, A04 y A12. Las revisiones posteriores se presentan por separado.

| Indicador | Auditoría inicial | Después de las correcciones |
|---|---:|---:|
| Pruebas backend aprobadas | **33** | **52** |
| Pruebas backend fallidas (resultado final) | 0 | 0 |
| Pruebas frontend aprobadas | 0 ejecutadas | **32** |
| Pruebas frontend fallidas (resultado final) | No se ejecutaron | 0 |
| Situación de frontend | Faltaba la dependencia Playwright | Instalación y regresión aprobadas |
| Comprobaciones diagnósticas adicionales | 10 reproducciones de defectos | Correcciones y casos de regresión añadidos |

**Resultado final de la primera corrección: 52/52 pruebas backend y 32/32 frontend aprobadas, sin pruebas fallidas ni omitidas**, según el informe entregado por Codex. Se incorporaron **19 casos backend y 14 frontend** y se actualizó la prueba de contrato del modelo de AssemblyAI. Los 14 casos frontend se añadieron a los 18 que ya existían, aunque no habían podido ejecutarse en la auditoría inicial.

### Ejecuciones posteriores independientes

| Ejecución | Backend | Frontend | Fallidas y omitidas en la ejecución final | Alcance adicional |
|---|---:|---:|---|---|
| Revisión de A02 y A04 | **52/52** | **40/40** | 0 fallidas y 0 omitidas en ambas suites | Finalización del audio, plazo de seguridad sin `onstop`, Blob vacío y dictados consecutivos con o sin edición manual. |
| Revisión posterior de A03 | **72/72** | **40/40** | 0 fallidas y 0 omitidas en ambas suites | 20 casos backend adicionales sobre negaciones del síntoma, antecedentes con nombres, asignación explícita e inferencia del propietario. |

Estos resultados constan en salidas reales del terminal del historial de trabajo. No son nuevas ejecuciones realizadas para esta actualización documental y no se ha creado un log original retrospectivo. Cada fila corresponde a una versión sucesiva de las suites: **sus totales no se suman entre ejecuciones**.

La revisión A02/A04 incluyó `MediaRecorder` nativo de Chromium, con dispositivo de audio simulado. La grabación produjo un WebM/Opus de **3.285 bytes**, con dos fragmentos de **807 y 2.478 bytes**, cabecera EBML válida y **1,20 segundos** de audio decodificable. El evento final `dataavailable` precedió a `stop`; las pistas se cerraron antes de entregar el Blob. Esto valida el encoder del navegador con entrada simulada, no un micrófono físico ni los servicios externos.

### Comandos y verificaciones reportados

| Comando o verificación | Resultado posterior a la corrección |
|---|---|
| `npm ci --prefix back` y `npm ci --prefix front` (con opciones de instalación segura) | Aprobados |
| `npm run test:install --prefix front` | Chromium instalado |
| `npm run build --prefix back` | Aprobado |
| `npm run build --prefix front` | Aprobado |
| `npm test --prefix back` | **52 aprobadas, 0 fallidas** |
| `npm run test:regression --prefix front` | **32 aprobadas, 0 fallidas** |
| Comprobación TypeScript `--strict --noEmit` | Aprobada |
| `npm run lint --prefix front` | Sin errores; una advertencia preexistente |
| `git diff --check` | Aprobado |

Las pruebas cubrieron interpretación de dictados, identificación y ambigüedad de técnicos, asociaciones entre formularios, contratos de voz, control y liberación del micrófono, así como regresiones de funcionalidades existentes. **Los proveedores externos y la persistencia fueron simulados.** La captura combinó dispositivos simulados con pruebas de fallos mediante una clase ficticia y la comprobación nativa de Chromium descrita arriba; los totales no acreditan llamadas reales a AssemblyAI ni a ElevenLabs.

## 3. Prueba del flujo completo

**El equipo reportó una prueba satisfactoria del flujo completo de TechTrack**, pero falta adjuntar el registro que permita corroborarla: acceso, selección de equipos, creación y asignación de tareas, registro de documentación técnica y consulta de información. Las funciones de voz incluidas en ese reporte son:

1. **HU13:** dictado en campos individuales.
2. **HU14:** creación de un borrador de tarea por voz, revisión y guardado.
3. **HU15:** dictado de un informe técnico y distribución por secciones.
4. **HU16:** asignación administrativa de tareas por voz, con confirmación humana.
5. **HU17:** lectura de tareas y resúmenes hablados.

El equipo también reportó un error `422` y lo atribuyó a un micrófono que registraba silencio; indicó que elegir la entrada correcta permitió transcribir. Sin el registro del audio y de la comprobación, la causa se mantiene como diagnóstico reportado, no como una conclusión corroborada por esta documentación.

## 4. Evidencias y límites

La demostración práctica presentará el flujo completo con los servicios de voz. **Archivo pendiente de adjuntar:** `docs/mvp2/evidencias/06-pruebas/pruebas-reales/flujo-completo-mvp2.md`. Debe describir el entorno y la versión utilizados, los casos HU13–HU17, los pasos y resultados observados, y las capturas o grabaciones auténticas que los respalden. También debe registrar qué se observó en el incidente `422`. No se creó ese archivo, ninguna captura ni una plantilla durante esta actualización.

Los resultados de Codex corresponden a la **rama local de correcciones** y no demuestran que sus cambios se hayan fusionado a `main` o publicado en Vercel. La demo complementa las pruebas automatizadas, pero la aprobación definitiva debe contrastarse con los criterios de aceptación de HU13–HU17.
