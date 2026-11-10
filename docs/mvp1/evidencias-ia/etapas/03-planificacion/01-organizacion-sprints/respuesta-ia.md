ÉPICA 1 — Gestión de usuarios, equipos y tareas técnicas
Objetivo de la épica

Permitir que un técnico pueda acceder al sistema, registrar los equipos sobre los que trabaja y gestionar sus tareas técnicas.

Al finalizar el Sprint 1, el usuario debe poder realizar este flujo:

Registrarse → iniciar sesión → registrar un equipo → crear una tarea → consultar sus tareas → cambiar su estado.

Esta épica recoge principalmente las funcionalidades de acceso, equipos y gestión básica de tareas planteadas en el documento.

HU-01 — Registro de usuario

Como técnico de soporte,
quiero registrarme en la aplicación,
para poder acceder al sistema y gestionar mis actividades técnicas.

Criterios de aceptación

CA-01 — Registro exitoso

Dado que el técnico no tiene una cuenta registrada.
Cuando proporciona los datos obligatorios y selecciona "Registrarse".
Entonces el sistema debe crear la cuenta y mostrar un mensaje de registro exitoso.

CA-02 — Datos obligatorios

Dado que el técnico intenta registrarse.
Cuando omite uno o más campos obligatorios.
Entonces el sistema debe indicar qué información falta y no crear la cuenta.

CA-03 — Usuario existente

Dado que el correo ya está registrado.
Cuando el técnico intenta crear una nueva cuenta con ese correo.
Entonces el sistema debe rechazar el registro e informar que el usuario ya existe.
Frontend
Crear formulario de registro.
Validar campos obligatorios.
Mostrar mensajes de error.
Consumir el endpoint de registro.
Mostrar confirmación de registro exitoso.
Evitar múltiples envíos accidentales del formulario.
Backend
Crear endpoint de registro.
Validar los datos recibidos.
Verificar que el usuario no exista.
Almacenar el usuario en la base de datos.
Proteger adecuadamente la contraseña mediante hash.
Retornar respuestas HTTP apropiadas.
QA / Tester

Debe validar:

Registro con datos correctos.
Registro con campos vacíos.
Registro con formato de correo inválido.
Registro de correo existente.
Contraseña inválida, si se establecen reglas de contraseña.
Persistencia correcta del usuario en la base de datos.
Que la contraseña no se almacene en texto plano.
HU-02 — Inicio y cierre de sesión

Como técnico de soporte,
quiero iniciar y cerrar sesión,
para acceder de forma segura a mis tareas y proteger mi información.

Criterios de aceptación

CA-01 — Inicio de sesión exitoso

Dado que el técnico tiene una cuenta registrada.
Cuando proporciona credenciales válidas.
Entonces el sistema debe autenticarlo y permitirle acceder a la aplicación.

CA-02 — Credenciales incorrectas

Dado que el técnico proporciona credenciales incorrectas.
Cuando intenta iniciar sesión.
Entonces el sistema debe rechazar el acceso y mostrar un mensaje apropiado.

CA-03 — Cierre de sesión

Dado que el técnico tiene una sesión activa.
Cuando selecciona "Cerrar sesión".
Entonces la sesión debe finalizar y el usuario debe ser redirigido a la pantalla de acceso.
Frontend
Crear formulario de login.
Manejar estados de carga y error.
Guardar/manejar correctamente la sesión.
Implementar cierre de sesión.
Proteger las vistas privadas.
Backend
Crear endpoint de autenticación.
Validar credenciales.
Implementar mecanismo de sesión/token.
Proteger endpoints que requieren autenticación.
Invalidar o eliminar la sesión/token según la estrategia utilizada.
QA / Tester

Validar:

Login correcto.
Contraseña incorrecta.
Usuario inexistente.
Campos vacíos.
Acceso a rutas privadas sin autenticación.
Cierre de sesión.
Intento de utilizar funcionalidades después de cerrar sesión.
HU-03 — Gestión básica de equipos

