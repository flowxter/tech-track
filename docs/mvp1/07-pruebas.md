# Estrategia y Resultados de Pruebas — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa del pipeline:** 06. Pruebas  
**Versión:** 2.0  
**Estado:** Auditoría, regresión y verificación funcional realizadas; aceptación global pendiente.

## 1. Objetivo, fuente y alcance

Comprobar las **12 historias** frente a los **59 criterios oficiales de Jira** (`MGDST-1` a `MGDST-12`), detectar defectos y verificar las correcciones autorizadas. Esta es la **fuente documental central de los resultados de QA**; [Evaluación](09-evaluacion.md) interpreta sus métricas sin duplicar la matriz completa.

Se evaluó la aplicación React/Vite + Express + MongoDB Atlas mediante inspección, pruebas automatizadas, escenarios simulados y recorridos funcionales reales. No se afirma cobertura integral de código, carga, accesibilidad, dispositivos ni producción.

## 2. Estrategia y niveles

| Tipo | Alcance | Situación |
|---|---|---|
| Unitarias | Reglas de estado y validación de imágenes | Ejecutadas |
| API simulada | Errores, contratos y escenarios HTTP | Ejecutadas |
| Navegador con API simulada | Formularios, transiciones y regresión de UI | Ejecutadas |
| Funcional real | Frontend, backend, MongoDB Atlas, persistencia y roles | Ejecutada |
| Seguridad funcional | Acceso anónimo, entre usuarios y administrativo | Ejecutada en escenarios específicos |
| Rendimiento y carga | Medición de latencia y concurrencia | No evaluada formalmente |
| Compatibilidad y accesibilidad exhaustivas | Matriz de navegadores/dispositivos | No evaluada formalmente |
| Smoke posterior al despliegue público | Comportamiento en Vercel | Pendiente |

## 3. Catálogo original de casos (CP-01 a CP-24)

Los códigos siguientes forman parte del **plan de pruebas**; no se considera que cada CP haya sido ejecutado literalmente por el solo hecho de existir. La ejecución final de Codex fue reportada principalmente por criterios y escenarios.

| Caso | HU | Escenario y resultado esperado |
|---|---|---|
| CP-01 | HU01 | Registro válido → cuenta creada |
| CP-02 | HU01 | Registro inválido → rechazo; credenciales protegidas |
| CP-03 | HU02 | Login correcto → sesión válida |
| CP-04 | HU02 | Contraseña errónea/cierre de sesión → acceso denegado |
| CP-05 | HU03 | Registrar equipo → persistencia |
| CP-06 | HU03 | Datos inválidos/selección → validación y consulta consistentes |
| CP-07 | HU04 | Crear tarea sobre equipo propio → vínculo correcto |
| CP-08 | HU04 | Equipo inexistente/no autorizado → rechazo |
| CP-09 | HU05 | Listar tareas propias → información y estado correctos |
| CP-10 | HU05 | Consultar tarea ajena → acceso denegado |
| CP-11 | HU06 | Cambiar a estado permitido → persistencia |
| CP-12 | HU06 | Estado inválido/usuario no autorizado → rechazo |
| CP-13 | HU07 | Guardar problema y diagnóstico → relación correcta |
| CP-14 | HU07 | Documentar tarea inexistente → rechazo controlado |
| CP-15 | HU08 | Guardar actividades y resultado → persistencia |
| CP-16 | HU08 | Vincular datos a otra tarea → sin mezcla de registros |
| CP-17 | HU09 | Cargar imagen admitida → consulta autorizada |
| CP-18 | HU09 | Archivo inválido, grande o acceso ajeno → rechazo |
| CP-19 | HU10 | Historial con intervenciones → solo las del equipo |
| CP-20 | HU10 | Historial vacío → sin registros ficticios |
| CP-21 | HU11 | Abrir detalle → documentación y evidencias disponibles |
| CP-22 | HU11 | Detalle no autorizado/inexistente → respuesta controlada |
| CP-23 | HU12 | Consultar actividad como administrador → vista permitida |
| CP-24 | HU12 | Consulta administrativa como técnico → acceso denegado |

### 3.1. Pruebas no funcionales previstas (PNF)

| Caso | RNF | Comprobación prevista / situación |
|---|---|---|
| PNF-01 | RNF-01/02 | Acceso anónimo, entre usuarios y roles: verificado en escenarios específicos |
| PNF-02 | RNF-03 | Revisar protección de contraseñas y logs: sin auditoría exhaustiva |
| PNF-03 | RNF-04 | Referencias e identificadores inválidos: verificados |
| PNF-04 | RNF-05/06 | Usabilidad y tamaños de pantalla: sin matriz sistemática de dispositivos |
| PNF-05 | RNF-07/08 | Formatos, tamaños y autorización de imágenes: verificados en escenarios |
| PNF-06 | RNF-09 | Medir rendimiento bajo escenario acordado: no ejecutado formalmente |
| PNF-07 | RNF-10/12 | TypeScript, compilación, trazabilidad: comprobaciones ejecutadas |
| PNF-08 | RNF-11 | Confirmaciones falsas y errores de persistencia: regresión ejecutada |

### 3.2. Recorrido integral priorizado (E2E-PRINCIPAL)

**Registro/login → equipo → tarea → estado → problema/diagnóstico → actividades/resultado → evidencia → finalización → detalle/historial.** Codex comprobó este flujo por recorridos funcionales reales y complementos simulados. No se dispone de un resultado individual certificado bajo cada ID CP; el contraste formal está en la matriz de criterios de la sección 5.

## 4. Evolución de la auditoría

**Auditoría inicial:** 5/12 HU cumplían; de 59 criterios, 56 cumplían, uno parcialmente, uno no cumplía y uno no estaba determinado. Se identificaron seis defectos (D01–D06).

