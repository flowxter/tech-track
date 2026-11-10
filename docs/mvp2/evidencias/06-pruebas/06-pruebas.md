# 06. Pruebas — TechTrack MVP2

## 1. Objetivo

Verificar las funcionalidades de reconocimiento y síntesis de voz incorporadas en TechTrack MVP2 (HU13–HU17), su integración con los componentes existentes y la estabilidad del sistema después de las correcciones realizadas.

El proceso de validación incluyó auditorías técnicas con Codex, pruebas automatizadas de backend y frontend, pruebas de regresión y verificaciones manuales con servicios reales de reconocimiento de voz.

Las pruebas permitieron identificar defectos, comprobar las correcciones y reducir el riesgo de introducir errores en funcionalidades previamente implementadas.

## 2. Resultados de las pruebas automatizadas

Durante el desarrollo se realizaron diferentes ejecuciones de pruebas. Se conservan los resultados históricos para mostrar la evolución del proceso de validación.

### 2.1. Auditoría inicial y primera corrección

| Indicador                                 |             Auditoría inicial |                         Primera corrección |
| ----------------------------------------- | ----------------------------: | -----------------------------------------: |
| Pruebas backend aprobadas                 |                     **33/33** |                                  **52/52** |
| Pruebas frontend aprobadas                |                 No ejecutadas |                                  **32/32** |
| Pruebas fallidas en las suites ejecutadas |                             0 |                                          0 |
| Situación del frontend                    |       Playwright no instalado | Dependencia instalada y regresión aprobada |
| Comprobaciones diagnósticas adicionales   | 10 reproducciones de defectos | Correcciones y casos de regresión añadidos |

En la auditoría inicial, Codex identificó **14 hallazgos técnicos (A01–A14)** relacionados con la integración de voz, el manejo del micrófono, la interpretación de dictados y la cobertura de pruebas.

Después de revisar los hallazgos, el equipo autorizó inicialmente la corrección de cinco: **A01, A02, A03, A04 y A12**.

La primera implementación de estas correcciones incorporó 19 casos backend y 14 frontend, además de actualizar las pruebas de contrato de AssemblyAI.

Como resultado, se obtuvieron **52 pruebas backend y 32 frontend aprobadas**, sin pruebas fallidas ni omitidas, según los resultados reportados por Codex.

### 2.2. Ejecuciones posteriores independientes

| Ejecución             |     Backend |  Frontend | Alcance adicional                                                                                     |
| --------------------- | ----------: | --------: | ----------------------------------------------------------------------------------------------------- |
| Revisión A02/A04      |   **52/52** | **40/40** | Finalización de grabaciones, manejo de audio vacío, liberación del micrófono y dictados consecutivos. |
| Revisión A03          |   **72/72** | **40/40** | 20 pruebas backend adicionales sobre negaciones, antecedentes y asignaciones ambiguas.                |
| Corrección final HU16 | **114/114** | **40/40** | 42 pruebas adicionales sobre interpretación de asignaciones mediante lenguaje natural.                |

Todas estas ejecuciones finalizaron sin pruebas fallidas, según los resultados conservados y reportados durante el desarrollo.

**Resultado de la última ejecución: 114 pruebas backend y 40 frontend aprobadas, para un total de 154 pruebas automatizadas.**

Los resultados corresponden a versiones sucesivas de las suites. **No deben sumarse los totales de diferentes ejecuciones**, ya que las pruebas anteriores permanecen incluidas en las ejecuciones posteriores.

### 2.3. Validación del micrófono y las grabaciones

La revisión A02/A04 incorporó pruebas específicas sobre el ciclo de vida de las grabaciones de audio y la protección de los formularios durante dictados consecutivos.

También se utilizó `MediaRecorder` nativo de Chromium con un dispositivo de audio simulado.

Esta prueba produjo un archivo WebM/Opus de **3.285 bytes**, compuesto por dos fragmentos de 807 y 2.478 bytes, con cabecera EBML válida y una duración de 1,20 segundos de audio decodificable.

Se verificó que el evento final `dataavailable` ocurriera antes de `stop` y que las pistas del dispositivo se cerraran correctamente.

Esta comprobación permitió validar el comportamiento del navegador con una entrada simulada, pero no equivale a una prueba con micrófono físico ni con los proveedores externos.

