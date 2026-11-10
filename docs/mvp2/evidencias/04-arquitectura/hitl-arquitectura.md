# HITL — Arquitectura del MVP2

## Decisión humana sobre las herramientas

El equipo decidió integrar **AssemblyAI** para reconocimiento de voz a texto (STT) y **ElevenLabs** para síntesis de texto a voz (TTS), aprovechando la arquitectura web existente de TechTrack.

| Herramienta | Decisión de integración |
|---|---|
| **AssemblyAI** | El navegador graba el audio y lo envía al backend, que solicita la transcripción. El técnico revisa el texto antes de guardarlo. |
| **ElevenLabs** | El backend solicita la generación de audio y el frontend lo reproduce. Si el servicio falla, se utiliza la voz del navegador como alternativa. |

## Validación HITL

El equipo mantuvo las claves de ambos servicios exclusivamente en el backend y evitó que el frontend se conectara directamente con los proveedores. Se optó por **ampliar la arquitectura existente**, sin incorporar servicios adicionales ni sustituir los módulos del MVP1.

**Resultado:** dos integraciones de voz que complementan las funcionalidades actuales y mantienen la revisión humana de la información transcrita.
