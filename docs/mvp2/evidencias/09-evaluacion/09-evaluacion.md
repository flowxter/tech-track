# 09. Evaluación — TechTrack MVP2

**Propósito:** evaluar los resultados de la ampliación del MVP1, el aporte de las herramientas de inteligencia artificial y las decisiones humanas, diferenciando implementación, pruebas, aceptación y despliegue.

## 1. Cumplimiento del objetivo

El objetivo del MVP2 fue incorporar reconocimiento y síntesis de voz para facilitar el registro, la documentación y la consulta de intervenciones de soporte técnico.

**El objetivo funcional se alcanzó en los escenarios probados:** TechTrack permite dictar información, preparar borradores de tareas e informes, realizar asignaciones administrativas mediante voz y escuchar tareas y resúmenes.

Estas funcionalidades amplían las capacidades existentes del MVP1 sin reemplazar sus módulos principales.

Sin embargo, aunque la incorporación de voz busca facilitar el trabajo de los técnicos, **no se midió formalmente el ahorro de tiempo ni se realizaron evaluaciones de productividad con usuarios externos**.

### Historias de usuario implementadas

El MVP2 incorpora cinco historias de usuario independientes y complementarias a las doce historias originales:

| HU | Resultado implementado | Verificación disponible |
|---|---|---|
| **HU13** | Dictado en campos individuales. | Pruebas automatizadas y uso práctico reportado por el equipo. |
| **HU14** | Creación de borradores de tareas mediante voz. | Pruebas de interpretación y flujo funcional con revisión previa. |
| **HU15** | Dictado y distribución de informes técnicos entre sus secciones. | Pruebas automatizadas del parser y recorrido práctico reportado. |
| **HU16** | Preparación de asignaciones administrativas mediante voz. | Pruebas de permisos, ambigüedades, lenguaje natural y validación manual con AssemblyAI. |
| **HU17** | Lectura de tareas y resúmenes mediante ElevenLabs, con respaldo del navegador. | Pruebas automatizadas y reproducción práctica reportada. |

La aplicación conserva una regla fundamental: **la información reconocida mediante voz debe revisarse y confirmarse antes de guardarse**.

En los casos en los que no es posible identificar de forma inequívoca un técnico o equipo, el sistema solicita intervención manual en lugar de realizar una asignación insegura.

**Estado de las historias:** las funcionalidades se encuentran implementadas y cuentan con verificaciones en los escenarios descritos. La aceptación formal de cada historia debe contrastarse con los criterios y estados registrados en Jira.

## 2. Resultados de calidad y pruebas

### 2.1. Auditoría técnica inicial

Después de integrar la primera versión de las funcionalidades de voz, el equipo utilizó Codex para realizar una auditoría técnica del código.

En esta etapa se solicitó identificar posibles defectos, problemas de compatibilidad, riesgos de seguridad y pruebas faltantes, **sin autorizar modificaciones al repositorio**.

Como resultado, Codex identificó **14 hallazgos técnicos**, clasificados desde A01 hasta A14.

El equipo evaluó los resultados y decidió priorizar inicialmente cinco hallazgos:

- **A01:** compatibilidad del modelo utilizado por AssemblyAI.
- **A02:** control del micrófono y ciclo de vida de las grabaciones.
- **A03:** interpretación de asignaciones ambiguas.
- **A04:** protección de asociaciones y modificaciones manuales durante dictados consecutivos.
- **A12:** configuración y ejecución reproducible de las pruebas frontend.

Las correcciones fueron autorizadas para desarrollarse en una rama independiente, manteniendo la revisión humana antes de su integración.

### 2.2. Evolución de las pruebas automatizadas

Los resultados históricos permiten observar cómo aumentó la cobertura de escenarios de prueba durante el desarrollo.

