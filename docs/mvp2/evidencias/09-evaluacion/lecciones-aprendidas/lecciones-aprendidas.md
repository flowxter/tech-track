# Lecciones aprendidas — TechTrack MVP2

## 1. Asistencia de IA con revisión humana

**Aprendizaje:** la inteligencia artificial puede apoyar la generación de código, la identificación de defectos y la propuesta de soluciones, pero sus respuestas no equivalen automáticamente a una implementación correcta ni a una aceptación funcional.

**Evidencia:** después de implementar las funciones de voz, la auditoría realizada con Codex identificó **14 hallazgos técnicos (A01–A14)**. El equipo solicitó inicialmente un diagnóstico sin modificaciones y posteriormente autorizó únicamente cinco correcciones prioritarias: **A01, A02, A03, A04 y A12**.

Durante las pruebas manuales se identificó una limitación adicional en la interpretación de asignaciones mediante lenguaje natural. Codex analizó la causa, propuso una solución y esperó autorización antes de modificar el código.

**Acción para próximos incrementos:** separar las etapas de auditoría, autorización, implementación y validación. Conservar los prompts, respuestas, decisiones HITL, cambios realizados y resultados de las pruebas.

## 2. Probar antes de atribuir errores al código

**Aprendizaje:** un comportamiento incorrecto de la aplicación no necesariamente significa que exista un defecto en el código. Los problemas también pueden originarse en la configuración del navegador, los dispositivos de entrada o los servicios externos.

**Evidencia:** durante las pruebas de reconocimiento de voz se presentó una respuesta HTTP `422`. El equipo relacionó este comportamiento con la selección de un micrófono que registraba silencio. Después de revisar la configuración de entrada de audio, reportó que pudo realizar la transcripción correctamente.

El registro técnico completo del incidente continúa pendiente de adjuntarse, por lo que su causa se conserva como diagnóstico reportado.

**Acción:** verificar permisos del navegador, selección del micrófono, contenido y formato del audio, conexión de red y configuración de los proveedores **antes de modificar el software**.

## 3. Seguridad y control sobre el dictado

**Aprendizaje:** transcribir correctamente una instrucción no garantiza que el sistema interprete de manera adecuada los nombres, equipos, acciones o secciones mencionadas.

**Evidencia:** la auditoría identificó situaciones en las que los nombres negados, las coincidencias parciales o la presencia de varios técnicos podían ocasionar asignaciones incorrectas. También se encontraron problemas relacionados con asociaciones conservadas entre dictados consecutivos (**A03 y A04**).

Posteriormente, durante las pruebas reales de HU16, AssemblyAI transcribió correctamente instrucciones como:

`Asigna a Juan equipo PC001.`

Sin embargo, el parser de TechTrack no identificaba automáticamente los campos correspondientes.

La corrección final permitió mejorar el reconocimiento de expresiones naturales y conservar la selección manual cuando existen técnicos con nombres duplicados o instrucciones ambiguas.

**Acción:** mantener separados los procesos de transcripción e interpretación. Tratar el contenido reconocido como un **borrador editable**, exigir confirmación humana antes de guardar y evitar seleccionar automáticamente personas o equipos cuando no exista certeza suficiente.

## 4. Pruebas automatizadas y pruebas reales son complementarias

**Aprendizaje:** las pruebas automatizadas permiten comprobar comportamientos específicos y prevenir regresiones, pero no sustituyen las verificaciones con dispositivos y servicios reales.

**Evidencia:** durante la auditoría inicial se aprobaron **33 pruebas backend**, mientras que las pruebas frontend no pudieron ejecutarse por falta de Playwright.

Después de las primeras correcciones se obtuvieron 52 pruebas backend y 32 frontend aprobadas.

Las revisiones posteriores ampliaron progresivamente los escenarios de validación, hasta alcanzar los siguientes resultados:

| Etapa | Backend | Frontend |
|---|---:|---:|
| Auditoría inicial | 33/33 | No ejecutadas |
| Primera corrección | 52/52 | 32/32 |
| Revisión A02/A04 | 52/52 | 40/40 |
| Revisión A03 | 72/72 | 40/40 |
| **Corrección final HU16** | **114/114** | **40/40** |

**La última ejecución reportó 154 pruebas automatizadas aprobadas, sin fallos.**

Los resultados corresponden a ejecuciones sucesivas y no deben sumarse entre sí.

Las pruebas automatizadas utilizaron proveedores externos y persistencia simulados. Por eso se complementaron con pruebas manuales utilizando AssemblyAI real, que permitieron identificar problemas que no se habían evidenciado en los escenarios automatizados.

**Acción:** conservar pruebas reproducibles, registrar claramente cuáles utilizan servicios simulados y complementar la validación con micrófonos físicos, proveedores reales, permisos, errores de red, instrucciones ambiguas y recorridos funcionales completos.

## 5. Dependencias y compatibilidad también son parte de la calidad

**Aprendizaje:** una aplicación no debe considerarse suficientemente validada únicamente porque funciona en el entorno de desarrollo de un integrante del equipo.

**Evidencia:** durante la auditoría se identificó que la configuración de Playwright impedía ejecutar las pruebas de regresión frontend (**A12**).

También se detectó la necesidad de actualizar el modelo utilizado por AssemblyAI para mantener la compatibilidad con su API (**A01**).

Después de estas correcciones se consiguió ejecutar satisfactoriamente las suites automatizadas y verificar las compilaciones de frontend y backend.

**Acción:** mantener las dependencias y sus versiones correctamente declaradas, utilizar archivos de bloqueo, probar instalaciones reproducibles y revisar periódicamente la compatibilidad de las APIs externas.

## 6. Evolucionar la arquitectura sin reescribir lo que funciona

