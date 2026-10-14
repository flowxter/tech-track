import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

// Playwright se puede resolver desde un runtime externo, sin instalar dependencias.
const require = createRequire(process.env.TECHTRACK_TEST_NODE_MODULES
  ? `${process.env.TECHTRACK_TEST_NODE_MODULES}/package.json` : import.meta.url)
const { chromium } = require('playwright')
const server = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), configFile: false,
  envDir: false, logLevel: 'error', plugins: [react()], server: { host: '127.0.0.1', port: 0 },
  define: { 'import.meta.env.VITE_API_URL': JSON.stringify('http://techtrack.mock.invalid/api') } })
await server.listen()
const address = server.httpServer.address()
const browser = await chromium.launch({ headless: true, ...(process.env.TECHTRACK_TEST_BROWSER_CHANNEL ? { channel: process.env.TECHTRACK_TEST_BROWSER_CHANNEL } : {}) })
const results = []
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const stamp = '2000-01-01T00:00:00.000Z'
const profiles = {
  A: { _id: 'a'.repeat(24), name: 'Técnico A', email: 'a@example.invalid', role: 'TECHNICIAN' },
  B: { _id: 'b'.repeat(24), name: 'Técnico B', email: 'b@example.invalid', role: 'TECHNICIAN' },
}
function fixtures(actor) {
  const equipment = { _id: actor.toLowerCase().repeat(24), assetTag: `EQUIPO_${actor}`, name: `EQUIPO_PRIVADO_${actor}`, type: 'Laptop', brand: 'Fixture', model: 'Test', serialNumber: actor, createdAt: stamp }
  const evidence = { _id: 'e'.repeat(24), filename: `EVIDENCIA_${actor}.png`, mimeType: 'image/png', size: 68, uploadedAt: stamp, url: `/tasks/${actor}/evidence/e/content` }
  const task = { _id: actor, title: `TAREA_PRIVADA_${actor}`, description: `DESCRIPCION_${actor}`, problemReported: `PROBLEMA_${actor}`, diagnosis: `DIAGNOSTICO_${actor}`, activities: `ACTIVIDADES_${actor}`, result: `RESULTADO_${actor}`, recommendations: `RECOMENDACIONES_${actor}`, equipment, status: 'IN_PROGRESS', statusHistory: [], evidence: [evidence], createdAt: stamp, updatedAt: stamp }
  return { task, equipment }
}
async function setup(options = {}) {
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const state = { A: fixtures('A'), B: fixtures('B'), statusWrites: 0, docsWrites: 0, detailsStarted: 0, historyStarted: 0, imageStarted: 0, imageURLs: 0, revokedURLs: 0 }
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    window.__sessionLeaks = []
    window.__createdURLs = []
    window.__revokedURLs = []
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL)
    URL.createObjectURL = (blob) => { const url = create(blob); window.__createdURLs.push(url); return url }
    URL.revokeObjectURL = (url) => { window.__revokedURLs.push(url); revoke(url) }
    new MutationObserver(() => {
      const text = document.body?.innerText ?? ''
      const values = Array.from(document.querySelectorAll('textarea')).map((item) => item.value).join(' ')
      if (text.includes('Técnico B') && /PRIVAD[AO]_A|DIAGNOSTICO_A|ACTIVIDADES_A|EVIDENCIA_A/.test(text + values)) window.__sessionLeaks.push('Datos A visibles junto al perfil B')
    }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true })
  })
  await page.route('**/*', async (route) => {
    const request = route.request(), url = new URL(request.url())
    if (url.hostname === '127.0.0.1') return route.continue()
    if (url.hostname !== 'techtrack.mock.invalid') return route.abort()
    const path = url.pathname.replace('/api', '')
    const actor = request.headers().authorization?.endsWith('fixture-B') ? 'B' : 'A'
    const data = state[actor]
    const json = async (payload, status = 200) => { try { await route.fulfill({ status, json: payload }) } catch { /* La sesión puede haber abortado la solicitud. */ } }
    if (path === '/auth/login') {
      await delay(options.loginDelay ?? 0)
      const profile = request.postDataJSON().email.startsWith('b') ? profiles.B : profiles.A
      return json({ token: `fixture-${profile === profiles.B ? 'B' : 'A'}`, user: profile })
    }
    if (path === '/auth/me') {
      const { _id, ...profile } = profiles[actor]
      return json({ user: { id: _id, ...profile } })
    }
    if (path === '/auth/logout') { await delay(options.logoutDelay ?? 0); return json({ message: 'Sesión cerrada' }) }
    if (path === '/tasks') return json({ tasks: [data.task] })
    if (path === '/equipment') return json({ equipment: [data.equipment] })
    if (path.endsWith('/history')) {
      state.historyStarted++
      await delay(options.historyDelay ?? 0)
      return json({ equipment: data.equipment, tasks: [data.task] })
    }
    if (path.endsWith('/content')) {
      state.imageStarted++
      await delay(options.imageDelay ?? 0)
      try { await route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aBZkAAAAASUVORK5CYII=', 'base64') }) } catch {}
      return
    }
    if (path.endsWith('/documentation')) {
      state.docsWrites++
      await delay(options.saveDelay ?? 0)
      if (options.failSave) return json({ message: 'Guardado rechazado' }, 500)
      Object.assign(data.task, Object.fromEntries(Object.entries(request.postDataJSON()).map(([key, value]) => [key, value.trim()])))
      return json({ message: 'Documentación técnica guardada.', task: data.task })
    }
    if (path.endsWith('/status')) {
      state.statusWrites++
      data.task.status = request.postDataJSON().status
      return json({ task: data.task })
    }
    if (path.endsWith('/evidence') && request.method() === 'POST') return json({ message: 'Evidencia adjuntada correctamente.', task: data.task }, 201)
    if (/^\/tasks\/[^/]+$/.test(path)) {
      state.detailsStarted++
      await delay(options.detailDelay ?? 0)
      if (options.denyDetail) return json({ message: 'No se encontró la tarea solicitada.' }, 404)
      return json({ task: data.task })
    }
    return json({ message: 'Ruta simulada no definida' }, 404)
  })
  await page.goto(`http://127.0.0.1:${address.port}`)
  return { context, page, state, errors }
}
async function login(page, actor) {
  await page.getByLabel('Correo electrónico').fill(`${actor.toLowerCase()}@example.invalid`)
  await page.getByLabel('Contraseña', { exact: true }).fill('fixture-password')
  await page.getByRole('button', { name: 'Entrar a TechTrack' }).click()
  await page.getByRole('button', { name: `Ver TAREA_PRIVADA_${actor}`, exact: true }).waitFor()
}
async function openDetail(page, actor = 'A') {
  await page.getByRole('button', { name: `Ver TAREA_PRIVADA_${actor}`, exact: true }).click()
  await page.getByRole('dialog', { name: 'Detalle de intervención' }).waitFor()
}
async function logout(page) {
  await page.getByTitle('Cerrar sesión', { exact: true }).click()
  await page.getByRole('heading', { name: 'Inicia sesión', exact: true }).waitFor({ timeout: 1000 })
}
async function assertOnlyB(page) {
  await page.getByRole('button', { name: 'Ver TAREA_PRIVADA_B', exact: true }).waitFor()
  assert.doesNotMatch(await page.locator('body').innerText(), /PRIVAD[AO]_A|DIAGNOSTICO_A|ACTIVIDADES_A|EVIDENCIA_A/)
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.deepEqual(await page.evaluate(() => window.__sessionLeaks), [])
}
async function run(name, options, fn) {
  const app = await setup(options)
  try { await fn(app); assert.deepEqual(app.errors, []); results.push({ name, result: 'PASS' }); console.log(`PASS ${name}`) }
  finally { await app.context.close() }
}
try {
  await run('D01: login anterior pendiente no reemplaza la sesión recibida de otra pestaña', { loginDelay: 700 }, async ({ page }) => {
    await page.getByLabel('Correo electrónico').fill('a@example.invalid')
    await page.getByLabel('Contraseña', { exact: true }).fill('fixture-password')
    await page.getByRole('button', { name: 'Entrar a TechTrack' }).click()
    await page.evaluate(() => {
      localStorage.setItem('techtrack-token', 'fixture-B')
      window.dispatchEvent(new StorageEvent('storage', { key: 'techtrack-token', newValue: 'fixture-B' }))
    })
    await delay(1000)
    await assertOnlyB(page)
    assert.equal(await page.evaluate(() => localStorage.getItem('techtrack-token')), 'fixture-B')
  })
  await run('D05: adaptador de /auth/me normaliza id a _id sin cambiar la respuesta pública', {}, async ({ page }) => {
    const profile = await page.evaluate(async () => (await import('/src/api.ts')).api.me('fixture-A'))
    assert.deepEqual(profile, profiles.A)
  })
  await run('D01: respuesta JSON tardía rechazada incluso si el transporte ignora AbortSignal', {}, async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const { createApi } = await import('/src/api.ts')
      const original = window.fetch
      let release
      const body = new Promise((resolve) => { release = resolve })
      window.fetch = async () => ({ ok: true, json: () => body })
      try {
        const controller = new AbortController()
        const pending = createApi(controller.signal).listTasks('fixture-A')
        await Promise.resolve()
        controller.abort()
        release({ tasks: [{ title: 'TAREA_PRIVADA_A' }] })
        try { await pending; return 'resolved' } catch (error) { return error.name }
      } finally { window.fetch = original }
    })
    assert.equal(outcome, 'AbortError')
  })
  await run('D01/D05: A → historial/detalle/imagen → logout lento → B sin datos residuales', { logoutDelay: 1800 }, async ({ page }) => {
    await login(page, 'A')
    await page.getByTitle('Equipos', { exact: true }).click()
    await page.getByRole('button', { name: 'Ver historial técnico' }).click()
    await page.getByRole('button', { name: /TAREA_PRIVADA_A/ }).waitFor()
    await page.getByRole('button', { name: /TAREA_PRIVADA_A/ }).click()
    await page.locator('img[alt="EVIDENCIA_A.png"]').waitFor()
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
    await page.waitForFunction(() => window.__revokedURLs.length > 0)
    await logout(page)
    assert.doesNotMatch(await page.locator('body').innerText(), /PRIVAD[AO]_A/)
    await login(page, 'B')
    await delay(2000)
    await assertOnlyB(page)
    await openDetail(page, 'B')
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'DIAGNOSTICO_B')
  })
  await run('D01: respuesta tardía de detalle A descartada después de entrar B', { detailDelay: 700 }, async ({ page, state }) => {
    await login(page, 'A')
    await page.getByRole('button', { name: 'Ver TAREA_PRIVADA_A', exact: true }).click()
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
    assert.equal(state.detailsStarted, 1)
    await logout(page); await login(page, 'B'); await delay(1000); await assertOnlyB(page)
  })
  await run('D01: respuesta tardía de historial A descartada después de entrar B', { historyDelay: 700 }, async ({ page, state }) => {
    await login(page, 'A'); await page.getByTitle('Equipos', { exact: true }).click()
    await page.getByRole('button', { name: 'Ver historial técnico' }).click()
    await delay(50); assert.equal(state.historyStarted, 1)
    await logout(page); await login(page, 'B'); await delay(1000); await assertOnlyB(page)
  })
  await run('D01: imagen tardía no genera una URL después del desmontaje', { imageDelay: 700 }, async ({ page, state }) => {
    await login(page, 'A'); await openDetail(page)
    await delay(50); assert.ok(state.imageStarted >= 1)
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
    await logout(page); await login(page, 'B'); await delay(1000); await assertOnlyB(page)
    assert.deepEqual(await page.evaluate(() => window.__createdURLs), [])
  })
  await run('D01: detalle denegado no abre formulario con la copia del listado', { denyDetail: true }, async ({ page }) => {
    await login(page, 'A'); await page.getByRole('button', { name: 'Ver TAREA_PRIVADA_A', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'No se encontró' }).waitFor()
    assert.equal(await page.getByRole('dialog').count(), 0)
  })
  await run('D03: bloqueo con cambios pendientes; guardar y completar conserva todos los campos e imagen', { saveDelay: 250 }, async ({ page, state }) => {
    await login(page, 'A'); await openDetail(page)
    for (const name of ['diagnosis', 'activities', 'result', 'recommendations', 'problemReported']) await page.locator(`textarea[name="${name}"]`).fill(`GUARDADO_${name}`)
    await page.getByRole('dialog').getByLabel('Cambiar estado de tarea').selectOption('COMPLETED')
    assert.equal(state.statusWrites, 0)
    assert.equal(state.A.task.diagnosis, 'DIAGNOSTICO_A')
    assert.equal(await page.getByRole('dialog').getByLabel('Cambiar estado de tarea').inputValue(), 'IN_PROGRESS')
    await page.getByRole('button', { name: 'Guardar documentación' }).click()
    assert.equal(await page.getByRole('dialog').getByLabel('Cambiar estado de tarea').isDisabled(), true)
    await page.getByRole('status').filter({ hasText: 'Documentación técnica guardada.' }).waitFor()
    await page.getByRole('dialog').getByLabel('Cambiar estado de tarea').selectOption('COMPLETED')
    await page.getByText('La tarea está completada y su documentación ya no se puede editar.').waitFor()
    assert.equal(state.statusWrites, 1)
    for (const name of ['diagnosis', 'activities', 'result', 'recommendations', 'problemReported']) assert.equal(await page.locator(`textarea[name="${name}"]`).inputValue(), `GUARDADO_${name}`)
    await page.reload(); await page.getByRole('button', { name: 'Ver TAREA_PRIVADA_A', exact: true }).waitFor(); await openDetail(page)
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'GUARDADO_diagnosis')
    assert.equal(await page.locator('textarea[name="diagnosis"]').isDisabled(), true)
    await page.locator('img[alt="EVIDENCIA_A.png"]').waitFor()
  })
  await run('D03: fallo de guardado conserva borrador y bloqueo; adjuntar imagen tampoco descarta cambios', { failSave: true }, async ({ page, state }) => {
    await login(page, 'A'); await openDetail(page)
    await page.locator('textarea[name="diagnosis"]').fill('SIN_GUARDAR')
    await page.locator('input[type="file"]').setInputFiles({ name: 'fixture.png', mimeType: 'image/png', buffer: Buffer.from('fixture') })
    await page.getByRole('status').filter({ hasText: 'Evidencia adjuntada' }).waitFor()
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'SIN_GUARDAR')
    await page.getByRole('button', { name: 'Guardar documentación' }).click()
    await page.getByRole('status').filter({ hasText: 'Guardado rechazado' }).waitFor()
    await page.getByRole('dialog').getByLabel('Cambiar estado de tarea').selectOption('COMPLETED')
    assert.equal(state.statusWrites, 0)
    assert.equal(state.A.task.diagnosis, 'DIAGNOSTICO_A')
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'SIN_GUARDAR')
  })
  console.log(JSON.stringify({ scope: 'Chromium, API simulada; sin Atlas', passed: results.length, results }, null, 2))
} finally { await browser.close(); await server.close() }
