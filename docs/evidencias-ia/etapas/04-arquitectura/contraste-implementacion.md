# Contraste de arquitectura inicial con la implementación identificada

**Fuente complementaria:** auditoría técnica del repositorio y estructura examinada en el commit `ff439c4`.
**Alcance:** inspección de archivos y código, **no** prueba de ejecución ni aprobación del diseño.

| Componente o decisión | Definición previa del equipo | Evidencia de código observada |
|---|---|---|
| Frontend | React + TypeScript | `front/`, `front/src/TechTrackApp.tsx`, `front/src/components/AuthScreen.tsx` |
| Backend | Node.js + TypeScript | `back/`, Express, `back/src/app.ts`, módulos de rutas |
| Persistencia | MongoDB | Mongoose, `back/src/config/database.ts`, esquemas `User`, `Equipment`, `Task`, `Evidence` |
| Interacción cliente-servidor | Separación front/back | `front/src/api.ts` consume endpoints `/api/...` |
| Acceso y roles | Técnico y administrador | JWT y middleware de autenticación / autorización en rutas |
| Equipos y tareas | Gestión y asociación | Módulos `equipment` y `tasks`, referencias Mongoose |
| Evidencias | Imágenes asociadas a tarea | Módulo de evidencias; la auditoría identifica contenido binario guardado en MongoDB |
| Historial | Consulta por equipo | Consulta de tareas asociadas a un equipo; **no** se identificó modelo independiente de historial |
| Supervisión | Consulta administrativa | Módulo `admin` con control de rol |

## Observaciones de coherencia

1. **Stack coincidente:** los componentes principales observados mantienen React/TypeScript, Node/TypeScript y MongoDB, conforme a la presentación.
2. **Estructura separada:** existen `front/` y `back/`, como indicó expresamente el equipo al solicitar apoyo a Claude.
3. **Decisiones posteriores:** Express, Mongoose, JWT, Multer y Sharp son opciones presentes en el código; la presentación por sí sola no acredita cuándo ni quién eligió esas herramientas.
4. **Historial:** la propuesta inicial verbal de Claude hablaba de «recursos distintos»; la implementación identifica un historial derivado de tareas. No se puede afirmar cuándo se acordó esa diferencia sin revisar la conversación completa.
5. **Almacenamiento de imágenes:** la implementación auditada usa documentos de evidencias con contenido binario en MongoDB; no debe documentarse como almacenamiento externo ya decidido.
6. **Limitación de la auditoría:** faltaron dependencias instaladas y configuración local de MongoDB, por lo que no se certificó el flujo completo de extremo a extremo.

## Límites de este contraste

- No confirma aceptación de HU ni pruebas aprobadas.
- No atribuye los cambios de código a Claude sin revisar prompts, respuestas y commits.
- No sustituye `06-arquitectura.md`; si ese documento contiene alternativas propuestas como si fueran la arquitectura real, debe revisarse para reflejar la solución adoptada.
