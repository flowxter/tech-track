# Respuesta de IA — Evaluación del MVP

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 09. Evaluación  
**Herramienta:** ChatGPT  
**Fuentes:** documentación del proyecto, Jira y resultados de las auditorías y pruebas ejecutadas por Codex.

## 1. Estado general del MVP

TechTrack es una aplicación web orientada a la gestión y trazabilidad de intervenciones de soporte técnico. Permite registrar usuarios y equipos, gestionar tareas, documentar diagnósticos y actividades, adjuntar evidencias, consultar historiales y supervisar el trabajo realizado.

El MVP contempla **12 historias de usuario**, organizadas en una épica y dos Sprints, con una estimación total de **47 Story Points**.

La evaluación funcional realizada por Codex identificó una implementación operativa de las funcionalidades principales, aunque existen defectos y criterios pendientes que impiden recomendar su aceptación global.

## 2. Cumplimiento funcional

### 2.1. Resultados de las pruebas

| Verificación | Resultado |
|---|---|
| Compilación del frontend | Correcta |
| Compilación del backend | Correcta |
| Pruebas unitarias | 6 aprobadas, 0 fallidas |
| Pruebas API principales | 80 solicitudes: 78 resultados esperados y 2 errores inesperados |
| Diagnóstico API adicional | 5 solicitudes ejecutadas |
| Pruebas de navegador | 25 observaciones registradas |
| Historias que cumplen | 5 |
| Historias que cumplen parcialmente | 7 |

Las pruebas funcionales se ejecutaron mediante API y navegador, utilizando cuentas y registros QA controlados. Las compilaciones y pruebas unitarias pertenecen a la auditoría inicial y no se repitieron durante la evaluación funcional posterior.

### 2.2. Criterios de aceptación

Se contrastaron los **59 criterios oficiales de Jira** correspondientes a las historias `MGDST-1` a `MGDST-12`.

| Clasificación | Cantidad |
|---|---:|
| Cumple | 56 |
| Cumple parcialmente | 1 |
| No cumple | 1 |
| No verificado | 1 |
| **Total** | **59** |

Aunque la mayoría de los criterios obtuvo resultados satisfactorios, esto no equivale a una aceptación completa del MVP, porque también se identificaron defectos de seguridad y comportamiento no contemplados explícitamente en los criterios individuales.

### 2.3. Evaluación por historia de usuario

| HU | Funcionalidad | Resultado |
|---|---|---|
| HU01 | Registro de usuario | Cumple |
| HU02 | Inicio y cierre de sesión | Cumple parcialmente |
| HU03 | Registro de equipos | Cumple parcialmente |
| HU04 | Creación de tareas técnicas | Cumple |
| HU05 | Consulta de tareas | Cumple |
| HU06 | Gestión del estado de tareas | Cumple parcialmente |
| HU07 | Registro de problema y diagnóstico | Cumple |
| HU08 | Registro de actividades y resultados | Cumple parcialmente |
| HU09 | Adjuntar evidencias | Cumple |
| HU10 | Historial del equipo | Cumple parcialmente |
| HU11 | Detalle de tarea | Cumple parcialmente |
| HU12 | Supervisión administrativa | Cumple parcialmente |

**Resultado:** cinco historias cumplen y siete presentan cumplimiento parcial, debido a defectos reproducidos, criterios ambiguos o diferencias entre el comportamiento implementado y el alcance establecido.

## 3. Evaluación de la calidad del software

La revisión técnica y funcional permitió identificar los siguientes aspectos:

| Atributo | Evaluación |
|---|---|
| Funcionalidad | El flujo principal de soporte técnico es operativo, pero existen comportamientos pendientes de corregir. |
| Seguridad | El backend rechazó accesos no autorizados en los casos probados; sin embargo, se reprodujo exposición de información residual entre sesiones en el frontend. |
| Integridad | Se verificó la persistencia de tareas, documentación y evidencias guardadas. Se identificó un problema con cambios pendientes al completar tareas. |
| Mantenibilidad | El proyecto separa frontend, backend, modelos y módulos funcionales. No se realizó una medición formal de mantenibilidad. |
| Verificabilidad | Existen pruebas unitarias y evidencia funcional por API y navegador, aunque la automatización y cobertura todavía pueden ampliarse. |
| Usabilidad | Se comprobaron flujos mediante navegador, pero no se realizaron pruebas formales de usabilidad con usuarios externos. |

Estas conclusiones son cualitativas y corresponden al alcance de las verificaciones realizadas.

## 4. Defectos y limitaciones identificados

| ID | Hallazgo | Impacto |
|---|---|---|
| D01 | Información de una cuenta anterior permanece visible en el frontend después de cambiar de usuario. | **Alto: confidencialidad.** Impide recomendar la aceptación global. |
| D02 | Identificadores mal formados producen respuestas HTTP 500. | Manejo incorrecto de errores de entrada. |
| D03 | Al completar una tarea, cambios sin guardar pueden mostrarse como si hubieran persistido. | Riesgo de confusión y pérdida de modificaciones pendientes. |
| D04 | La pantalla administrativa permite asignar tareas, aunque el alcance de supervisión se definió como consulta. | Requiere decisión sobre el alcance de HU12. |
| D05 | Diferencia entre el campo `id` de `/auth/me` y `_id` declarado en el frontend. | Inconsistencia de contrato sin fallo funcional independiente confirmado. |
| D06 | Diferencias en los metadatos de evidencias entre listado, historial y detalle. | Inconsistencia de representación; las imágenes se recuperaron correctamente desde el detalle. |