| Ejecución | Backend | Frontend | Total aprobado |
|---|---:|---:|---:|
| Auditoría inicial | 33/33 | No ejecutadas | 33 |
| Primera corrección A01–A04 y A12 | 52/52 | 32/32 | 84 |
| Revisión posterior A02/A04 | 52/52 | 40/40 | 92 |
| Revisión posterior A03 | 72/72 | 40/40 | 112 |
| **Corrección final HU16** | **114/114** | **40/40** | **154** |

**Resultado de la última ejecución reportada: 154 pruebas automatizadas aprobadas, sin pruebas fallidas.**

Es importante aclarar que estas cifras corresponden a ejecuciones sucesivas de las suites. Los resultados de las diferentes etapas **no deben sumarse entre sí**, porque las ejecuciones posteriores incluyen los casos conservados de las versiones anteriores.

Durante la primera corrección se incorporaron 19 casos backend y 14 frontend. Posteriormente, la revisión A03 añadió 20 pruebas backend y la corrección final de HU16 incorporó otras 42.

También se realizaron verificaciones de compilación, TypeScript estricto y consistencia de los cambios.

Las pruebas automatizadas utilizaron servicios externos y persistencia simulados. La comprobación nativa del micrófono se realizó mediante Chromium con una entrada de audio simulada.

Por lo tanto, estos resultados permiten verificar el comportamiento del código bajo condiciones controladas, pero **no demuestran por sí solos el funcionamiento integral de AssemblyAI, ElevenLabs y MongoDB Atlas en producción**.

### 2.3. Corrección final de HU16

Durante las pruebas manuales con AssemblyAI real se identificó una limitación en la interpretación de instrucciones de asignación expresadas mediante lenguaje natural.

Por ejemplo, el sistema transcribía correctamente:

`Asigna a Juan equipo PC001.`

Sin embargo, la lógica de interpretación no identificaba automáticamente al técnico ni al equipo.

El análisis permitió establecer que el problema se encontraba en el parser de TechTrack y no en el reconocimiento de voz de AssemblyAI.

El equipo solicitó a Codex una corrección específica para reconocer expresiones naturales sin depender exclusivamente de la puntuación, conservando las protecciones frente a asignaciones ambiguas.

La corrección incluyó:

- Reconocimiento de expresiones como «Asigna a Juan el equipo PC001».
- Identificación del técnico antes de buscar sus equipos asociados.
- Interpretación de instrucciones sin exigir puntuación entre todos los campos.
- Selección manual cuando existen técnicos con nombres iguales o instrucciones ambiguas.
- Protección frente a negaciones e instrucciones contradictorias.
- Conservación de la confirmación humana antes del guardado.

Se añadieron **42 pruebas backend de regresión** para verificar estas situaciones.

La última validación reportada obtuvo:

| Verificación | Resultado |
|---|---|
| Pruebas backend | **114/114 aprobadas** |
| Pruebas frontend | **40/40 aprobadas** |
| Builds backend y frontend | Aprobados |
| TypeScript estricto | Sin errores |
| `git diff --check` | Sin errores |
| Revisión de archivos sensibles | Sin hallazgos en los cambios publicados |

Esta corrección se incorporó posteriormente a la rama principal mediante el PR #4.

### 2.4. Pruebas manuales y validación funcional

Además de las pruebas automatizadas, el equipo reportó verificaciones manuales en localhost con las funcionalidades de reconocimiento y síntesis de voz.

Las pruebas incluyeron dictado de información, creación de borradores, asignaciones administrativas, documentación técnica y reproducción hablada.

Durante las pruebas se presentó una respuesta HTTP `422`, que el equipo relacionó con un micrófono que registraba silencio. Después de revisar la configuración del dispositivo de entrada, se reportó que la transcripción pudo realizarse correctamente.

Esta situación permitió identificar una lección importante: **antes de atribuir un fallo al código, es necesario verificar también la configuración del entorno, los permisos y los dispositivos utilizados**.

Las pruebas con AssemblyAI real también permitieron detectar el problema de interpretación de lenguaje natural que motivó la corrección final de HU16.

El registro integral de estas verificaciones continúa pendiente de incorporarse al repositorio con sus capturas, resultados por historia y condiciones de ejecución.

