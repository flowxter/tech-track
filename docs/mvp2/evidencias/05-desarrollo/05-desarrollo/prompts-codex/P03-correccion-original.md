# TechTrack MVP2 — Corrección de defectos prioritarios

Continúa trabajando como ingeniero de software senior en el proyecto TechTrack.

Ya realizaste una auditoría técnica e identificaste 14 hallazgos, desde A01 hasta A14.

**Ahora autorizo implementar únicamente A01, A02, A03, A04 y A12.**

El objetivo es corregir los defectos de mayor prioridad y conseguir una ejecución reproducible de las pruebas frontend, sin alterar el funcionamiento general del MVP.

## 1. Preparación del repositorio

La auditoría identificó que la copia local estaba en el commit `31ac07a`, mientras que el código de voz se encuentra en `main`, commit `92abf9d` al momento de la auditoría.

Antes de modificar código:

- Comprueba el estado del repositorio y si existen cambios locales.
- Obtén la referencia actual de `origin/main`.
- No sobrescribas cambios locales ni ejecutes comandos destructivos.
- Trabaja desde una rama nueva basada en la versión actual de `origin/main`, que incluya el módulo de voz.
- Utiliza como nombre sugerido `fix/mvp2-voz-estabilidad`.

No modifiques directamente `main`.

## 2. Correcciones autorizadas

### A01 — Modelo de AssemblyAI

Archivo principal: `back/src/modules/voice/assemblyAiClient.ts`.

Actualiza la selección del modelo obsoleto `universal-3-pro`.

Consulta la documentación oficial y utiliza una configuración vigente compatible con el español, priorizando `universal-3-5-pro` y conservando `universal-2` como respaldo cuando corresponda.

Actualiza las pruebas de contrato.

No utilices una API key real y no consumas créditos del proveedor.

### A02 — Control del micrófono

Archivo principal: `front/src/voice/useVoiceRecorder.ts`.

Corrige los problemas relacionados con:

- Excepciones durante la construcción e inicio de MediaRecorder.
- Grabaciones iniciadas simultáneamente.
- Permisos concedidos después de cerrar un componente.
- Streams que quedan abiertos.
- Limpieza de temporizadores y pistas de audio.
- Desmontaje del componente durante una grabación.

Garantiza que los recursos se liberen correctamente en todas las rutas de error.

Agrega pruebas que reproduzcan los defectos encontrados.

### A03 — Interpretación de asignaciones ambiguas

Archivo principal: `back/src/modules/voice/taskDictation.ts`.

Corrige la selección incorrecta de técnicos cuando:

- Se mencionan dos o más nombres.
- Se usa una negación como «no asignar a Juan».
- Hay coincidencias parciales.
- No existe una coincidencia suficientemente confiable.

**Nunca selecciones automáticamente una persona cuando el dictado sea ambiguo.**

En esos casos, devuelve una selección pendiente para que el usuario confirme manualmente.

Conserva las funcionalidades de reconocimiento de equipos y técnicos que ya funcionan.

### A04 — Asociaciones anteriores en formularios

Archivos principales:

- `front/src/components/AssignmentForm.tsx`
- `front/src/components/NewTaskForm.tsx`

Cuando un nuevo dictado no identifique claramente un equipo o técnico, no debe conservar silenciosamente una asociación anterior como si perteneciera al nuevo dictado.

Implementa una solución que:

- Evite asociaciones accidentales.
- Informe claramente al usuario.
- Permita seleccionar manualmente los valores correctos.
- Mantenga la revisión humana antes de guardar.
- No elimine automáticamente el texto que el usuario haya escrito.

Agrega pruebas de regresión para el escenario de dos dictados consecutivos con diferentes resultados.

### A12 — Dependencias de pruebas frontend

Archivos principales:

- `front/package.json`
- `front/package-lock.json`
- `front/tests/regression.mjs`

Incorpora correctamente la dependencia de Playwright utilizada por las pruebas.

Asegura que una instalación limpia permita ejecutar la regresión frontend siguiendo instrucciones reproducibles.

No sustituyas las pruebas por mocks vacíos ni las desactives para conseguir resultados aprobados.

## 3. Requisitos de implementación

Aplica Clean Code, TypeScript estricto y separación de responsabilidades.

Mantén las interfaces y contratos existentes siempre que sea posible.

No cambies el stack ni reescribas módulos completos innecesariamente.

No modifiques `.env`, claves, MongoDB de producción ni el despliegue público.

No implementes todavía los demás hallazgos A05–A11, A13 y A14, salvo cambios mínimos indispensables que debas justificar explícitamente.

## 4. Validación obligatoria

Después de implementar las correcciones:

1. Ejecuta el build de frontend y backend.
2. Ejecuta las pruebas unitarias y de regresión del backend.
3. Ejecuta las pruebas de regresión frontend.
4. Añade casos específicos para A01, A02, A03 y A04.
5. Verifica que las funcionalidades anteriores de dictado y lectura no se hayan afectado.
6. Comprueba que no se haya expuesto información sensible.
7. Informa cualquier prueba que no hayas podido ejecutar y explica por qué.

Usa proveedores simulados y datos aislados. No conectes servicios que generen consumo ni modifiques datos reales.

## 5. Entrega esperada

Al finalizar, entrega un informe con:

- Archivos modificados.
- Cambios realizados por hallazgo.
- Pruebas añadidas.
- Comandos ejecutados.
- Número de pruebas aprobadas, fallidas y omitidas.
- Problemas que todavía existen.
- Confirmación de la rama y el commit utilizados.

Puedes modificar el código en la rama de trabajo y ejecutar las pruebas.

**No hagas merge a `main`, no publiques cambios en Vercel y no crees un Pull Request sin mi autorización.**

Detente después de implementar y verificar estas cinco correcciones para que podamos revisar el resultado antes de continuar.
