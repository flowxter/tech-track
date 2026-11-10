# Decisiones arquitectónicas previas del equipo

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Pipeline:** Etapa 04 — Arquitectura  
**Naturaleza de la evidencia:** decisiones del equipo **anteriores** a la consulta de Claude  
**Estado:** decisiones tecnológicas confirmadas; justificaciones comparativas detalladas no disponibles.

## 1. Contexto y alcance

TechTrack es un MVP web para la gestión y trazabilidad de actividades de soporte informático. Su flujo central relaciona usuarios, equipos, tareas, problemas, diagnósticos, actividades realizadas, evidencias e historial, con consulta adicional para administrador.

El equipo definió el stack tecnológico antes de pedir a Claude una estructura de implementación. La **diapositiva 11** de la presentación académica adjunta, «Stack tecnológico del MVP», muestra explícitamente las tecnologías elegidas.

## 2. Registro de decisiones

| ID | Decisión tomada por el equipo | Fuente | Participación de IA |
|---|---|---|---|
| ARQ-01 | **Frontend:** React con TypeScript | Presentación, diapositiva 11; declaración del equipo | No se atribuye a IA |
| ARQ-02 | **Backend:** Node.js con TypeScript | Presentación, diapositiva 11; declaración del equipo | No se atribuye a IA |
| ARQ-03 | **Base de datos:** MongoDB | Presentación, diapositiva 11; declaración del equipo | No se atribuye a IA |
| ARQ-04 | **Control de versiones:** GitHub | Presentación, diapositiva 11 | No se atribuye a IA |
| ARQ-05 | Separar físicamente el proyecto en carpetas `front/` y `back/` | Solicitud expresa en el prompt enviado posteriormente a Claude | Claude recibió esta restricción, no la originó |

La evidencia permite establecer **qué** se decidió, pero no reconstruye una comparación formal entre otras tecnologías ni los motivos técnicos individuales de cada elección. El equipo confirmó que la selección fue propia.

## 3. Alcance arquitectónico de la decisión

La selección establece una organización web de tres partes:

- **Frontend:** interfaz de usuario para técnicos y administradores.
- **Backend:** API y reglas de negocio; acceso a datos y validación de permisos.
- **MongoDB:** persistencia de la información del MVP.

La separación entre frontend y backend busca organizar responsabilidades. **No implica** que Claude haya propuesto o aprobado el stack, ni que se hubiera decidido una arquitectura de microservicios.

## 4. Evidencia principal

- `adjuntos/Presentacion_MVP_Gestor_Soporte_Tecnico.pdf`, diapositiva **11 de 12**.
- `adjuntos/diapositiva-11-stack.png` (recorte de consulta).
- Prompt original posterior, referenciado en `referencia-claude-inicial.md`.

**Conclusión documental:** las decisiones ARQ-01 a ARQ-05 son **entradas humanas** al trabajo asistido con IA, no salidas de IA aceptadas mediante HITL.