**Aprendizaje:** incorporar inteligencia artificial a una aplicación no exige reemplazar toda su arquitectura ni utilizar modelos generativos para procesar cada funcionalidad.

**Evidencia:** TechTrack MVP2 conservó la arquitectura utilizada en el MVP1:

- React, TypeScript y Vite para el frontend.
- Node.js, Express y TypeScript para el backend.
- MongoDB Atlas para la persistencia.
- Vercel para el despliegue de la aplicación.

Las nuevas funcionalidades se incorporaron mediante módulos de voz, integrando AssemblyAI para transcripción y ElevenLabs para síntesis.

Las claves de los proveedores permanecen en el backend y se conserva una alternativa de reproducción mediante la voz del navegador.

Además, la corrección final de HU16 se implementó específicamente en el módulo de interpretación de tareas, evitando modificar globalmente el parser compartido y reducir así el riesgo de afectar otras funcionalidades.

**Acción:** reutilizar los componentes existentes, mantener responsabilidades separadas y realizar modificaciones localizadas que faciliten el mantenimiento y las pruebas de regresión.

## 7. Historias complementarias facilitan la trazabilidad

**Aprendizaje:** ampliar un producto mediante historias de usuario independientes permite identificar con mayor claridad el alcance de cada incremento y comprobar sus resultados.

**Evidencia:** para el MVP2, el equipo decidió incorporar cinco historias nuevas (**HU13–HU17**), complementarias a las doce historias originales del MVP1.

Estas historias permitieron organizar las funcionalidades de dictado individual, creación de tareas por voz, documentación técnica, asignaciones administrativas y lectura hablada.

Su separación facilitó relacionar los requerimientos con el código implementado, los criterios de aceptación, los casos de prueba y la demostración funcional.

**Acción:** conservar la relación entre historias, requisitos, implementación, pruebas y evidencias. Confirmar en Jira los identificadores, prioridades, estados y Story Points oficiales antes de utilizarlos como resultados definitivos.

## 8. Versionar y desplegar son decisiones diferentes

**Aprendizaje:** tener código corregido y pruebas aprobadas en una rama local no significa que esos cambios ya formen parte de la aplicación principal o de la versión publicada.

**Evidencia:** la primera integración de las funcionalidades de voz se incorporó mediante el **Pull Request #3**.

Las correcciones posteriores se desarrollaron en la rama independiente:

`fix/mvp2-voz-estabilidad`

Después de las pruebas y de la corrección final de HU16, se creó el commit:

`021d185` — `fix: mejorar interpretación de asignaciones por voz`

Posteriormente, el equipo autorizó la integración mediante el **Pull Request #4**, que fue fusionado a `main` el 9 de noviembre de 2026, hora de Colombia.

- **Pull Request:** https://github.com/flowxter/tech-track/pull/4
- **Commit de integración:** `040287d`
- **Estado:** fusionado y cerrado.

Las verificaciones de Vercel asociadas al commit de integración finalizaron satisfactoriamente.

Sin embargo, el resultado exitoso de un despliegue no equivale por sí solo a una prueba funcional completa de la aplicación publicada.

**Acción:** conservar la trazabilidad entre rama, commit, Pull Request y despliegue. Diferenciar explícitamente el código desarrollado, el integrado y el publicado, y verificar el funcionamiento de la aplicación después de cada integración.

## 9. Documentar evidencia auténtica fortalece la evaluación

**Aprendizaje:** conservar las instrucciones originales, las respuestas de las herramientas y los resultados de las pruebas permite demostrar cómo se desarrolló el proyecto y cuáles decisiones fueron tomadas por el equipo.

**Evidencia:** el repositorio contiene los prompts originales disponibles de Claude y Codex, el informe de auditoría, las instrucciones de corrección y los registros de decisiones Human-in-the-Loop (HITL).

Las evidencias del MVP2 se organizaron en nueve etapas: descubrimiento, requerimientos, planificación, arquitectura, desarrollo, pruebas, despliegue, documentación y evaluación.

Los resultados automatizados se presentan cronológicamente, diferenciando las ejecuciones históricas de las posteriores y las pruebas simuladas de las verificaciones reales.

Sin embargo, continúa pendiente incorporar el registro integral de las pruebas manuales con sus capturas y resultados por historia de usuario.

**Acción:** conservar evidencias originales, identificar los prompts de referencia que no correspondan a interacciones literales y evitar presentar resultados no medidos, como porcentajes de productividad, precisión del reconocimiento de voz o cobertura porcentual del código.

## Síntesis

El principal aprendizaje de TechTrack MVP2 fue que **la inteligencia artificial puede apoyar distintas etapas de la ingeniería de software, pero la confiabilidad del producto depende de la revisión humana, las pruebas reproducibles y la validación en escenarios reales**.

La auditoría realizada con Codex permitió identificar catorce hallazgos técnicos, mientras que las correcciones autorizadas y las pruebas de regresión contribuyeron a mejorar la estabilidad de las funcionalidades de voz.

Las pruebas manuales con AssemblyAI real fueron especialmente importantes porque permitieron diferenciar los problemas de transcripción de los errores de interpretación y detectar una limitación adicional en HU16.

El proceso culminó con **114 pruebas backend y 40 frontend aprobadas** en la última ejecución automatizada reportada, y con la integración de las correcciones al repositorio principal mediante el PR #4.

Para los siguientes incrementos se priorizará la revisión de los hallazgos pendientes, la validación de las historias en Jira, la incorporación de evidencias completas del flujo real, la comprobación integral de la versión publicada y la evaluación de la utilidad del sistema con usuarios externos.

**En conclusión, la IA fue una herramienta de apoyo durante el desarrollo, la auditoría y las pruebas, mientras que el equipo conservó la responsabilidad de evaluar, autorizar, verificar e integrar los resultados.**