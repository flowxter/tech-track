# Prompt — Documentación técnica de TechTrack

**Herramienta:** ChatGPT  
**Proyecto:** TechTrack — Gestor de Soporte Técnico  
**Etapa:** 08. Documentación

## Prompt — Elaboración y revisión de la guía técnica

Actúa como un ingeniero de software especializado en documentación técnica, arquitectura de aplicaciones web y mantenimiento de proyectos.

Estamos desarrollando **TechTrack — Gestor de Soporte Técnico**, un Producto Mínimo Viable (MVP) para la asignatura **Proyecto Integrador II de Ingeniería de Sistemas de la Universidad del Valle**.

El proyecto sigue un enfoque de Ingeniería de Software Aumentada con Inteligencia Artificial, en el que utilizamos IA como apoyo para desarrollar, verificar y documentar el software, manteniendo las decisiones finales bajo supervisión humana (HITL).

### 1. Contexto de la aplicación

TechTrack es una aplicación web para registrar y realizar seguimiento a intervenciones de soporte técnico sobre equipos informáticos.

Permite gestionar usuarios, equipos, tareas, estados de intervención, problemas reportados, diagnósticos, actividades realizadas, resultados, evidencias fotográficas e historial de mantenimiento.

Existen dos roles principales:

- **Técnico:** administra sus equipos y tareas, documenta intervenciones y consulta historiales.
- **Administrador:** consulta las actividades registradas por los técnicos. La implementación actual también permite asignar tareas, funcionalidad cuyo alcance debe revisarse frente a los requisitos oficiales.

Las funcionalidades se encuentran definidas mediante 12 historias de usuario, registradas en Jira como `MGDST-1` a `MGDST-12`.

### 2. Tecnologías y estructura

El equipo seleccionó previamente las siguientes tecnologías:

| Componente | Tecnología |
|---|---|
| Frontend | React, TypeScript y Vite |
| Backend | Node.js, Express y TypeScript |
| Base de datos | MongoDB Atlas y Mongoose |
| Autenticación | JWT y bcrypt |
| Validación | Zod |
| Gestión de evidencias | Multer y Sharp |
| Repositorio | GitHub |

El proyecto está organizado principalmente en:

- `front/`: interfaz de usuario y comunicación con la API.
- `back/`: API, autenticación, reglas de negocio y persistencia.
- `docs/`: documentación técnica y evidencias del proceso.

### 3. Objetivo de la solicitud

Necesito **elaborar o revisar una guía técnica completa, clara y concisa**, destinada a estudiantes, desarrolladores y evaluadores que necesiten comprender cómo está construido TechTrack y cómo ejecutarlo localmente.

La guía final se almacenará en:

`docs/documentacion/guia-tecnica.md`

Antes de redactarla, utiliza como fuentes el código del repositorio, los archivos de configuración, el README y la documentación disponible.

**No inventes componentes, funcionalidades, comandos, variables de entorno ni resultados de pruebas.** Si algún elemento no puede verificarse, indícalo explícitamente.

### 4. Contenido requerido

La guía debe incluir las siguientes secciones:

**1. Descripción general**

Explicar brevemente el propósito de TechTrack, el problema que atiende y las funcionalidades principales del MVP.

**2. Tecnologías y arquitectura**

Presentar el stack tecnológico y explicar la comunicación entre frontend, backend y MongoDB.

Describir la separación de responsabilidades sin presentar la aplicación como una arquitectura de microservicios.

**3. Estructura del repositorio**

Mostrar las carpetas y archivos principales, explicando brevemente su función.

**4. Requisitos e instalación**

Identificar las herramientas necesarias para ejecutar el proyecto, instalar dependencias y configurar el entorno.

Incluir comandos concretos y compatibles con la estructura real de las carpetas `front/` y `back/`.

**5. Configuración y ejecución local**

Explicar las variables de entorno necesarias, la conexión con MongoDB Atlas y los comandos para iniciar frontend y backend.

Incluir las direcciones locales de acceso y una verificación básica de funcionamiento.

No incluir credenciales, tokens ni valores secretos.

**6. Componentes funcionales y API**

Describir brevemente los módulos de autenticación, equipos, tareas, documentación, evidencias, historial y administración.

Presentar una tabla con las principales rutas de la API y su propósito, utilizando únicamente rutas existentes.

**7. Compilación y pruebas**

Indicar los comandos para compilar el proyecto y ejecutar las pruebas unitarias disponibles.

Distinguir entre pruebas unitarias, funcionales y de integración.

Incorporar los resultados verificados de la evaluación realizada con Codex, sin presentarlos como ejecuciones nuevas.

**8. Seguridad y limitaciones**

Explicar las medidas principales de autenticación, autorización y protección de datos.

Registrar las limitaciones conocidas y los defectos identificados durante las pruebas, especialmente los relacionados con confidencialidad, validación y persistencia.

**9. Documentación relacionada**

Referenciar los documentos de requisitos, arquitectura, pruebas, evaluación y evidencias de IA existentes en el repositorio.

### 5. Criterios de calidad documental

La guía debe cumplir estas condiciones:

- Utilizar Markdown, compatible con GitHub.
- Mantener un lenguaje técnico, académico y fácil de comprender.
- Ser concreta y evitar explicaciones innecesariamente extensas.
- Utilizar tablas cuando faciliten la consulta.
- No repetir íntegramente información ya documentada en otros archivos.
- No incluir fechas.
- No agregar información ficticia para completar apartados.
- Mantener la numeración oficial de Jira: **HU10 es historial del equipo y HU11 es detalle de tarea**.
- Diferenciar funcionalidades implementadas de funcionalidades verificadas mediante pruebas.
- No afirmar que existe un despliegue público o un pipeline CI/CD si no se dispone de evidencia.
- No presentar el MVP como completamente aceptado mientras existan defectos que impidan su aceptación global.

### 6. Resultado esperado

Entrega el contenido completo del archivo **`guia-tecnica.md`**, listo para copiar al repositorio.

Si ya existe una versión de la guía, revísala y modifica únicamente lo necesario para mejorar su exactitud, claridad, estructura o coherencia con la implementación.

Al finalizar, indica brevemente qué secciones fueron creadas o modificadas y qué información necesita una validación adicional del equipo.

La IA debe apoyar la elaboración documental, pero **las decisiones finales y la aprobación de la guía corresponden al equipo de desarrollo**.