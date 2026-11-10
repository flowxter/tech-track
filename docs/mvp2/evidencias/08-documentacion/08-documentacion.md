# 08. Documentación — TechTrack MVP2

## 1. Objetivo

Organizar la documentación del MVP2 y las evidencias del uso de IA sin duplicar el material del MVP1. Los documentos explican qué se añadió con las funciones de voz, cómo se desarrollaron y qué verificaciones se realizaron.

## 2. Documentos del MVP2

| Archivo | Contenido |
|---|---|
| 01-descubrimiento.md | Problema, necesidad y alcance de las funciones de voz. |
| 02-requerimientos.md | HU13–HU17, requisitos y elección de AssemblyAI y ElevenLabs. |
| 03-planificacion.md | Organización de las cinco historias complementarias al MVP1. |
| 04-arquitectura.md | Integración de los proveedores de voz en la arquitectura existente. |
| 05-desarrollo.md | Implementación inicial, auditoría y correcciones asistidas por IA. |
| 06-pruebas.md | Resultados automatizados y comprobación del flujo completo. |
| 07-despliegue.md | Reutilización de Vercel y MongoDB; configuración adicional de voz. |
| **08-documentacion.md** | Organización, trazabilidad y mantenimiento de los entregables. |
| `09-evaluacion.md` | Evaluación del MVP2, resultados históricos y posteriores, límites y lecciones aprendidas. |

## 3. Documentación reutilizada del MVP1

La documentación del MVP1 se conserva en `docs/mvp1/`, separada de la del MVP2. Sus doce historias originales no se reemplazan: el MVP2 incorpora HU13–HU17.

## 4. Evidencias y trazabilidad

Las evidencias se organizan en `docs/mvp2/evidencias/` por etapa. Se conserva la organización actual y se separan **prompts**, **respuestas de IA** y **decisiones HITL**; en desarrollo se conservan completos los prompts originales disponibles de Codex y se resumen sus respuestas. Los registros de pruebas distinguen servicios simulados de verificaciones con navegador real.

**Trazabilidad esperada:** requisito o HU → funcionalidad implementada → prueba o demostración → evidencia → decisión humana. El backlog del MVP2 debe contrastarse con Jira; no se atribuyen identificadores, prioridades ni estimaciones no confirmados.

## 5. Revisión humana (HITL)

El equipo decidió conservar los documentos y la infraestructura del MVP1, crear una carpeta independiente para el MVP2 y registrar por separado las evidencias de IA. También definió que los resultados de Codex se presentarían con sus limitaciones y que los cambios no integrados a `main` no se documentarían como desplegados.

**Criterio de cierre:** comprobar que los archivos reflejan la versión entregada y que cada evidencia disponible está ubicada en su etapa correspondiente. La demostración práctica complementa la documentación, pero no reemplaza las pruebas automatizadas.
