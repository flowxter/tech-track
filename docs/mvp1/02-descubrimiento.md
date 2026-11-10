# Descubrimiento del Proyecto — TechTrack

**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa del pipeline:** 01. Descubrimiento  
**Versión:** 2.0  
**Estado:** Hipótesis y alcance inicial documentados; validación con usuarios externos pendiente.

## 1. Problema e hipótesis

El equipo identificó una posible dificultad en la gestión de soporte informático: la información sobre equipos, tareas, diagnósticos, intervenciones y evidencias puede estar dispersa entre mensajes, notas, fotografías y archivos independientes. Esto podría dificultar el seguimiento de trabajos y la recuperación de antecedentes técnicos.

Se formularon **hipótesis**, no hallazgos de entrevistas o encuestas:

- La dispersión de registros dificulta saber qué trabajos están pendientes o terminados.
- La falta de relación entre equipo e intervención reduce la trazabilidad.
- Las evidencias separadas de las tareas complican documentar el trabajo realizado.
- Consultar antecedentes de un equipo puede requerir revisar distintas fuentes.

**Límite:** no hay evidencia de validación del problema con técnicos representativos; que el software funcione no prueba por sí mismo su utilidad o adopción.

## 2. Usuarios propuestos

| Actor | Necesidad hipotética | Participación en el MVP |
|---|---|---|
| Técnico de soporte | Organizar intervenciones y conservar su documentación | Registrar equipos, gestionar tareas, documentar y consultar historial |
| Administrador o supervisor | Revisar el trabajo registrado por técnicos | Consultar tareas, estados y documentación |

Como usuarios potenciales se consideraron técnicos independientes, personal de pequeñas empresas y practicantes de mantenimiento. La pertenencia real de estos grupos al mercado objetivo requiere comprobación posterior.

## 3. Propuesta de valor

**Permitir que el técnico sepa qué tiene que hacer, qué está haciendo, qué hizo y qué evidencia dejó, desde un mismo lugar.**

La característica diferenciadora propuesta respecto de un gestor de tareas genérico es la relación:

**Equipo → Tarea → Diagnóstico → Intervención → Evidencia → Historial.**

## 4. Objetivos

**Objetivo general:** desarrollar un MVP web para registrar, gestionar y consultar actividades de mantenimiento informático y su documentación técnica.

**Objetivos específicos:** facilitar autenticación, registro de equipos, creación y seguimiento de tareas, documentación de intervenciones, adjuntos visuales, historial por equipo y consulta administrativa básica. Asimismo, aplicar y documentar un proceso de ingeniería de software asistido por IA y revisado por personas.

## 5. Alcance y exclusiones

El alcance inicial corresponde a las 12 historias formalizadas en [Product Backlog](04-product-backlog.md). El MVP es una **aplicación web**; no una aplicación móvil nativa ni una plataforma empresarial de soporte.

Quedaron fuera del alcance inicial: facturación, inventario empresarial completo, tickets con SLA avanzados, chat interno, integraciones de mensajería, diagnóstico predictivo mediante IA, ejecución remota, paneles empresariales avanzados y arquitectura multiempresa.

El detalle verificable de funcionalidades y restricciones pertenece a [Requerimientos](03-requerimientos.md); aquí se preserva su intención inicial.

## 6. Escenario ilustrativo

Un técnico recibe un computador con una falla de almacenamiento. Ingresa a la aplicación, selecciona el equipo, registra una tarea, documenta el problema y el diagnóstico, consigna la intervención y el resultado, adjunta una imagen y consulta posteriormente el historial.

Este escenario **ilustra el valor esperado**; no se presenta como intervención física real ni como prueba de usabilidad con un técnico externo.

## 7. Riesgos y aprendizaje pendiente

| Riesgo de descubrimiento | Respuesta prevista |
|---|---|
| Ampliar excesivamente el producto | Priorizar el flujo central y excluir funciones empresariales |
| Construir un gestor de tareas sin documentación técnica | Conservar la relación entre tarea, equipo e intervención |
| Accesos indebidos a información | Definir autorización y comprobarla en pruebas |
| Depender acríticamente de IA | Aplicar revisión HITL y conservar evidencias |
| Basarse solo en suposiciones | Validar posteriormente con técnicos representativos |

El siguiente trabajo de validación del problema consistiría en observar a un técnico completar un escenario y recoger comentarios sobre utilidad, facilidad y datos faltantes. **No se registran aquí estudios de usuarios no realizados.**

## 8. Salida de la etapa

Este descubrimiento alimentó la especificación de requisitos y el backlog. Las capacidades construidas y sus resultados técnicos se documentan en [Pruebas](07-pruebas.md), mientras que la distinción entre **verificación técnica** y **validación de la necesidad** se desarrolla en [Evaluación](09-evaluacion.md).

**Estado final:** hipótesis y propuesta de valor delimitadas; validación externa pendiente.
