# Respuesta de IA — Pruebas

**Herramienta:** Codex, ejecutado sobre el proyecto local.

**Fuentes:** informe técnico de la primera auditoría e `informe-funcional-71f7a90f.md` de las pruebas funcionales.

## 1. Resultados de las pruebas

| Verificación | Resultado |
|---|---|
| Compilación frontend | Correcta |
| Compilación backend | Correcta |
| Pruebas unitarias del backend | **6 aprobadas, 0 fallidas** |
| Pruebas por API | **80 solicitudes:** 78 respuestas esperadas y 2 errores HTTP 500 ante identificadores inválidos |
| Diagnóstico adicional | 5 solicitudes HTTP relacionadas con la fecha de actividad |
| Navegador | 25 observaciones, incluidas comprobaciones intermedias |
| Criterios de aceptación de Jira | **56 cumplen, 1 parcial, 1 no cumple y 1 no verificado** |

Las compilaciones y pruebas unitarias corresponden a la primera auditoría. Las pruebas por API y navegador se ejecutaron en la segunda fase.

## 2. Resultados por historia de usuario

| Estado | Historias |
|---|---|
| **Cumple (5)** | HU01, HU04, HU05, HU07, HU09 |
| **Cumple parcialmente (7)** | HU02, HU03, HU06, HU08, HU10, HU11, HU12 |

## 3. Hallazgos principales

- **D01 — Confidencialidad:** al cambiar de cuenta, el frontend conservó información de otro técnico. El backend rechazó el acceso, pero los datos previamente cargados permanecieron visibles.
- **D02 — Manejo de errores:** identificadores mal formados provocaron respuestas HTTP 500.
- **D03 — Cambios sin guardar:** completar una tarea permitió visualizar información que no había quedado persistida.
- **D04 — Alcance administrativo:** la pantalla de supervisión permite asignar tareas, aunque HU12 establece un alcance de consulta.
- **D05 y D06 — Contratos de datos:** se identificaron inconsistencias en los datos del usuario y los metadatos de evidencias, sin un fallo funcional independiente confirmado.

## 4. Limitaciones y conclusión

No se ejecutaron pruebas de concurrencia, rendimiento, accesibilidad completa ni cierre de sesión administrativo. Permanecen pendientes las definiciones de unicidad de equipos (HU03) y fecha de actividad (HU08).

**Resultado:** Codex permitió comprobar funcionalidades reales del MVP e identificar defectos que requieren revisión. Aunque cinco historias cumplen sus criterios evaluados, **no se recomienda la aceptación global de TechTrack mientras permanezca el problema de confidencialidad D01**.

Durante las pruebas no se modificó el código fuente.

Los procedimientos, criterios individuales y evidencias se conservan en `informe-funcional-71f7a90f.md`.