**Correcciones autorizadas:** Codex modificó D01, D02, D03, D05 y D06; D04 quedó sin corregir por una decisión funcional pendiente. Se realizaron regresiones con pruebas automatizadas y simuladas.

**Validación final real (`QA_FINAL_B38CC043`):** Codex volvió a contrastar los 59 criterios con Jira y ejecutó recorridos autorizados con frontend, backend y MongoDB Atlas. El informe reportó el siguiente resultado.

## 5. Matriz final de cumplimiento funcional

| HU | Funcionalidad | Criterios cumplidos | Resultado QA |
|---|---|---:|---|
| HU01 | Registro de usuario | 5/5 | Cumple |
| HU02 | Inicio/cierre de sesión | 5/5 | Cumple |
| HU03 | Registro de equipos | 5/5 | Cumple |
| HU04 | Creación de tareas | 5/5 | Cumple |
| HU05 | Consulta de tareas | 4/4 | Cumple |
| HU06 | Gestión de estados | 5/5 | Cumple |
| HU07 | Problema y diagnóstico | 5/5 | Cumple |
| HU08 | Actividades y resultado | **4/5** | **Cumple parcialmente** |
| HU09 | Evidencias | 5/5 | Cumple |
| HU10 | Historial de equipo | 5/5 | Cumple |
| HU11 | Detalle de tarea | 5/5 | Cumple |
| HU12 | Supervisión | **4/5** | **Cumple parcialmente** |
| **Total** | **12 historias** | **57/59** | **10 completas; 2 parciales** |

**Distribución de los 59 criterios:** 57 cumplidos; 1 incumplido; 1 no determinado; ninguno clasificado como parcialmente cumplido en la última evaluación.

### Criterios que siguen abiertos

**CA-HU08-04 — Fecha de actividad (no determinado).** La tarea conserva `createdAt`/`updatedAt`, pero no una fecha independiente de ejecución de la actividad. No se ha acordado qué fecha exige el criterio.

**CA-HU12-05 — Supervisión como consulta (incumplido).** La supervisión permite consultar información, pero la misma pantalla también ofrece creación/asignación de tareas mediante `POST /api/admin/tasks`.

La implementación principal de ambas HU existe; el equipo decidió no introducir nuevas modificaciones por tiempo disponible. Esto **no** cambia sus resultados de QA ni los criterios de Jira.

## 6. Registro de defectos

| ID | Hallazgo | Estado de la última regresión |
|---|---|---|
| D01 | Información de un usuario visible tras cambiar de sesión | **Corregido y verificado** |
| D02 | IDs mal formados producían HTTP 500 | **Corregido y verificado** |
| D03 | Cambios de documentación sin guardar y finalización de tarea | **Corregido y verificado** |
| D04 | Asignación dentro de la vista de supervisión | **Pendiente** |
| D05 | Diferencia entre `id` y `_id` en el contrato de usuario | **Corregido y verificado** |
| D06 | Metadatos inconsistentes de evidencias entre vistas | **Corregido y verificado** |

La regresión final comprobó aislamiento entre técnicos en la misma pestaña, rechazo de identificadores inválidos (400) y recursos inexistentes (404), persistencia después de guardar, contrato de identidad y metadatos/recuperación de evidencias. Las respuestas asíncronas tardías se evaluaron también mediante simulación.

## 7. Pruebas ejecutadas y condiciones

| Conjunto reportado | Resultado |
|---|---|
| Unitarias backend | **6 aprobadas** |
| HTTP con modelos simulados | **8 aprobadas** |
| **Total backend** | **14 aprobadas** |
| Navegador con API simulada | **10 escenarios aprobados** |
| Builds de frontend y backend; comprobación TypeScript | Correctos |
| Bundle de producción Vite; `git diff --check` | Correctos |
| Recorridos con frontend, backend y Atlas reales | Ejecutados y contrastados con los 59 criterios |

No se deduce cobertura porcentual del código a partir de estas cifras. Los 24 CP son un **catálogo planificado** y no deben declararse 24/24 aprobados sin un registro caso por caso.

**Entorno de la validación final:** rama local `fix/mejoras-integrales-mvp`, HEAD `6021f89` más cambios aún no confirmados. **El commit HEAD por sí solo no reproduce la versión corregida**. El informe final de Codex puede estar en el historial de la interacción; no se presumen disponibles todos sus logs, JSON o capturas en el checkout.

**Control de datos:** se usaron cuentas y registros QA autorizados; Codex reportó que no modificó información preexistente, no borró registros ni cerró sesiones administrativas durante esa ejecución.

## 8. Evidencias y HITL

- Auditoría inicial: `evidencias-ia/etapas/06-pruebas/informe-funcional-71f7a90f.md`.
- Regresión: `evidencias-ia/etapas/06-pruebas/informe-regresion-mejoras-integrales.md`.
- Correcciones: `evidencias-ia/etapas/05-desarrollo/correcciones/mejoras-integrales-mvp/`.
- Fuente oficial de criterios: Jira `MGDST-1` a `MGDST-12`.
- Ejecución final: informe de Codex `QA_FINAL_B38CC043` (confirmar su archivo o conservarlo como evidencia).

Las decisiones del equipo incluyen corregir los cinco defectos autorizados, mantener la unicidad de identificador por técnico y conservar HU08/HU12 sin nuevas correcciones. El resultado de una IA no se presenta como aceptación formal del equipo.

## 9. Condición de salida

La etapa proporciona evidencia para [Evaluación](09-evaluacion.md), pero **no avala aceptación funcional global**: faltan la definición de HU08 y el cumplimiento de HU12. Además, las pruebas de un entorno público se realizarán únicamente después del [despliegue](08-despliegue.md).
