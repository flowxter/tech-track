# Evaluación del MVP y del Proceso Aumentado con IA – TechTrack

**Proyecto:** TechTrack – Gestor de Soporte Técnico  
**Etapa del pipeline:** 9. Evaluación  
**Versión:** 1.0  
**Estado:** Marco y formato de evaluación; resultados empíricos pendientes de diligenciar con evidencia real.

## 1. Propósito

Establecer criterios y métricas para evaluar dos dimensiones diferentes:

1. **Calidad y funcionamiento del MVP:** si TechTrack resuelve técnicamente el flujo prometido y satisface los criterios de aceptación de las historias implementadas.
2. **Calidad del proceso aumentado con IA:** cómo se utilizaron herramientas de IA, qué resultados fueron aceptados/modificados/rechazados por personas y qué riesgos o mejoras se identificaron.

**Límite de la validación:** la identificación del problema se basa únicamente en **hipótesis del equipo**. La aceptación del MVP por el equipo **no demuestra por sí sola** que usuarios reales necesiten o adopten TechTrack. La validación de utilidad con técnicos sigue siendo una actividad diferenciada.

## 2. Entradas de evaluación

- `01-pipeline.md`: metodología y HITL.
- `02-descubrimiento.md`: problema, hipótesis, alcance y propuesta de valor.
- `03-requerimientos.md`: RF-01 a RF-14, RNF-01 a RNF-12 y reglas de negocio.
- `04-product-backlog.md`: HU01–HU12 y criterios contrastados/aprobados.
- `05-planificacion.md`: release plan, compromisos y alcance efectivamente ejecutado.
- `06-arquitectura.md`: decisiones aprobadas y cambios.
- `07-pruebas.md`: casos y resultados **realmente ejecutados**.
- `08-despliegue.md`: versión, entorno y smoke tests **realmente verificados**.
- Jira, GitHub, demos y archivos de `docs/evidencias-ia/` cuando existan registros válidos.

## 3. Preguntas orientadoras

- ¿Puede un técnico registrar y gestionar una tarea ligada a un equipo?
- ¿Puede conservar diagnóstico, actividades, resultado y evidencias asociadas a esa tarea?
- ¿Puede recuperar correctamente el historial de un equipo sin mezclar datos ajenos?
- ¿Se respetan los permisos de técnico y administrador?
- ¿Qué HU comprometidas se completaron realmente y cuáles quedaron pendientes?
- ¿Qué propuestas de IA mejoraron el trabajo y cuáles necesitaron intervención humana?
- ¿Las pruebas y la documentación permiten repetir y explicar los resultados?

## 4. Matriz de cumplimiento funcional

Los estados aceptados son **No evaluada / Cumple / Cumple parcialmente / No cumple / Fuera de la versión (justificado)**. No registrar «Cumple» solo porque exista código o porque una IA afirmó que funciona.

| HU | Capacidad principal | Estado verificado | Evidencia que debe asociarse |
|---|---|---|---|
| HU01 | Registro de usuario | No evaluada | CP-01/02, commit y captura/log |
| HU02 | Inicio y cierre de sesión | No evaluada | CP-03/04 y prueba de acceso |
| HU03 | Registro de equipos | No evaluada | CP-05/06, registro de equipo de prueba |
| HU04 | Creación de tareas | No evaluada | CP-07/08, vínculo tarea/equipo |
| HU05 | Consulta de tareas | No evaluada | CP-09/10, permisos y listado |
| HU06 | Cambios de estado | No evaluada | CP-11/12, antes/después |
| HU07 | Problema y diagnóstico | No evaluada | CP-13/14, persistencia |
| HU08 | Actividades y resultado | No evaluada | CP-15/16, relación con tarea |
| HU09 | Evidencias | No evaluada | CP-17/18, acceso seguro a imagen |
| HU10 | Historial del equipo | No evaluada | CP-19/20, consultas diferenciadas |
| HU11 | Detalle de tarea | No evaluada | CP-21/22, detalle y permisos |
| HU12 | Supervisión básica | No evaluada | CP-23/24, cuentas por rol |