Como técnico de soporte,
quiero registrar y consultar los equipos,
para asociar cada actividad técnica con el equipo correspondiente.

La información planteada para el MVP incluye identificador, nombre/descripción, tipo, marca, modelo y número de serie.

Criterios de aceptación

CA-01 — Registrar equipo

Dado que el técnico está autenticado.
Cuando proporciona la información requerida del equipo.
Entonces el sistema debe registrar el equipo.

CA-02 — Consultar equipos

Dado que existen equipos registrados.
Cuando el técnico accede al listado.
Entonces debe visualizar los equipos que puede gestionar.

CA-03 — Información obligatoria

Dado que el técnico intenta registrar un equipo.
Cuando omite información requerida.
Entonces el sistema debe impedir el registro y mostrar el error correspondiente.
Frontend
Formulario de registro de equipo.
Listado de equipos.
Validaciones.
Mensajes de éxito/error.
Selector o mecanismo para elegir un equipo al crear una tarea.
Backend
Modelo de equipo.
Endpoint para registrar equipos.
Endpoint para consultar equipos.
Validaciones.
Relación entre usuario/equipo según las reglas definidas.
QA / Tester

Validar:

Registro correcto.
Campos obligatorios.
Datos inválidos.
Consulta del listado.
Asociación de equipo con una tarea.
Acceso no autorizado a información de equipos.
HU-04 — Crear tarea técnica

Como técnico de soporte,
quiero crear una tarea técnica asociada a un equipo,
para registrar el trabajo que debo realizar.

La creación de tareas forma parte explícita del alcance del MVP.

Criterios de aceptación

CA-01 — Crear tarea

Dado que el técnico está autenticado y existe un equipo.
Cuando registra la información requerida de una tarea y la asocia a un equipo.
Entonces la tarea debe ser creada con estado Pendiente.

CA-02 — Asociación obligatoria

Dado que el técnico está creando una tarea.
Cuando no selecciona un equipo requerido.
Entonces el sistema debe impedir la creación.

CA-03 — Fecha de creación

Dado que se crea una tarea.
Entonces el sistema debe registrar automáticamente su fecha de creación.
Frontend
Formulario de creación.
Selector de equipo.
Campos de la tarea.
Validaciones.
Mensaje de creación exitosa.
Redirección al listado o detalle.
Backend
Endpoint para crear tareas.
Modelo de tarea.
Relación tarea-equipo.
Asignación automática del estado inicial.
Registro de fecha de creación.
Validación de usuario autenticado.
QA / Tester

Validar:

Creación correcta.
Tarea sin equipo.
Datos incompletos.
Estado inicial.
Fecha de creación.
Asociación correcta con el equipo.
HU-05 — Consultar tareas

Como técnico de soporte,
quiero consultar mis tareas,
para conocer las actividades pendientes y su estado actual.

Los estados definidos inicialmente son Pendiente, En progreso y Completada.

Criterios de aceptación

CA-01 — Listado

Dado que el técnico tiene tareas registradas.
Cuando accede al módulo de tareas.
Entonces debe visualizar sus tareas.

CA-02 — Estado

Cada tarea debe mostrar como mínimo su estado actual.

CA-03 — Sin tareas

Dado que el técnico no tiene tareas.
Cuando accede al módulo.
Entonces el sistema debe mostrar un estado vacío informativo.
Frontend
Vista de listado.
Mostrar información relevante.
Mostrar estado.
Manejar estado vacío.
Permitir acceder al detalle de una tarea.
Backend
Endpoint para consultar tareas.
Filtrar las tareas según el usuario autenticado.
Retornar información necesaria.
Evitar que un técnico consulte tareas de otro usuario sin autorización.
QA / Tester

Validar:

Listado correcto.
Tareas de diferentes usuarios.
Estado mostrado.
Estado vacío.
Restricciones de acceso.
HU-06 — Gestionar estado de la tarea

Como técnico de soporte,
quiero cambiar el estado de una tarea,
para indicar si el trabajo está pendiente, en progreso o completado.

Criterios de aceptación

CA-01 — Pendiente a progreso