### 2.4. Comandos y verificaciones

Durante las correcciones se ejecutaron diferentes comandos para validar las dependencias, compilaciones y pruebas.

| Comando o verificación                   | Primera corrección                        | Última corrección HU16            |
| ---------------------------------------- | ----------------------------------------- | --------------------------------- |
| `npm ci --prefix back`                   | Aprobado                                  | No reportado como nueva ejecución |
| `npm ci --prefix front`                  | Aprobado                                  | No reportado como nueva ejecución |
| `npm run test:install --prefix front`    | Chromium instalado                        | No requerido nuevamente           |
| `npm run build --prefix back`            | Aprobado                                  | Aprobado                          |
| `npm run build --prefix front`           | Aprobado                                  | Aprobado                          |
| `npm test --prefix back`                 | 52/52 aprobadas                           | **114/114 aprobadas**             |
| `npm run test:regression --prefix front` | 32/32 aprobadas                           | **40/40 aprobadas**               |
| TypeScript estricto `--strict --noEmit`  | Aprobado                                  | Aprobado                          |
| `npm run lint --prefix front`            | Sin errores; una advertencia preexistente | No reportado como nueva ejecución |
| `git diff --check`                       | Aprobado                                  | Aprobado                          |

Las pruebas abarcaron reconocimiento e interpretación de dictados, asociaciones entre técnicos y equipos, seguridad de las asignaciones, control del micrófono, manejo de errores y regresiones de funcionalidades existentes.

**Los proveedores externos y la persistencia se simularon durante las pruebas automatizadas.** Por esta razón, sus resultados no acreditan por sí solos llamadas reales a AssemblyAI, ElevenLabs o MongoDB Atlas.

## 3. Corrección de HU16 y pruebas con lenguaje natural

Durante las verificaciones manuales se identificó una limitación en la interpretación de asignaciones administrativas mediante voz.

Por ejemplo, AssemblyAI transcribía correctamente una instrucción como:

`Asigna a Juan equipo PC001.`

Sin embargo, la lógica de interpretación devolvía los identificadores de técnico y equipo como `null`.

El diagnóstico determinó que el problema se encontraba en el parser de TechTrack, debido a que algunas expresiones naturales no se reconocían y la separación de los campos dependía de determinados patrones de puntuación.

### 3.1. Corrección implementada

Codex implementó una modificación específica en `taskDictation.ts`, sin alterar globalmente el parser compartido.

Las mejoras incluyeron:

- Reconocer expresiones como «Asigna a Juan el equipo PC001».
- Interpretar asignaciones sin depender exclusivamente de la puntuación.
- Identificar primero al técnico cuando la instrucción es inequívoca.
- Buscar el equipo dentro de los equipos asociados al técnico identificado.
- Mantener la selección manual ante nombres duplicados, negaciones o instrucciones contradictorias.
- Conservar la confirmación humana antes de guardar una asignación.

### 3.2. Pruebas de regresión

Se añadieron **42 pruebas backend** relacionadas con las nuevas expresiones, identificadores repetidos entre propietarios, técnicos con nombres duplicados, negaciones y antecedentes descriptivos.

Los resultados finales reportados fueron:

| Validación                | Resultado             |
| ------------------------- | --------------------- |
| Backend                   | **114/114 aprobadas** |
| Frontend                  | **40/40 aprobadas**   |
| Builds backend y frontend | Correctos             |
| TypeScript estricto       | Sin errores           |
| `git diff --check`        | Sin errores           |

Estas pruebas permitieron verificar que la nueva interpretación no afectara las protecciones existentes de asignaciones ambiguas ni el comportamiento de los dictados consecutivos.

## 4. Pruebas manuales del flujo completo

El equipo reportó la realización de pruebas funcionales en localhost utilizando los servicios de voz, complementando las verificaciones automatizadas.

Las funcionalidades consideradas en el recorrido fueron:

| HU       | Funcionalidad                      | Verificación                                                                                      |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| **HU13** | Dictado individual                 | Transcribir audio en campos editables y conservar el contenido previo.                            |
| **HU14** | Creación de tareas mediante voz    | Generar un borrador, revisar los campos y confirmar el registro.                                  |
| **HU15** | Documentación técnica mediante voz | Distribuir la transcripción entre las secciones del informe.                                      |
| **HU16** | Asignación administrativa por voz  | Identificar técnico y equipo, controlar ambigüedades y confirmar la asignación.                   |
| **HU17** | Lectura de tareas y resúmenes      | Reproducir información mediante audio y utilizar la alternativa del navegador cuando corresponda. |