**Importante:** la expresión «No evaluada» indica que no se han incorporado resultados de ejecución a este informe; **no afirma** que el equipo no haya realizado trabajo por fuera de este archivo.

## 5. Métricas del MVP

### 5.1. Cobertura de aceptación de historias

`Porcentaje de HU aceptadas = HU aceptadas con evidencia / HU incluidas en la versión evaluada × 100`

- **Numerador:** HU que cumplen sus criterios aprobados y disponen de resultado de prueba.
- **Denominador:** HU que el equipo comprometió para esa versión concreta; registrar explícitamente alcance.
- **Dato actual:** no disponible.

### 5.2. Éxito de pruebas

`Tasa de éxito = casos aprobados / casos ejecutados × 100`

**Excluir** de «ejecutados» los casos *No ejecutado*; distinguir *Bloqueado* y *No aplica*. Si no se ejecutó ningún caso, consignar **No disponible**, nunca 0 % o 100 % sin contexto.

### 5.3. Defectos y estabilidad

Registrar defectos abiertos/cerrados, severidad y regresiones comprobadas. Para una demo se recomienda identificar expresamente los defectos bloqueantes. **No declarar cero defectos sin evidencia de revisión/pruebas.**

### 5.4. Trazabilidad técnica

Verificar para cada HU entregada: `HU → RF/RNF/RN → criterio → caso → resultado → commit/PR`. Registrar cuántas HU completas satisfacen esta cadena y cuáles presentan información faltante.

### 5.5. Rendimiento y experiencia de uso

Solo medir cuando el equipo haya aprobado escenario, ambiente y metas. Documentar operación, dispositivo, red, volumen de datos y tiempos observados. No inferir satisfacción de usuarios reales a partir de una demostración interna.

## 6. Métricas del uso de IA

### 6.1. Tasa de aceptación directa de propuestas

`Tasa de aceptación directa = propuestas aceptadas sin modificaciones sustanciales / propuestas evaluadas × 100`

Definir una **unidad de evaluación** (p. ej., respuesta de IA por tarea concreta) y usarla de forma consistente. Contabilizar las respuestas corregidas aparte de las directamente aceptadas. Si el denominador es cero, reportar **No disponible**.

### 6.2. Distribución de decisiones HITL

| Resultado | Definición operacional | Conteo real |
|---|---|---|
| Aceptada | Utilizada sin cambios sustanciales | Sin registrar |
| Modificada | Utilizada tras ajustes humanos documentados | Sin registrar |
| Rechazada | No utilizada por errores, incompatibilidad o alcance | Sin registrar |
| No evaluada | Aún no revisada por el equipo | Sin registrar |

Si existen distintas versiones del mismo prompt, registrar versión o identificador para no contar dos veces la misma respuesta.

### 6.3. Incidencias de IA

Categorías sugeridas: código que no compila, bibliotecas inexistentes, contradicción de criterios de aceptación, alucinación de capacidades, error de lógica, riesgo de seguridad, información imprecisa o documentación desactualizada.

Para cada incidencia guardar propuesta original, revisión, corrección, prueba de verificación y responsable; no documentar como «detectado» lo que solo es un riesgo teórico.

### 6.4. Impacto percibido por el equipo

Registrar comentarios sobre productividad, claridad, calidad y retrabajo, indicando que se trata de **percepciones del equipo** salvo que existan tiempos comparables medidos. No afirmar porcentajes de mejora sin línea base y mediciones.

## 7. Evaluación del proceso Scrum

