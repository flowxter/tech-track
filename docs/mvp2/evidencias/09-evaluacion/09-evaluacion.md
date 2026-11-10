# 09. Evaluación — TechTrack MVP2

**Propósito:** evaluar los resultados de la ampliación del MVP1, el aporte de las herramientas de IA y las decisiones humanas, sin confundir implementación, pruebas, aceptación y despliegue.

## 1. Cumplimiento del objetivo

El objetivo del MVP2 fue incorporar reconocimiento y síntesis de voz para facilitar el registro y la consulta de intervenciones de soporte técnico. **El objetivo funcional se alcanzó en los recorridos probados:** TechTrack permite dictar información, preparar y revisar borradores, y escuchar tareas y resúmenes. La mejora de productividad es una hipótesis razonable, pero **no se midió el ahorro de tiempo ni se evaluó formalmente con técnicos externos**.

El MVP2 incorpora cinco historias de usuario independientes y complementarias a las funcionalidades existentes:

| HU | Resultado implementado | Verificación disponible |
|---|---|---|
| **HU13** | Dictado en campos individuales. | Pruebas automatizadas; uso práctico reportado, pendiente de registro. |
| **HU14** | Creación de borradores de tareas por voz. | Interpretación simulada y flujo funcional con revisión previa. |
| **HU15** | Dictado y distribución del informe entre sus secciones. | Pruebas del parser; recorrido práctico reportado, pendiente de registro. |
| **HU16** | Borrador de asignación administrativa por voz. | Pruebas de ambigüedad, permisos y flujo con confirmación humana. |
| **HU17** | Lectura de tareas y resúmenes con ElevenLabs y respaldo del navegador. | Pruebas automatizadas; reproducción práctica reportada, pendiente de registro. |

**Estado de las HU:** funcionalidades implementadas y verificadas en los escenarios descritos; la aceptación formal de cada historia y sus datos oficiales de Jira aún deben cotejarse con el backlog.

## 2. Resultados de calidad y pruebas

| Indicador | Auditoría inicial | Corrección autorizada |
|---|---:|---:|
| Pruebas backend aprobadas | **33/33** | **52/52** |
| Pruebas frontend aprobadas | No ejecutadas (faltaba Playwright) | **32/32** |
| Hallazgos técnicos identificados | **14 (A01–A14)** | **5 abordados (A01–A04 y A12)** |
| Casos nuevos reportados | — | **19 backend + 14 frontend** |
| Builds de frontend y backend | Aprobados | Aprobados |

En la primera corrección se reportaron **84 pruebas automatizadas aprobadas y ninguna fallida**, además de validación de TypeScript estricto y comprobaciones de código. Ese resultado histórico se conserva y no se sustituye por las ejecuciones posteriores.

| Ejecución posterior independiente | Backend | Frontend | Resultado final |
|---|---:|---:|---|
| Ajustes de A02/A04 | **52/52** | **40/40** | 92 aprobadas; 0 fallidas y 0 omitidas |
| Ajuste posterior de A03 | **72/72** | **40/40** | 112 aprobadas; 0 fallidas y 0 omitidas |

Los resultados posteriores constan en salidas reales del terminal del historial de trabajo y no se han ejecutado nuevamente para esta actualización. Cada fila corresponde a una versión sucesiva de las suites: **no se suman los totales de distintas ejecuciones**. Las pruebas mantuvieron proveedores y persistencia simulados. A02/A04 añadió la grabación nativa de Chromium con dispositivo simulado; A03 añadió 20 casos backend sobre contexto descriptivo, negaciones, asignaciones e inferencia del propietario. Esto no acredita micrófono físico ni disponibilidad de AssemblyAI, ElevenLabs o MongoDB Atlas en producción.

**Prueba integral reportada:** el equipo indicó que comprobó el recorrido completo, incluidas HU13–HU17, y que resolvió un error `422` al cambiar el micrófono. Falta adjuntar `docs/mvp2/evidencias/06-pruebas/pruebas-reales/flujo-completo-mvp2.md`, con los resultados por caso y las capturas o grabaciones auténticas. Hasta entonces, el recorrido y la causa del incidente se consideran reportados por el equipo, no corroborados mediante evidencia primaria adjunta.

## 3. Aporte de la IA al desarrollo