## 3. Aporte de la inteligencia artificial al desarrollo

Durante el desarrollo de TechTrack se utilizaron diferentes herramientas de inteligencia artificial, cada una con una función específica.

| Herramienta | Uso y resultado | Intervención humana (HITL) |
|---|---|---|
| **Claude** | Apoyó la construcción inicial de la estructura del proyecto y sus componentes web. | El equipo definió el problema, las tecnologías y revisó las propuestas. |
| **AssemblyAI** | Convierte audio en español a texto, que posteriormente interpreta la lógica de TechTrack. | El usuario revisa y corrige el borrador antes de guardarlo. |
| **ElevenLabs** | Genera la lectura hablada de tareas y resúmenes. | El equipo seleccionó el proveedor y conservó una alternativa mediante la voz del navegador. |
| **Codex — auditoría** | Identificó 14 hallazgos técnicos sin modificar el código. | El equipo evaluó los riesgos y seleccionó los hallazgos prioritarios. |
| **Codex — correcciones** | Implementó las correcciones autorizadas, mejoró HU16 y amplió las pruebas automatizadas. | El equipo autorizó los cambios, realizó comprobaciones manuales y decidió su integración. |
| **ChatGPT** | Apoyó el análisis de requisitos, la planificación, la revisión y la organización documental. | Las propuestas fueron revisadas y ajustadas por el equipo. |

### Proceso de trabajo con IA

El procedimiento documentado puede resumirse de la siguiente manera:

**Instrucción → respuesta de IA → evaluación humana → cambio autorizado → pruebas → evidencia → integración.**

Este proceso permitió utilizar la inteligencia artificial como herramienta de apoyo sin delegar completamente las decisiones técnicas.

Se conservaron los prompts originales disponibles de Claude y Codex, las respuestas de auditoría y los registros de decisiones Human-in-the-Loop (HITL).

Los prompts de referencia utilizados para explicar algunas etapas se identificaron como tales y no se presentan como transcripciones literales de interacciones anteriores.

### Limitaciones de la evaluación del aporte de IA

No se calcularon métricas cuantitativas sobre:

- Horas de desarrollo ahorradas.
- Porcentaje de código generado por inteligencia artificial.
- Cobertura porcentual de las pruebas.
- Precisión estadística del reconocimiento de voz.
- Reducción del tiempo de documentación técnica.

Por lo tanto, el aporte de la IA se evalúa principalmente mediante las funcionalidades implementadas, los problemas identificados, las correcciones realizadas y las evidencias del proceso de desarrollo.

## 4. Evaluación del proceso frente al taller

La documentación del MVP2 permite relacionar las actividades realizadas con los aspectos solicitados en el taller.

| Aspecto | Evidencia disponible | Estado documentado |
|---|---|---|
| Problema y objetivos | Necesidad de facilitar el registro y la consulta de actividades técnicas mediante voz. | Definidos y documentados. |
| Planificación y APIs | Cinco HU complementarias e integración de AssemblyAI y ElevenLabs. | Documentadas; prioridades y Story Points sujetos a validación en Jira. |
| Diseño de historias de usuario | HU13–HU17 con criterios de aceptación. | Implementadas; aceptación formal según seguimiento en Jira. |
| Uso de inteligencia artificial | Prompts originales, respuestas, auditoría, correcciones y decisiones HITL. | Evidencias organizadas por etapa. |
| Desarrollo | Implementación de funciones de voz y correcciones técnicas mediante PR #3 y PR #4. | Ambas integraciones fusionadas a `main`. |
| Pruebas | Auditoría, resultados automatizados y verificaciones manuales. | Última ejecución reportada: 154 pruebas aprobadas; registro integral manual pendiente. |
| Despliegue | Vercel, MongoDB Atlas y control de versiones mediante GitHub. | PR #4 fusionado y verificaciones de Vercel exitosas. |
| Presentación | Demostración funcional y explicación de HU en Jira. | El registro documental de la demostración debe incorporarse como evidencia. |