El defecto **D01** se reprodujo al cambiar entre dos cuentas técnicas. La API rechazó el acceso a información ajena, pero el navegador conservó y mostró datos previamente cargados. Por tanto, las restricciones del backend no eliminan el problema de confidencialidad observado en el frontend.

También permanecen tres decisiones de producto:

- **HU03:** precisar el alcance de la unicidad del identificador o número de serie de los equipos.
- **HU08:** definir si la fecha de actividad corresponde al registro, la ejecución o ambos.
- **HU12:** decidir si la asignación administrativa debe separarse de la funcionalidad de supervisión o incorporarse formalmente a su alcance.

No se ejecutaron pruebas de carga, rendimiento, concurrencia controlada, accesibilidad completa ni validación con usuarios finales. Tampoco se verificó un despliegue público o pipeline CI/CD automatizado.

## 5. Evaluación del uso de inteligencia artificial

La IA se utilizó como apoyo transversal al proceso de ingeniería de software y no como una funcionalidad integrada en la aplicación.

| Herramienta | Participación | Aporte identificado |
|---|---|---|
| **ChatGPT** | Descubrimiento, requisitos, planificación, arquitectura, documentación y evaluación. | Apoyo para organizar historias, criterios, evidencias, decisiones HITL y elaborar la guía técnica. |
| **Claude** | Desarrollo inicial del MVP. | Generación de la primera versión de la aplicación a partir del contexto, tecnologías y solicitud proporcionados por el equipo. |
| **Codex** | Auditoría técnica y pruebas. | Revisión de código, compilaciones, ejecución de pruebas unitarias y funcionales, identificación de defectos y elaboración de informes. |

### 5.1. Beneficios identificados

- **Apoyo en la definición de requisitos:** se estructuraron 12 historias de usuario con criterios, prioridades y estimaciones.
- **Organización del trabajo:** se propuso una distribución funcional de las historias que sirvió como base para la planificación.
- **Apoyo a la implementación:** Claude permitió obtener una primera versión funcional del proyecto utilizando las tecnologías seleccionadas por el equipo.
- **Verificación técnica:** Codex permitió contrastar el código y el comportamiento real con los criterios oficiales de Jira.
- **Detección de defectos:** las pruebas asistidas por IA identificaron problemas que requieren correcciones antes de aceptar el MVP.
- **Documentación:** ChatGPT apoyó la organización de evidencias, la revisión de consistencia y la generación de una guía técnica.

### 5.2. Limitaciones del uso de IA

La experiencia también evidenció aspectos que requieren supervisión humana:

- Las respuestas de IA pueden contener diferencias de numeración o alcance respecto a los requisitos vigentes.
- Las sugerencias arquitectónicas deben distinguirse de las decisiones tecnológicas previamente tomadas por el equipo.
- La generación de código no garantiza que todas las funcionalidades satisfagan sus criterios de aceptación.
- Los resultados obtenidos mediante inspección de código no sustituyen las pruebas funcionales.
- Las conclusiones de IA deben contrastarse con fuentes verificables, especialmente Jira, el repositorio y las pruebas ejecutadas.
- La conversación de desarrollo disponible todavía no permite reconstruir todas las decisiones intermedias ni cuantificar las propuestas de IA aceptadas o rechazadas.

No se atribuye automáticamente a Claude el origen de los defectos encontrados, porque no se dispone de trazabilidad suficiente para establecer esa causalidad.

## 6. Intervención humana (HITL)

Durante el proyecto se identificaron decisiones del equipo que demuestran el control humano sobre el uso de IA.

| Etapa | Decisión humana |
|---|---|
| Arquitectura | Seleccionar previamente React, TypeScript, Node.js y MongoDB, sin atribuir estas elecciones a Claude. |
| Planificación | Modificar la propuesta de dos épicas y conservar una sola épica para el MVP, manteniendo dos Sprints. |
| Requisitos | Utilizar los criterios registrados en Jira como referencia para comprobar las funcionalidades. |
| Desarrollo | Revisar las instrucciones iniciales de Claude y continuar con la implementación basada en el stack seleccionado. |
| Pruebas | Autorizar únicamente datos QA nuevos, proteger los registros existentes y excluir el cierre de sesión administrativo. |
| Pruebas | Solicitar los resultados de Codex antes de permitir correcciones de código. |
| Documentación | Leer, revisar y aceptar los archivos generados, realizando correcciones para mejorar precisión, concisión y trazabilidad. |

Estas decisiones muestran que la IA actuó como herramienta de apoyo, mientras que el equipo conservó el control sobre el alcance, las tecnologías, las autorizaciones y la documentación.

La aprobación documental no equivale a la aceptación funcional definitiva del software.

## 7. Mejoras recomendadas

Las acciones prioritarias para continuar el desarrollo son:

| Prioridad | Acción |
|---|---|
| **Crítica** | Corregir D01 y repetir las pruebas de aislamiento de información entre usuarios. |
| Alta | Corregir D03 para evitar completar tareas con cambios pendientes sin confirmación. |
| Media | Corregir D02 mediante validación y respuestas controladas para identificadores inválidos. |
| Media | Resolver las ambigüedades de HU03 y HU08 y actualizar los criterios si el equipo lo considera necesario. |
| Media | Revisar el alcance de HU12 y separar o formalizar la asignación administrativa. |
| Baja | Unificar los contratos de datos identificados en D05 y D06. |
| Posterior | Ampliar las pruebas automatizadas, evaluar escenarios de concurrencia y comprobar el proceso de despliegue. |

Las futuras correcciones deberán registrarse en **05 — Desarrollo** y verificarse mediante nuevas pruebas de regresión en **06 — Pruebas**. Posteriormente se actualizará la evaluación con los resultados obtenidos.

