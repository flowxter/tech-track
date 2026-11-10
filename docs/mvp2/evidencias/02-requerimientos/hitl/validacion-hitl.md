# Validación HITL — Requerimientos MVP2

## Decisión del equipo

Tras revisar las herramientas presentadas, el equipo eligió **AssemblyAI** para reconocimiento de voz a texto (STT) y **ElevenLabs** para lectura de texto en voz alta (TTS).

La integración debía ampliar TechTrack sin reemplazar las funcionalidades del MVP1. Se estableció que el texto reconocido sería **editable y confirmado por el usuario antes de guardarse**.

## Revisión humana

| Aspecto | Decisión |
|---|---|
| Elección de proveedores | El equipo seleccionó AssemblyAI y ElevenLabs entre las alternativas presentadas. |
| Alcance funcional | Dictado de campos, creación de tareas, informes, asignación administrativa y lectura hablada. |
| Seguridad | Claves privadas en el backend y permisos según el rol del usuario. |
| Control de errores | Conservar los textos existentes y permitir corrección manual cuando falle o sea ambiguo el dictado. |