| Aspecto | Pregunta | Fuente comprobable |
|---|---|---|
| Planificación | ¿Qué historias se comprometieron? | Sprint Backlog / Jira |
| Entrega | ¿Qué historias se aceptaron realmente? | Sprint Review y pruebas |
| Estimación | ¿Cómo se comparó esfuerzo estimado con realizado? | Jira / bitácora |
| Gestión | ¿Qué bloqueos surgieron? | Registro real de impedimentos |
| Mejora | ¿Qué cambios se acordaron para el siguiente ciclo? | Retrospective |
| IA + HITL | ¿Qué decisiones humanas cambiaron las propuestas de IA? | Evidencias versionadas |

**Referencia inicial de la exposición:** Sprint 1 HU01–HU06 = 19 SP; backlog HU07–HU12 = 28 SP. **No interpretar esos 47 SP como puntos completados**.

## 8. Validación del MVP versus validación de problema

### 8.1. Verificación técnica interna

Permite demostrar que las funciones implementadas corresponden a los requisitos aceptados: formularios, API, persistencia, seguridad básica e historial.

### 8.2. Validación con usuarios representativos (pendiente)

Para comprobar las hipótesis del descubrimiento se recomienda que, cuando sea viable, un técnico real intente completar un escenario de soporte y responda preguntas sobre facilidad, utilidad y datos faltantes.

**Diseño sugerido del ensayo:** explicar tarea, observar pasos y dificultades, recoger comentarios y registrar si las necesidades iniciales se confirman o contradicen. Obtener consentimiento y usar equipos/datos de prueba. **No se reportan entrevistas, encuestas o sesiones que no consten realmente.**

## 9. Hallazgos y lecciones aprendidas (formato a diligenciar)

| Campo | Descripción para registro posterior |
|---|---|
| Hallazgo | Qué se observó objetivamente |
| Fuente | Caso de prueba, demo, decisión HITL o registro Jira |
| Impacto | Requisito, HU o atributo de calidad afectado |
| Acción | Ajuste propuesto o ejecutado |
| Responsable | Integrante asignado |
| Evidencia | Commit, log, archivo o captura correspondiente |
| Estado | Pendiente / ejecutada / verificada |

**Ejemplo documentado de proceso, sin inventar resultados técnicos:** durante la revisión de la etapa de Descubrimiento se aclaró que las necesidades iniciales son hipótesis del equipo, no conclusiones de entrevistas. El registro HITL debe conservar la corrección real y el responsable según la evidencia disponible.

## 10. Conclusiones y decisiones de cierre (plantilla)

Completar después de verificar la ejecución:

- **Versión evaluada / commit:** por registrar.
- **Alcance incluido y excluido:** por registrar según sprint/release real.
- **HU aceptadas:** por registrar contra matriz y evidencias.
- **Pruebas ejecutadas y resultados:** por registrar desde `07-pruebas.md`.
- **Estado de despliegue:** por registrar desde `08-despliegue.md`.
- **Errores conocidos:** por registrar.
- **Aporte comprobado de IA:** por registrar con decisiones HITL.
- **Limitaciones del MVP:** por registrar.
- **Mejoras futuras:** basadas en observaciones y prioridades reales.

No reemplazar estos campos con conclusiones inventadas ni afirmar que TechTrack es un producto completo solo por tener documentación. Un MVP permite verificar el flujo esencial y recoger aprendizaje; su evolución posterior es una fase diferente.

## 11. Gobernanza y evidencia de la etapa

**Asistencia de IA:** estructuración de preguntas, diseño de métricas, interpretación de resultados cuando existan datos, y propuesta de mejoras.  
**Validación humana:** el equipo examina métricas, comprueba las fuentes y aprueba las conclusiones.  
**Evidencias:** `docs/evidencias-ia/etapas/09-evaluacion/`, enlazadas a `docs/evidencias-ia/historias-usuario/HUxx/`, Jira, GitHub y resultados de pruebas.

**Estado final del documento:** protocolo de evaluación listo para aplicarse. **Resultados del MVP: pendientes de incorporar desde ejecuciones verificadas.**
