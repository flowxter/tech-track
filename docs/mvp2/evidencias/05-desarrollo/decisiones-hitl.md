# Decisiones HITL — Desarrollo MVP2

| Momento | Revisión y decisión humana | Resultado |
|---|---|---|
| Base inicial | El equipo seleccionó el stack y utilizó Claude como apoyo para estructurar TechTrack. | Se conservó el MVP1 como base funcional. |
| Integración de voz | Se optó por AssemblyAI para STT y ElevenLabs para TTS, con confirmación humana antes de guardar. | Primera versión integrada mediante PR #3. |
| Auditoría | Se solicitó a Codex revisar antes de modificar, para distinguir defectos, riesgos y pruebas no ejecutadas. | Informe A01–A14; **sin modificaciones**. |
| Corrección | El equipo autorizó **solo A01, A02, A03, A04 y A12**; exigió rama separada, pruebas y prohibió publicar. | Codex reportó correcciones y regresión; revisión humana pendiente antes de integrarlas. |
| Validación real | Ante error HTTP `422`, se inspeccionó la grabación y la configuración del navegador. | Se encontró que el navegador utilizaba un micrófono que grababa silencio; seleccionar el correcto permitió transcribir. |
| Cierre provisional | Se verificaron funcionalidades de voz en localhost y se observó que la versión anterior en producción también podía transcribir. | La prueba funcional no demuestra por sí misma que toda la auditoría esté cerrada ni que los cambios locales se hayan desplegado. |

**Criterio de aceptación humana:** las respuestas de Codex se toman como
resultados reportados; el equipo conserva el control de integrar cambios,
validar con servicios reales y documentar la versión publicada.

**Pendiente documental:** la respuesta literal de Claude y el prompt literal
de la primera integración de voz no están disponibles en estas evidencias.
No se reconstruyen ni se atribuyen a una herramienta.
