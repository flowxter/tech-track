# Especificación de Requerimientos — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa del pipeline:** 02. Requerimientos  
**Versión:** 2.0  
**Estado:** Especificación utilizada en el desarrollo; cumplimiento comprobado por separado en QA.

## 1. Propósito y convenciones

Definir el comportamiento esperado del MVP sin mezclar la especificación con los resultados de ejecución. **RF** identifica un requisito funcional; **RNF**, uno no funcional; y **RN**, una regla de negocio. Los requisitos se vinculan a HU01–HU12, cuyos **criterios oficiales** están en Jira (`MGDST-1` a `MGDST-12`).

Las necesidades originales son hipótesis del equipo, según [Descubrimiento](02-descubrimiento.md). Las desviaciones y los resultados de prueba se consultan en [Pruebas](07-pruebas.md).

## 2. Actores y alcance

**Técnico:** administra los equipos y trabajos que le corresponden. **Administrador:** realiza supervisión básica conforme a los permisos establecidos. La solución es una aplicación web con frontend, backend y base de datos; no incluye las funcionalidades empresariales excluidas en Descubrimiento.

## 3. Requisitos funcionales

| ID | Comportamiento requerido | HU |
|---|---|---|
| RF-01 | Registrar un usuario técnico | HU01 |
| RF-02 | Iniciar sesión con credenciales válidas y rechazar las incorrectas | HU02 |
| RF-03 | Cerrar sesión y restringir recursos protegidos | HU02 |
| RF-04 | Registrar un equipo identificable | HU03 |
| RF-05 | Consultar y seleccionar equipos registrados | HU03, HU04 |
| RF-06 | Crear una tarea asociada a un equipo autorizado | HU04 |
| RF-07 | Consultar las tareas correspondientes al técnico | HU05 |
| RF-08 | Actualizar el estado de una tarea conforme al flujo permitido | HU06 |
| RF-09 | Guardar problema reportado y diagnóstico | HU07 |
| RF-10 | Registrar actividades y resultado de una intervención | HU08 |
| RF-11 | Adjuntar y consultar evidencias visuales autorizadas | HU09 |
| RF-12 | Consultar intervenciones anteriores por equipo | HU10 |
| RF-13 | Consultar el detalle técnico de una tarea | HU11 |
| RF-14 | Permitir consulta y supervisión administrativa de actividades | HU12 |

## 4. Datos mínimos y relaciones

| Entidad | Información principal | Relación |
|---|---|---|
| Usuario | Nombre, correo, contraseña protegida, rol | Propietario de equipos y tareas |
| Equipo | Identificador, nombre, tipo, marca, modelo, serial | Pertenece a un usuario |
| Tarea | Equipo, técnico, título, estado, problema, diagnóstico, actividades, resultado | Relacionada con un equipo y un responsable |
| Evidencia | Imagen, metadatos, propietario | Relacionada con una tarea |
| Historial | Referencias a intervenciones de un equipo | Derivado de tareas asociadas |

Los nombres y tipos concretos de campos, índices y colecciones se documentan en [Arquitectura](06-arquitectura.md).

## 5. Requisitos no funcionales

| ID | Atributo | Requisito o condición de verificación |
|---|---|---|
| RNF-01 | Autenticación | Proteger las funciones que requieren sesión |
| RNF-02 | Autorización | Aplicar permisos de usuario y rol en el servidor |
| RNF-03 | Credenciales | No almacenar ni devolver contraseñas en texto plano |
| RNF-04 | Integridad | Rechazar relaciones inválidas entre equipos, tareas y evidencias |
| RNF-05 | Usabilidad | Mostrar estados, formularios y mensajes comprensibles |
| RNF-06 | Compatibilidad | Ofrecer interfaz adaptable a diferentes tamaños de pantalla |
| RNF-07 | Archivos | Validar formato y tamaño de evidencias en el backend |
| RNF-08 | Privacidad | Restringir la consulta de información y archivos ajenos |
| RNF-09 | Rendimiento | Evaluar tiempos de respuesta bajo escenario acordado; sin meta cuantitativa aprobada |
| RNF-10 | Mantenibilidad | Separar responsabilidades, utilizar TypeScript y versionar el código |
| RNF-11 | Confiabilidad | Comunicar errores y evitar confirmar operaciones no guardadas |
| RNF-12 | Verificabilidad | Relacionar HU, criterios, pruebas y evidencias |

No se asumen mediciones formales de rendimiento, accesibilidad o compatibilidad que no se hayan ejecutado.

## 6. Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | Cada tarea debe vincularse con un equipo registrado y autorizado |
| RN-02 | El flujo de estados es **Pendiente → En progreso → Completada** |
| RN-03 | Problema, diagnóstico, actividades, resultado y evidencias pertenecen a la tarea correspondiente |
| RN-04 | El historial presenta intervenciones del equipo consultado, sin mezclar equipos |
| RN-05 | La supervisión definida en HU12 tiene propósito de consulta; la asignación en la misma pantalla es una limitación conocida |
| RN-06 | Los usuarios sin autorización no pueden alterar tareas ajenas |
| RN-07 | El identificador de equipo es único **por técnico**; el serial puede repetirse |

**Aspectos no resueltos completamente:** HU08 requiere precisar qué se entiende por fecha de actividad; HU12 requiere conciliar la supervisión consultiva con la asignación implementada. La decisión de conservar ambas funcionalidades sin nuevos ajustes se registra en [Evaluación](09-evaluacion.md).

## 7. Restricciones técnicas

El stack acordado e implementado utiliza React/TypeScript, Node.js/TypeScript, Express y MongoDB Atlas. Se emplean JWT y validación del servidor. Los contratos y la implementación real son responsabilidad de [Arquitectura](06-arquitectura.md); las restricciones específicas de Vercel se explican en [Despliegue](08-despliegue.md).

## 8. Trazabilidad y validación humana

La relación de referencia es **RF/RNF/RN → HU → criterio oficial de Jira → prueba → resultado → evidencia**. La matriz por HU y los criterios completos pertenecen al [Product Backlog](04-product-backlog.md) y a Jira, respectivamente; no se transcriben aquí.

ChatGPT apoyó la estructuración de la especificación. Las decisiones funcionales concretas corresponden al equipo y deben conservar su soporte en `evidencias-ia/etapas/02-requerimientos/`.

**Estado final:** requisitos especificados y utilizados como entrada de Arquitectura y Desarrollo; su cumplimiento se reporta exclusivamente en la etapa de Pruebas.
