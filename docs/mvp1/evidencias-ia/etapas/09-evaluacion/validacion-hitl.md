# Validación HITL — Evaluación del MVP

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 09. Evaluación  
**Herramientas:** ChatGPT y Codex  
**Estado:** Evaluación preliminar revisada; aceptación funcional pendiente.

## 1. Revisión y decisiones humanas

El equipo revisó los resultados de las pruebas ejecutadas por Codex y la evaluación elaborada con apoyo de ChatGPT.

| Aspecto | Decisión humana | Estado |
|---|---|---|
| Evaluación funcional | Utilizar los 59 criterios oficiales de Jira y las pruebas ejecutadas como referencia. | Aceptada como base de evaluación |
| Resultados de Codex | Conservar los informes originales y documentar los defectos encontrados. | Aceptada |
| Defecto D01 | Priorizar la corrección del problema de información residual entre cuentas. | Pendiente de corrección |
| Defectos D02–D03 | Considerar las correcciones según el tiempo disponible. | Pendiente |
| Requisitos HU03, HU08 y HU12 | Revisar las ambigüedades y definir su alcance cuando corresponda. | Pendiente |
| Evaluación del MVP | No declarar aceptación global mientras D01 permanezca sin corregir y verificar. | Aceptada como conclusión preliminar |

## 2. Resultado de la evaluación

La evaluación asistida por IA identificó:

- **5 historias de usuario que cumplen** y 7 que cumplen parcialmente.
- **56 criterios cumplidos**, 1 parcial, 1 incumplido y 1 no verificado.
- **6 pruebas unitarias aprobadas** y compilaciones correctas.
- Defectos relacionados con confidencialidad, manejo de errores y persistencia de cambios pendientes.

Estos resultados corresponden a las pruebas realizadas sobre la versión evaluada y no equivalen a una aceptación formal del MVP.

## 3. Decisiones sobre las mejoras

El equipo contempla continuar con las correcciones identificadas **en la medida en que el tiempo disponible lo permita**, dando prioridad al defecto D01 por su impacto en la confidencialidad.

Si se realizan correcciones, deberán documentarse en la etapa 05 — Desarrollo y verificarse mediante pruebas de regresión en la etapa 06 — Pruebas.

Los defectos que no puedan corregirse durante el periodo de desarrollo permanecerán registrados como limitaciones conocidas y trabajo pendiente.

No se declarará solucionado ningún defecto sin evidencia de su corrección y verificación.

## 4. Validación de métricas

El equipo utilizará indicadores verificables de cumplimiento funcional, ejecución de pruebas y participación de IA, documentados en `docs/09-evaluacion.md`.

Las métricas se calcularán a partir de resultados comprobados, sin presentar porcentajes de pruebas aprobadas como cobertura del código ni estimaciones de contribución de IA como mediciones reales.

La participación de IA se evaluará inicialmente de manera cualitativa, diferenciando sus aportes de las decisiones humanas.

## 5. Resultado HITL

**Evaluación preliminar aceptada como diagnóstico del estado del proyecto.**

El equipo reconoce los resultados obtenidos, conserva las evidencias originales y contempla corregir los defectos prioritarios si el tiempo disponible lo permite.

La evaluación podrá actualizarse después de nuevas correcciones y pruebas. Mientras D01 permanezca abierto, **no se recomienda la aceptación global del MVP**.

La aceptación de esta evaluación documental no implica la aceptación definitiva del software.