# Resultados automatizados reportados por Codex — MVP2

## 1. Evolución de las pruebas automatizadas

Durante el desarrollo del MVP2 de TechTrack se realizaron diferentes auditorías, correcciones y ejecuciones de pruebas automatizadas con apoyo de Codex.

Los resultados se presentan cronológicamente para evidenciar cómo evolucionó la validación del sistema.

| Ejecución | Backend | Frontend | Observaciones |
|---|---|---|---|
| Auditoría inicial | 33/33 aprobadas | No ejecutadas | Playwright no estaba instalado; se realizaron 10 reproducciones diagnósticas adicionales. |
| Primera corrección A01, A02, A03, A04 y A12 | 52/52 aprobadas | 32/32 aprobadas | Se añadieron 19 casos backend y 14 frontend. Builds y TypeScript aprobados. |
| Revisión posterior A02/A04 | 52/52 aprobadas | 40/40 aprobadas | Mejoras en el control del micrófono, finalización de grabaciones y dictados consecutivos. |
| Revisión posterior A03 | 72/72 aprobadas | 40/40 aprobadas | Se añadieron 20 casos backend sobre negaciones, antecedentes y asignaciones ambiguas. |
| Corrección final HU16 | **114/114 aprobadas** | **40/40 aprobadas** | Se añadieron 42 pruebas de regresión para mejorar la interpretación de asignaciones mediante lenguaje natural. |

**Resultado de la última ejecución reportada: 154 pruebas automatizadas aprobadas, sin pruebas fallidas.**

Los resultados corresponden a ejecuciones sucesivas de las suites. Por lo tanto, los totales de diferentes etapas no deben sumarse entre sí.

## 2. Comandos de la primera ejecución de corrección

Después de implementar las primeras correcciones, Codex ejecutó las siguientes verificaciones:

| Comando | Resultado |
|---|---|
| `npm run build --prefix back` | Aprobado |
| `npm run build --prefix front` | Aprobado |
| `npm test --prefix back` | 52 aprobadas, 0 fallidas, 0 omitidas |
| `npm run test:regression --prefix front` | 32 aprobadas, 0 fallidas, 0 omitidas |
| `npm run test:install --prefix front` | Instalación de Chromium completada |
| `npm run lint --prefix front` | Sin errores; una advertencia preexistente |
| `git diff --check` | Aprobado |

También se verificó TypeScript en modo estricto, sin errores.

## 3. Revisiones posteriores

Las revisiones adicionales se enfocaron en corregir problemas identificados durante la auditoría.

| Verificación | Revisión A02/A04 | Revisión A03 |
|---|---|---|
| Pruebas backend | 52/52 aprobadas | 72/72 aprobadas |
| Pruebas frontend | 40/40 aprobadas | 40/40 aprobadas |
| Build backend | Aprobado | Aprobado |
| Build frontend | Aprobado | No repetido en esa revisión |
| TypeScript estricto | Aprobado | Sin nueva ejecución documentada |
| Resultado | Sin pruebas fallidas ni omitidas | Sin pruebas fallidas ni omitidas |

La revisión A02/A04 incorporó pruebas relacionadas con la finalización de grabaciones, liberación del micrófono, manejo de audio vacío y protección de cambios manuales durante dictados consecutivos.

También se comprobó la generación de audio mediante `MediaRecorder` nativo de Chromium utilizando una entrada simulada.

La revisión A03 amplió las pruebas relacionadas con asignaciones ambiguas, negaciones, menciones de técnicos dentro de descripciones e identificación segura de usuarios.

## 4. Corrección final de HU16 — Interpretación de asignaciones por voz

Durante las pruebas manuales del MVP2 se identificó una limitación en la interpretación de instrucciones naturales.

Por ejemplo, una instrucción como:

`Asigna a Juan equipo PC001.`

era transcrita correctamente por AssemblyAI, pero la lógica de interpretación no identificaba al técnico ni el equipo.

La revisión permitió determinar que el problema se encontraba en el parser de TechTrack y no en el servicio de transcripción.

Con apoyo de Codex se implementó una corrección enfocada en:

- Reconocer expresiones naturales como «Asigna a Juan el equipo PC001».
- Interpretar técnico y equipo sin depender exclusivamente de la puntuación.
- Buscar los equipos asociados al técnico identificado.
- Conservar la selección manual cuando existan nombres duplicados o asignaciones ambiguas.
- Mantener las protecciones frente a negaciones e instrucciones contradictorias.
- Evitar modificaciones al parser compartido que pudieran afectar otras funcionalidades.

Se incorporaron **42 pruebas de regresión adicionales**, incluyendo los escenarios detectados durante las pruebas manuales.

### Resultados de la validación final

| Verificación | Resultado |
|---|---|
| Pruebas backend | **114/114 aprobadas** |
| Pruebas frontend | **40/40 aprobadas** |
| Compilación backend | Aprobada |
| Compilación frontend | Aprobada |
| TypeScript estricto | Sin errores |
| `git diff --check` | Sin errores |
| Revisión de archivos sensibles | Sin hallazgos en los cambios publicados |

La corrección se realizó principalmente en:

- `back/src/modules/voice/taskDictation.ts`
- `back/src/modules/voice/voice-dictation.test.ts`

Estos resultados fueron reportados por Codex después de ejecutar las verificaciones correspondientes.

## 5. Validación manual con servicios reales

Las pruebas automatizadas utilizaron servicios simulados para verificar el comportamiento de la aplicación sin depender de llamadas reales a proveedores externos.

De forma complementaria, el equipo realizó pruebas manuales en localhost utilizando AssemblyAI real.

Estas pruebas permitieron comprobar la transcripción de instrucciones y el llenado de los campos de asignación.

También se verificó el comportamiento ante situaciones ambiguas, como la existencia de técnicos con nombres repetidos.

Las pruebas manuales complementan las automatizadas, pero no sustituyen sus resultados ni permiten establecer métricas de precisión del reconocimiento de voz.

El registro integral de estas verificaciones, con sus capturas y resultados por historia de usuario, continúa pendiente de incorporarse a la carpeta de evidencias.

## 6. Integración de las correcciones al repositorio

Las correcciones se desarrollaron en la rama:

`fix/mvp2-voz-estabilidad`

El último ajuste de HU16 se publicó mediante el commit:

`021d185` — `fix: mejorar interpretación de asignaciones por voz`

Posteriormente, los cambios se integraron a la rama principal mediante el **Pull Request #4**, fusionado el 9 de noviembre de 2026, hora de Colombia.

- **Pull Request:** https://github.com/flowxter/tech-track/pull/4
- **Commit de integración:** `040287d`
- **Estado:** fusionado y cerrado.
- **Rama de destino:** `main`.

De esta manera, las correcciones y sus pruebas automatizadas quedaron incorporadas al repositorio principal.

## 7. Alcance y limitaciones de las evidencias

Este documento consolida los resultados de auditorías y ejecuciones de pruebas reportadas por Codex durante el desarrollo del MVP2.

Es importante distinguir que:

- Las pruebas automatizadas utilizaron proveedores externos y persistencia simulados.
- La prueba nativa de grabación utilizó Chromium con un dispositivo de audio simulado.
- Las verificaciones con AssemblyAI real fueron realizadas manualmente por el equipo.
- Los resultados presentados corresponden a diferentes versiones de las suites de pruebas y no deben sumarse.
- Este archivo constituye una síntesis documental de las verificaciones reportadas y no un registro original exportado del terminal.
- La aprobación de las pruebas automatizadas no demuestra por sí sola la disponibilidad ni el funcionamiento integral de los servicios externos en producción.

## 8. Conclusión

Las pruebas automatizadas permitieron identificar, corregir y prevenir defectos relacionados con la integración de voz en TechTrack.

El proceso evolucionó desde una auditoría inicial con 33 pruebas backend aprobadas hasta una última ejecución reportada con **114 pruebas backend y 40 frontend aprobadas**.

La combinación de auditorías, pruebas de regresión y verificaciones manuales permitió mejorar la estabilidad de las funcionalidades del MVP2 antes de integrar las correcciones a `main`.

Esta experiencia evidencia la importancia de utilizar inteligencia artificial como apoyo al desarrollo, manteniendo la revisión humana y la validación técnica de los resultados.