| Herramienta | Uso y resultado | Intervención humana (HITL) |
|---|---|---|
| **Claude** | Apoyó la creación de la base inicial de TechTrack y su estructura web. | El equipo definió el problema, las tecnologías y revisó el resultado. |
| **AssemblyAI** | Convierte audio en español a texto; las reglas de TechTrack estructuran la transcripción. | El usuario revisa el borrador antes de guardarlo. |
| **ElevenLabs** | Genera la lectura hablada de tareas y resúmenes; existe respaldo del navegador. | El equipo eligió el proveedor y conservó una alternativa ante fallos. |
| **Codex — auditoría** | Revisó la versión de voz existente e identificó **14 hallazgos**, sin modificarla. | El equipo exigió primero un diagnóstico y analizó qué riesgos corregir. |
| **Codex — corrección** | Reportó cambios para **A01, A02, A03, A04 y A12** y amplió las pruebas automatizadas. | El equipo autorizó explícitamente esos cinco cambios, en una rama separada y sin publicar. |
| **ChatGPT** | Apoyó la organización de requisitos, planificación, revisión y documentación. | Las propuestas de prioridades, estimaciones y textos fueron revisables por el equipo. |

El proceso documentado fue **instrucción → respuesta de IA → evaluación humana → cambio autorizado → prueba → evidencia**. Se conservan los prompts originales disponibles de Claude y Codex; los prompts de referencia en las primeras etapas no se presentan como conversaciones literales. Las respuestas de Codex se resumieron para el informe principal y se conservó íntegra la auditoría como evidencia complementaria.

**No se calcularon** horas ahorradas, porcentaje de código generado por IA, cobertura porcentual de código ni precisión estadística de reconocimiento de voz: no existe una medición verificable para reportarlos.

## 4. Evaluación del proceso frente al taller

| Aspecto de la rúbrica | Evidencia | Estado documentado |
|---|---|---|
| Problema y objetivos | Necesidad de agilizar el registro técnico y ampliar el MVP1. | Definidos. |
| Planificación y APIs | AssemblyAI, ElevenLabs y cinco HU complementarias. | Documentados; prioridades y SP sujetos a cotejo con Jira. |
| Diseño de HU | HU13–HU17 en formato Connextra y criterios esenciales. | Documentados; aceptación oficial pendiente de verificar. |
| Uso de IA | Prompts, respuestas, auditoría, correcciones y decisiones HITL. | Evidencia disponible y limitaciones señaladas. |
| Desarrollo | Funciones de voz integradas al repositorio mediante PR #3. | Primera versión fusionada a `main`; correcciones posteriores en rama local. |
| Presentación | Flujo completo reportado; demostración práctica prevista. | Falta adjuntar el registro del recorrido; la presentación no se califica aquí. |

Esta tabla **no equivale a una nota ni a la aprobación del docente**.

## 5. Estado de despliegue, límites y pendientes

La primera integración de voz fue incorporada a `main` mediante el PR #3. El MVP2 reutiliza **Vercel y MongoDB Atlas**, agregando las claves de AssemblyAI y ElevenLabs únicamente en el backend.

La **segunda versión de correcciones**, según la respuesta conservada de Codex, permaneció en `fix/mvp2-voz-estabilidad`, basada en `92abf9d`, **sin commit, push, merge ni nuevo despliegue**. Por ello no debe afirmarse que la versión pública incorpora esas correcciones.

**Pendientes principales:**

- Revisar los **nueve hallazgos no incluidos** en la corrección priorizada: A05–A11, A13 y A14; no se consideran automáticamente resueltos.
- Confirmar en Jira los identificadores, criterios, estados, prioridades y Story Points oficiales de HU13–HU17. Las **21 SP de planificación son propuestas**, no velocidad ni avance certificado.
- Verificar la versión exacta publicada, la regresión completa con credenciales autorizadas y los casos límite de grabaciones, tareas largas, errores de proveedores y diferentes navegadores.
- Medir en una evaluación posterior la utilidad, comprensión del dictado y tiempo de documentación con usuarios reales.

## 6. Conclusión y decisión HITL

TechTrack evolucionó a un **MVP2 funcional en los escenarios automatizados comprobados**, incorporando cinco capacidades de voz sin reemplazar el sistema existente. La auditoría añadió valor al identificar problemas que una demostración aislada no revelaba; la corrección autorizada y las pruebas automatizadas aportaron resultados reproducibles. La experiencia práctica reportada destaca la importancia de verificar el entorno, aunque su registro integral sigue pendiente.

**La aceptación final del MVP2 y la publicación de las correcciones corresponden al equipo**, no a Claude, Codex ni a los resultados de pruebas simuladas.