Esta evaluación describe las evidencias disponibles y **no constituye una calificación ni una aprobación emitida por el docente**.

## 5. Estado de despliegue, límites y pendientes

### 5.1. Integración al repositorio principal

La primera versión de las funcionalidades de voz se integró a `main` mediante el **Pull Request #3**.

Posteriormente, las correcciones derivadas de la auditoría y el ajuste final de HU16 se desarrollaron en la rama:

`fix/mvp2-voz-estabilidad`

La última corrección se publicó mediante el commit:

`021d185` — `fix: mejorar interpretación de asignaciones por voz`

Una vez completadas las verificaciones y autorizada la integración, se fusionó el **Pull Request #4**.

- **Repositorio:** https://github.com/flowxter/tech-track
- **Pull Request:** https://github.com/flowxter/tech-track/pull/4
- **Estado:** fusionado y cerrado.
- **Commit de integración:** `040287d`
- **Rama de destino:** `main`.
- **Fecha de integración:** 9 de noviembre de 2026, hora de Colombia.

De esta manera, las correcciones de estabilidad, las pruebas de regresión y la documentación del MVP2 quedaron incorporadas al repositorio principal.

Después del merge, las verificaciones de Vercel asociadas al commit de integración finalizaron satisfactoriamente.

Sin embargo, estos resultados no reemplazan una prueba funcional integral de la versión publicada.

### 5.2. Aspectos pendientes

Aunque se alcanzaron los objetivos funcionales en los escenarios probados, se identifican actividades para futuros incrementos:

- **Hallazgos pendientes:** revisar los nueve hallazgos no incluidos en la corrección priorizada: A05–A11, A13 y A14. No se consideran automáticamente resueltos.
- **Aceptación en Jira:** cotejar identificadores, criterios, estados, prioridades y Story Points oficiales de HU13–HU17. Los 21 Story Points documentados inicialmente fueron una propuesta de planificación.
- **Evidencias manuales:** incorporar el registro integral de las pruebas realizadas, con capturas y resultados observados.
- **Verificación de producción:** comprobar el flujo completo en la versión publicada, incluyendo autenticación, integración con proveedores, persistencia y permisos.
- **Casos límite:** ampliar las pruebas con grabaciones extensas, errores de proveedores, navegadores diferentes y situaciones adicionales de ambigüedad.
- **Evaluación con usuarios:** medir posteriormente la utilidad del dictado, la comprensión de las instrucciones y el tiempo empleado en documentar tareas.

Estos pendientes representan oportunidades de mejora y no invalidan los resultados alcanzados en los escenarios que fueron probados.

## 6. Conclusión y decisión HITL

TechTrack evolucionó desde un sistema de gestión y trazabilidad de soporte técnico hacia un **MVP2 que incorpora reconocimiento y síntesis de voz**, manteniendo las funcionalidades fundamentales del producto.

La auditoría realizada con Codex permitió identificar problemas técnicos que no necesariamente eran visibles durante una demostración funcional.

Posteriormente, las correcciones autorizadas y las pruebas de regresión mejoraron la estabilidad del sistema. Las verificaciones manuales con AssemblyAI real complementaron este proceso y permitieron detectar una limitación adicional en la interpretación de instrucciones naturales.

La última ejecución automatizada reportó **114 pruebas backend y 40 frontend aprobadas**, para un total de **154 pruebas satisfactorias**.

Finalmente, los cambios fueron integrados a `main` mediante el PR #4, conservando la trazabilidad de las correcciones, los commits y los resultados de validación.

**La principal conclusión del MVP2 es que la inteligencia artificial puede apoyar las diferentes etapas de la ingeniería de software, desde el desarrollo hasta la auditoría y las pruebas, pero la calidad del producto depende de la revisión humana, la validación técnica y el control de las decisiones.**

La aceptación de las funcionalidades y la autorización de los cambios permanecieron bajo responsabilidad del equipo, en concordancia con el enfoque **Human-in-the-Loop (HITL)**.