Una tarea pendiente puede pasar a En progreso.

CA-02 — Progreso a completada

Una tarea en progreso puede pasar a Completada cuando se cumplen las condiciones definidas para finalizarla.

CA-03 — Estado válido

El sistema solamente debe permitir los estados definidos por el MVP.

CA-04 — Persistencia

Al cambiar el estado, el nuevo estado debe permanecer almacenado al actualizar o volver a consultar la tarea.

Frontend
Control para modificar el estado.
Mostrar estado actualizado.
Confirmación visual.
Manejar errores del servidor.
Backend
Endpoint para actualizar estado.
Validar transición de estados.
Persistir el cambio.
Validar autorización.
QA / Tester

Probar:

Pendiente → En progreso.
En progreso → Completada.
Estados inválidos.
Cambios no autorizados.
Persistencia del estado.
Recarga de la aplicación.
🎯 Resultado esperado del Sprint 1

Al terminar este sprint debe existir un incremento funcional donde un técnico pueda:

Crear una cuenta → iniciar sesión → registrar un equipo → crear una tarea asociada → consultar la tarea → cambiar su estado.

Esto constituye una primera versión utilizable del producto, aunque todavía no tenga la documentación técnica completa.

ÉPICA 2 — Documentación técnica, evidencias e historial
Objetivo de la épica

Permitir que el técnico pueda documentar qué encontró, qué hizo y qué resultado obtuvo, adjuntar evidencias y posteriormente consultar el historial técnico del equipo.

Esto corresponde directamente al núcleo diferencial del proyecto: problema reportado, diagnóstico, actividades, resultado, recomendaciones, evidencias e historial.

HU-07 — Registrar diagnóstico y problema

Como técnico de soporte,
quiero registrar el problema reportado y el diagnóstico realizado,
para documentar la situación encontrada en el equipo.

Criterios de aceptación

CA-01 — Problema reportado

Dado que existe una tarea asociada a un equipo.
Cuando el técnico registra el problema reportado.
Entonces la información debe quedar asociada a la tarea.

CA-02 — Diagnóstico

El técnico debe poder registrar el diagnóstico realizado.

CA-03 — Actualización

El técnico debe poder modificar la información mientras la tarea no se encuentre cerrada, según las reglas definidas.
Frontend
Campos para problema reportado.
Campo para diagnóstico.
Edición de información.
Validaciones.
Mensajes de guardado.
Backend
Endpoint para registrar/actualizar diagnóstico.
Relacionar diagnóstico con tarea.
Validar permisos.
Persistir información.
QA / Tester

Validar:

Registro correcto.
Campos vacíos.
Actualización.
Asociación con la tarea correcta.
Restricciones de acceso.
HU-08 — Registrar actividades y resultado

Como técnico de soporte,
quiero registrar las actividades realizadas y el resultado obtenido,
para conservar la documentación del trabajo técnico realizado.

El documento contempla explícitamente actividades realizadas, resultado y recomendaciones.

Criterios de aceptación

CA-01 — Actividades realizadas

El técnico puede describir las acciones ejecutadas.

CA-02 — Resultado

El técnico puede registrar el resultado obtenido después de la intervención.

CA-03 — Recomendaciones

El técnico puede registrar recomendaciones u observaciones.

CA-04 — Persistencia

La información debe permanecer asociada a la tarea.
Frontend
Formulario de documentación.
Campos de actividad, resultado y recomendaciones.
Visualización de la información guardada.
Backend
Persistencia de la documentación.
Relación con tarea y equipo.
Validaciones.
Registro de fecha de actualización/finalización cuando corresponda.
QA / Tester

Validar:

Guardado.
Edición.
Persistencia.
Datos incompletos.
Asociación correcta.
Visualización posterior.
HU-09 — Adjuntar evidencias

Como técnico de soporte,
quiero adjuntar evidencias a una tarea,
para demostrar visualmente el trabajo realizado.

El alcance inicial contempla principalmente imágenes como fotografías del equipo, componentes y capturas de pantalla.

