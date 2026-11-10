# Resultados automatizados reportados por Codex — MVP2

| Ejecución | Backend | Frontend | Observaciones |
|---|---|---|---|
| Auditoría inicial | 33/33 aprobadas | 0 ejecutadas | Playwright no instalado; 10 reproducciones diagnósticas adicionales |
| Corrección A01, A02, A03, A04 y A12 | 52/52 aprobadas | 32/32 aprobadas | 19 nuevos casos backend, 14 nuevos casos frontend; builds y TypeScript aprobados |
| Revisión posterior A02/A04 | 52/52 aprobadas | 40/40 aprobadas | Finalización del audio nativo de Chromium con entrada simulada; conflictos de dictados consecutivos; 0 fallidas y 0 omitidas |
| Revisión posterior A03 | 72/72 aprobadas | 40/40 aprobadas | 20 nuevos casos backend sobre negaciones y antecedentes; 0 fallidas y 0 omitidas |

## Comandos de la primera ejecución de corrección

- `npm run build --prefix back` — aprobado.
- `npm run build --prefix front` — aprobado.
- `npm test --prefix back` — 52 aprobadas, 0 fallidas, 0 omitidas.
- `npm run test:regression --prefix front` — 32 aprobadas, 0 fallidas, 0 omitidas.
- `npm run test:install --prefix front` — instalación de Chromium completada.
- `npm run lint --prefix front` — sin errores, una advertencia previa.
- `git diff --check` — aprobado.

## Comandos de las revisiones posteriores

| Comando | Revisión A02/A04 | Revisión A03 |
|---|---|---|
| `npm test --prefix back` | 52 aprobadas, 0 fallidas, 0 omitidas | 72 aprobadas, 0 fallidas, 0 omitidas |
| `npm run test:regression --prefix front` | 40 aprobadas, 0 fallidas, 0 omitidas | 40 aprobadas, 0 fallidas, 0 omitidas |
| `npm run build --prefix back` | Aprobado | Aprobado |

En A02/A04 también aprobaron el build frontend, TypeScript con `--strict --noEmit` y lint, este último con una advertencia preexistente. En la revisión posterior de A03 no se volvió a ejecutar el build frontend ni lint; el frontend se mantuvo intacto y se repitió su regresión.

**Alcance:** los resultados históricos proceden de las respuestas de Codex; los posteriores de las salidas reales del terminal conservadas en el historial de trabajo. Este archivo es una síntesis documental, no un log original exportado ni una ejecución nueva. Las filas corresponden a suites sucesivas y no se suman. Se simularon proveedores y persistencia; la grabación nativa utilizó Chromium con entrada simulada. No se validaron proveedores reales ni se desplegó la rama local.
