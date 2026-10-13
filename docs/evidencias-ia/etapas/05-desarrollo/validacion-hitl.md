# Validación HITL — Desarrollo

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 05 — Desarrollo  
**Estado:** validación inicial documentada; correcciones funcionales pendientes

## 1. Entradas y decisiones humanas

| Elemento | Revisión o decisión | Clasificación |
|---|---|---|
| React + TypeScript, Node.js + TypeScript y MongoDB | Seleccionados por el equipo antes de usar Claude | Decisión humana previa |
| Carpetas `front/` y `back/` | Exigidas en el prompt de implementación | Instrucción humana previa |
| Contexto académico, alcance MVP y enfoque HITL | Proporcionados antes de solicitar código | Contexto del equipo |
| Primera respuesta de Claude | El equipo revisó los pasos iniciales y autorizó continuar | Validación inicial reportada |
| Adjuntos de HU no disponibles para Claude | Limitación reconocida en su primera respuesta | Requiere contraste independiente con Jira |

## 2. Resultado contrastado

El equipo informa que Claude generó la primera versión de TechTrack a partir de **un único prompt inicial de implementación**. La existencia de los módulos y el funcionamiento parcial del MVP se contrastaron posteriormente mediante inspección de código y pruebas de API y navegador.

La etapa 06 documenta **5 HU que cumplen y 7 que cumplen parcialmente**, según sus pruebas y criterios de clasificación. También confirmó un defecto de información residual entre cuentas (D01), por lo que estos resultados no constituyen aceptación global del MVP.

## 3. Decisiones todavía pendientes

- No atribuir a Claude decisiones de tecnologías y carpetas que ya había tomado el equipo.
- No afirmar que Claude verificó el adjunto de HU: indicó que no pudo acceder a él.
- Recuperar la salida completa de generación solo si está disponible, sin inventar prompts intermedios.
- Registrar las futuras correcciones como nuevas interacciones de desarrollo, con aprobación humana y pruebas de regresión posteriores.

**Resultado HITL:** se validó el avance inicial con una implementación asistida por IA, pero las correcciones y la aceptación funcional final permanecen pendientes de nuevas verificaciones.