### 4.1. Incidencia durante las pruebas

Durante las pruebas de reconocimiento de voz se presentó una respuesta HTTP `422`.

El equipo relacionó inicialmente esta situación con la configuración del dispositivo de entrada de audio. Después de revisar la selección del micrófono en el navegador, reportó que pudo realizar la transcripción correctamente.

Esta experiencia permitió identificar la importancia de revisar permisos, dispositivos de entrada, contenido de las grabaciones y configuración del entorno antes de atribuir un error directamente al código.

El registro técnico completo de esta incidencia continúa pendiente de adjuntarse; por tanto, la causa se conserva como diagnóstico reportado por el equipo.

### 4.2. Validación manual de HU16

Las pruebas realizadas con AssemblyAI real permitieron comprobar que la transcripción de instrucciones y su interpretación son procesos diferentes.

Se verificaron instrucciones estructuradas y expresiones naturales de asignación, así como situaciones en las que existían técnicos con nombres repetidos.

En estos casos, TechTrack mantuvo la selección manual cuando no podía identificar inequívocamente al destinatario de una tarea.

Los resultados de estas verificaciones contribuyeron a identificar la necesidad de la corrección final de HU16 y a comprobar posteriormente su comportamiento.

Las pruebas manuales no constituyen una medición estadística de precisión del reconocimiento de voz ni reemplazan las pruebas de regresión.

## 5. Control de versiones e integración de las correcciones

Las correcciones derivadas de la auditoría se desarrollaron en una rama independiente:

`fix/mvp2-voz-estabilidad`

La última corrección de HU16 fue publicada mediante el commit:

`021d185` — `fix: mejorar interpretación de asignaciones por voz`

Después de ejecutar las verificaciones y realizar las pruebas manuales, el equipo autorizó integrar las correcciones mediante el **Pull Request #4**.

- **Repositorio:** [https://github.com/flowxter/tech-track](https://github.com/flowxter/tech-track)
- **Pull Request:** [https://github.com/flowxter/tech-track/pull/4](https://github.com/flowxter/tech-track/pull/4)
- **Estado:** fusionado y cerrado.
- **Commit de integración:** `040287d`
- **Rama de destino:** `main`.
- **Fecha de integración:** 9 de noviembre de 2026, hora de Colombia.

De esta manera, las correcciones de estabilidad, los nuevos casos de regresión y la documentación del MVP2 quedaron incorporados a la rama principal.

Después de la integración, GitHub registró verificaciones exitosas de Vercel para el commit correspondiente.

Estas verificaciones confirman el resultado del proceso de despliegue, pero no sustituyen una comprobación funcional completa de la aplicación publicada.

## 6. Evidencias y limitaciones

La documentación de las pruebas automatizadas se conserva en:

`docs/mvp2/evidencias/06-pruebas/reportes-automatizados/resultados-codex.md`

Adicionalmente, está pendiente incorporar el registro integral de las pruebas manuales en:

`docs/mvp2/evidencias/06-pruebas/pruebas-reales/flujo-completo-mvp2.md`

Este registro deberá incluir el entorno utilizado, la versión del código, los escenarios probados, los resultados observados y las capturas o grabaciones auténticas disponibles.

### Limitaciones de la validación

- Las pruebas automatizadas utilizaron servicios externos y persistencia simulados.
- La comprobación nativa del audio utilizó Chromium con una entrada simulada.
- Las pruebas con AssemblyAI real fueron realizadas manualmente por el equipo.
- No se realizó una medición estadística de precisión de transcripción.
- No se midió el ahorro de tiempo de registro frente al procedimiento manual.
- Los resultados automatizados no equivalen a la aceptación formal de las historias de usuario.
- La integración a `main` y los resultados exitosos de Vercel no garantizan por sí solos que todos los escenarios funcionen en producción.

La aceptación definitiva de HU13–HU17 debe contrastarse con sus criterios establecidos en Jira y con las evidencias funcionales correspondientes.

##
