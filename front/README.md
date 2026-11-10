# React + TypeScript + Vite

## Regresión de TechTrack

Desde la raíz del repositorio, con Node.js compatible con Vite (22.18 o posterior):

```powershell
npm ci --prefix front
npm run test:install --prefix front
npm run test:regression --prefix front
```

Playwright está fijado en `package-lock.json`. `test:install` descarga el Chromium correspondiente una vez; en Linux puede ser necesario instalar también sus dependencias del sistema con `playwright install --with-deps chromium` desde `front/`.
La suite arranca Vite en localhost, desactiva la carga de `.env` y bloquea solicitudes externas. Usa una API y un micrófono simulados, sin Atlas ni proveedores de voz reales.
Como alternativa en Windows puede usarse Edge ya instalado: `$env:TECHTRACK_TEST_BROWSER_CHANNEL='msedge'` antes de ejecutar la regresión. No requiere un runtime externo de Playwright.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
