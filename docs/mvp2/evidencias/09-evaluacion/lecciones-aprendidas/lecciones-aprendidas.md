# Lecciones aprendidas — TechTrack MVP2

## 1. Asistencia de IA con revisión humana

**Aprendizaje:** una IA puede generar código y proponer soluciones, pero su respuesta no equivale a aceptación técnica ni funcional.

**Evidencia:** la primera versión de voz estaba implementada y fusionada; aun así, la auditoría de Codex encontró **14 hallazgos**. El equipo decidió solicitar primero un diagnóstico sin modificaciones y después autorizó únicamente **A01–A04 y A12**.

**Acción para próximos incrementos:** separar auditoría y ejecución; registrar el prompt, el resultado, la decisión HITL, la rama y las pruebas antes de integrar cambios.

## 2. Probar antes de atribuir errores al código

**Aprendizaje:** un fallo visible no siempre tiene origen en la aplicación.

**Evidencia:** el equipo atribuyó el error `422` a un micrófono sin voz e indicó que seleccionar la entrada correcta permitió transcribir. El registro del incidente sigue pendiente; la causa no se presenta como corroborada por esta documentación.

**Acción:** comprobar permisos, dispositivo de entrada, formato y contenido de la grabación, red y variables de entorno **antes de modificar el software**. No interpretar automáticamente una respuesta HTTP como defecto de implementación.

## 3. Seguridad y control sobre el dictado

**Aprendizaje:** reconocer palabras no garantiza identificar correctamente personas, equipos o secciones del informe.

**Evidencia:** la auditoría reprodujo casos en los que un nombre negado o varios nombres causaban selecciones incorrectas, y un segundo dictado conservaba asociaciones del anterior (**A03–A04**).

**Acción:** tratar la transcripción como **borrador**, exigir confirmación humana, permitir corrección y dejar campos sin selección cuando haya ambigüedad. AssemblyAI transcribe; las reglas de TechTrack interpretan el texto, por lo que deben probarse por separado.

## 4. Pruebas automatizadas y pruebas reales son complementarias

**Aprendizaje:** aprobar mocks no demuestra que los servicios externos, la base de datos o el micrófono físico funcionen en producción.

**Evidencia:** la auditoría reportó **33 pruebas backend** y no pudo ejecutar frontend por falta de Playwright; tras las correcciones Codex informó **52 backend y 32 frontend** aprobadas. Las revisiones posteriores registraron 52/40 y 72/40 como ejecuciones independientes. El equipo reportó además un recorrido completo en navegador, pero falta adjuntar su registro.

**Acción:** conservar resultados reproducibles, identificar qué está simulado y complementar con una prueba de flujo real, validando también silencio, negaciones, permisos, cierre de micrófono, tareas extensas y fallos de proveedores.

## 5. Dependencias y compatibilidad también son parte de la calidad

**Aprendizaje:** no basta con que el código funcione en el equipo donde se desarrolló.

**Evidencia:** la dependencia Playwright no estaba declarada y bloqueaba la regresión frontend (**A12**). También se detectó un modelo de AssemblyAI que requería actualización (**A01**).

**Acción:** declarar versiones y lockfiles, probar instalaciones limpias, consultar contratos vigentes de las APIs y conservar pruebas de regresión de proveedores.

## 6. Evolucionar la arquitectura sin reescribir lo que funciona

**Aprendizaje:** incorporar IA no obliga a sustituir la aplicación ni a utilizar modelos generativos para toda la lógica.

**Evidencia:** el MVP2 conservó React, Express y MongoDB Atlas, y agregó módulos separados de voz. Las claves permanecen en backend, mientras el navegador ofrece una alternativa a ElevenLabs.

**Acción:** reutilizar la infraestructura existente; aislar clientes de proveedores, validaciones, interpretación de texto y componentes de interfaz; mantener alternativas cuando sean viables.

## 7. Historias complementarias facilitan la trazabilidad

**Aprendizaje:** ampliar un producto mediante HU independientes permite evaluar el incremento sin confundir los objetivos del MVP2 con funcionalidades anteriores.

**Evidencia:** el equipo decidió crear **HU13–HU17** de forma independiente y complementaria a la funcionalidad existente.

**Acción:** vincular cada HU nueva con sus criterios, código, pruebas y demostración. Confirmar en Jira los identificadores, prioridades y Story Points antes de reportarlos como oficiales.

## 8. Versionar y desplegar son decisiones diferentes

**Aprendizaje:** una corrección local con pruebas aprobadas no representa automáticamente la versión publicada.

**Evidencia:** la primera versión de voz se fusionó mediante el PR #3; la corrección posterior de Codex quedó **sin commit, merge ni despliegue**, según el informe disponible.

**Acción:** registrar rama, commit, cambios pendientes y versión desplegada; comprobar la aplicación pública después de integrar y publicar, con autorización del equipo.

## 9. Documentar evidencia auténtica fortalece la evaluación

**Aprendizaje:** una explicación reconstruida puede apoyar la comprensión, pero no reemplaza una interacción original con IA.

**Evidencia:** se recuperaron los prompts originales de auditoría y corrección de Codex y se resumieron sus respuestas; otros prompts se identificaron expresamente como referencias, no como transcripciones literales.

**Acción:** conservar juntos los prompts originales, respuestas, decisiones HITL y archivos modificados. Evitar porcentajes o cifras de productividad sin medición y no presentar las historias como aceptadas antes de corroborarlas.

## Síntesis

El principal aprendizaje del MVP2 fue que **la IA acelera la construcción y facilita la revisión, pero la confiabilidad depende de criterios claros, pruebas reproducibles, validación en el entorno real y decisiones humanas documentadas**. Para el siguiente incremento se priorizarán el cierre de hallazgos pendientes, la validación de historias en Jira, la comprobación de la versión publicada y pruebas de uso con técnicos.