Criterios de aceptación

CA-01 — Adjuntar imagen

Dado que existe una tarea.
Cuando el técnico selecciona una imagen válida.
Entonces el sistema debe asociarla a la tarea.

CA-02 — Formato

El sistema debe aceptar únicamente los formatos definidos para el MVP.

CA-03 — Tamaño

El sistema debe rechazar archivos que superen el tamaño máximo establecido.

CA-04 — Visualización

El técnico debe poder visualizar las evidencias asociadas a la tarea.
Frontend
Selector/cargador de archivos.
Previsualización.
Indicador de carga.
Mensajes de error.
Galería o listado de evidencias.
Backend
Endpoint de carga.
Validación de formato.
Validación de tamaño.
Almacenamiento.
Asociación archivo-tarea.
Control de acceso.
QA / Tester

Probar:

Imagen válida.
Formato no permitido.
Archivo demasiado grande.
Archivo corrupto.
Múltiples evidencias.
Visualización.
Acceso no autorizado.
HU-10 — Consultar detalle de una tarea

Como técnico de soporte,
quiero consultar el detalle completo de una tarea,
para revisar toda la información relacionada con el trabajo técnico.

La HU original de detalle se mantiene porque permite integrar las funcionalidades anteriores en una sola vista de negocio.

Criterios de aceptación

La vista debe permitir consultar:

Información de la tarea.
Equipo asociado.
Estado.
Problema reportado.
Diagnóstico.
Actividades realizadas.
Resultado.
Recomendaciones.
Evidencias.
Fechas relevantes.
Frontend

Crear una vista de detalle que integre toda la información.

Backend

Crear endpoint para obtener el detalle completo de la tarea.

QA / Tester

Verificar que:

Toda la información corresponde a la tarea seleccionada.
Las evidencias corresponden a esa tarea.
El usuario no pueda consultar información no autorizada.
La información permanezca consistente.
HU-11 — Consultar historial del equipo

Como técnico de soporte,
quiero consultar el historial de actividades de un equipo,
para conocer las intervenciones realizadas anteriormente.

El documento plantea precisamente una trazabilidad como:

Equipo PC-001 → limpieza → cambio de RAM → actualización del sistema operativo.

Criterios de aceptación

CA-01 — Historial

Dado que un equipo tiene actividades registradas.
Cuando el técnico consulta el historial.
Entonces debe visualizar las intervenciones relacionadas con ese equipo.

CA-02 — Orden

Las actividades deben mostrarse con sus fechas correspondientes y en un orden definido por el equipo.

CA-03 — Sin historial

Si el equipo no tiene intervenciones registradas, debe mostrarse un mensaje informativo.
Frontend
Vista de historial.
Identificación del equipo.
Fecha.
Descripción resumida de intervención.
Acceso al detalle.
Backend
Endpoint de historial.
Consulta por equipo.
Ordenamiento.
Validación de autorización.
QA / Tester

Validar:

Historial correcto.
Orden de registros.
Equipo sin historial.
Historial de diferentes equipos.
Restricciones de acceso.
HU-12 — Supervisión de actividades

Como administrador,
quiero consultar las actividades realizadas por los técnicos,
para supervisar el trabajo registrado en la aplicación.

Esta HU corresponde a la funcionalidad secundaria de administración planteada en el MVP.

Criterios de aceptación

CA-01 — Acceso administrativo

Solo los usuarios con rol de administrador podrán acceder al módulo.

CA-02 — Consulta

El administrador podrá consultar las actividades registradas.

CA-03 — Información

La consulta debe permitir identificar como mínimo:

Técnico.
Equipo.
Actividad.
Estado.
Fecha.
Frontend
Vista administrativa.
Listado de actividades.
Información del técnico y equipo.
Estados y fechas.
Backend
Endpoint administrativo.
Validación de rol.
Consulta de actividades.
Restricción de acceso a usuarios no administradores.
QA / Tester

Validar:

Acceso como administrador.
Acceso como técnico.
Información mostrada.
Restricciones de autorización.
Consistencia de datos.