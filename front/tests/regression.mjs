import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { verifyRecorder } from './voiceRecorder.mjs'
import { verifyNativeRecorder } from './nativeRecorder.mjs'

const server = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), configFile: false,
  envDir: false, logLevel: 'error', plugins: [react()], server: { host: '127.0.0.1', port: 0 },
  define: { 'import.meta.env.VITE_API_URL': JSON.stringify('http://techtrack.mock.invalid/api') } })
await server.listen()
const address = server.httpServer.address()
// El micrófono simulado permite ejercitar MediaRecorder sin hardware ni permisos manuales.
const browser = await chromium.launch({ headless: true, args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'], ...(process.env.TECHTRACK_TEST_BROWSER_CHANNEL ? { channel: process.env.TECHTRACK_TEST_BROWSER_CHANNEL } : {}) })
  .catch(async (cause) => {
    await server.close()
    throw new Error('No se pudo iniciar Chromium. Ejecuta npm run test:install --prefix front o configura TECHTRACK_TEST_BROWSER_CHANNEL.', { cause })
  })
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
  const context = await browser.newContext({ permissions: ['microphone'] })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const state = { A: fixtures('A'), B: fixtures('B'), statusWrites: 0, docsWrites: 0, detailsStarted: 0, historyStarted: 0, imageStarted: 0, imageURLs: 0, revokedURLs: 0, voiceUploads: [], assignments: [], taskCreates: [] }
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
      return json({ user: { id: _id, ...profile, ...(options.admin ? { role: 'ADMIN' } : {}) } })
    }
    if (path === '/voice/speech') {
      state.speechText = request.postDataJSON().text
      if (options.elevenLabsConfigured) { try { await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: Buffer.from('fixture') }) } catch {} return }
      return json({ message: 'La voz de ElevenLabs no está configurada en el servidor.' }, 503)
    }
    if (path.startsWith('/voice/')) {
      state.voiceUploads.push({ path, contentType: request.headers()['content-type'] })
      await delay(options.voiceDelay ?? 0)
      if (options.voiceError) return json({ message: options.voiceError }, 422)
      const drafts = options.voiceDrafts?.[path]
      if (drafts?.length) return json({ text: 'Dictado simulado', draft: drafts.shift() })
      if (path === '/voice/transcribe') return json({ text: 'Texto dictado.' })
      if (path === '/voice/documentation-draft') return json({ text: 'x', sections: { diagnosis: 'Fuente dañada.', result: 'Enciende.' } })
      if (path === '/voice/task-draft') return json({ text: 'x', draft: { title: 'Cambiar disco', description: 'Hace ruido.', equipmentId: data.equipment._id, technicianId: null } })
      if (path === '/voice/assignment-draft') return json({ text: 'x', draft: { title: 'Cambiar pantalla', description: '', equipmentId: state.B.equipment._id, technicianId: profiles.B._id } })
    }
    if (path === '/admin/technicians') return json({ technicians: [profiles.A, profiles.B], equipment: [{ ...state.A.equipment, owner: profiles.A._id }, { ...state.B.equipment, owner: profiles.B._id }] })
    if (path === '/admin/activities') return json({ activities: [] })
    if (path === '/admin/tasks') {
      state.assignments.push(request.postDataJSON())
      return json({ message: 'Tarea asignada a Técnico B.', task: { ...state.B.task, owner: profiles.B } }, 201)
    }
    if (path === '/auth/logout') { await delay(options.logoutDelay ?? 0); return json({ message: 'Sesión cerrada' }) }
    if (path === '/tasks' && request.method() === 'POST') {
      const input = request.postDataJSON()
      state.taskCreates.push(input)
      return json({ task: { ...data.task, ...input, _id: state.taskCreates.length.toString(16).padStart(24, '0') } }, 201)
    }
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
  for (const scenario of ['constructor', 'start', 'error', 'concurrent', 'another-field', 'late-permission', 'cancel-permission', 'unmount', 'stop', 'stop-failure', 'timeout', 'denied', 'final-chunks', 'missing-stop', 'data-without-stop', 'empty']) {
    await run(`A02: micrófono y temporizadores liberados (${scenario})`, {}, async ({ page }) => {
      await verifyRecorder(page, scenario)
    })
  }
  await run('A02: MediaRecorder nativo entrega WebM completo y decodificable antes de liberar la sesión', {}, async ({ page }) => {
    await verifyNativeRecorder(page)
  })
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
  /** Graba un instante con el micrófono simulado y detiene, como haría la persona. */
  async function dictate(scope, name) {
    await scope.getByRole('button', { name, exact: true }).click()
    await scope.getByRole('button', { name: 'Detener dictado', exact: true }).waitFor()
    await delay(200)
    await scope.getByRole('button', { name: 'Detener dictado', exact: true }).click()
  }
  await run('A04: segundo dictado de tarea actualiza texto sin editar y limpia equipo no reconocido', {
    voiceDrafts: { '/voice/task-draft': [
      { title: 'Primer dictado', description: 'Descripción inicial', equipmentId: 'a'.repeat(24), technicianId: null },
      { title: 'Segundo dictado', description: 'Descripción actualizada', equipmentId: null, technicianId: null },
    ] },
  }, async ({ page, state }) => {
    await login(page, 'A')
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click()
    const form = page.getByRole('dialog', { name: 'Nueva tarea técnica' })
    await dictate(form, 'Dictar tarea completa')
    await page.waitForFunction(() => document.querySelector('input[name="title"]').value === 'Primer dictado')
    await dictate(form, 'Dictar tarea completa')
    await page.waitForFunction(() => document.querySelector('input[name="title"]').value === 'Segundo dictado')
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción actualizada')
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), '')
    assert.equal(await form.getByRole('alert').count(), 0)
    assert.equal(await form.locator('select[name="equipmentId"]').evaluate((select) => select.checkValidity()), false)
    assert.equal(state.taskCreates.length, 0)
    await form.locator('select[name="equipmentId"]').selectOption('a'.repeat(24))
    await form.getByRole('button', { name: 'Crear tarea', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Tarea creada' }).waitFor()
    assert.deepEqual(state.taskCreates, [{ title: 'Segundo dictado', description: 'Descripción actualizada', equipmentId: 'a'.repeat(24) }])
  })
  await run('A04: segundo dictado de asignación actualiza texto sin editar y exige selección manual', {
    admin: true,
    voiceDrafts: { '/voice/assignment-draft': [
      { title: 'Primera asignación', description: 'Descripción inicial', equipmentId: 'b'.repeat(24), technicianId: profiles.B._id },
      { title: 'Segunda asignación', description: 'Descripción actualizada', equipmentId: null, technicianId: null },
    ] },
  }, async ({ page, state }) => {
    await login(page, 'A')
    await page.getByTitle('Supervisión', { exact: true }).click()
    const form = page.locator('.admin-assignment-form')
    await dictate(form, 'Dictar asignación completa')
    await page.waitForFunction(() => document.querySelector('.admin-assignment-form input[name="title"]').value === 'Primera asignación')
    await dictate(form, 'Dictar asignación completa')
    await page.waitForFunction(() => document.querySelector('.admin-assignment-form input[name="title"]').value === 'Segunda asignación')
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción actualizada')
    assert.equal(await form.locator('select[name="technicianId"]').inputValue(), '')
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), '')
    assert.equal(await form.getByRole('alert').count(), 0)
    assert.equal(state.assignments.length, 0)
    await form.locator('select[name="technicianId"]').selectOption(profiles.B._id)
    await form.locator('select[name="equipmentId"]').selectOption('b'.repeat(24))
    await form.getByRole('button', { name: 'Asignar tarea', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Tarea asignada' }).waitFor()
    assert.deepEqual(state.assignments, [{ title: 'Segunda asignación', description: 'Descripción actualizada', technicianId: profiles.B._id, equipmentId: 'b'.repeat(24) }])
  })
  await run('A04: dos dictados de tarea limpian el equipo anterior y conservan texto editable', {
    voiceDrafts: { '/voice/task-draft': [
      { title: 'Primer dictado', description: 'Descripción dictada', equipmentId: 'a'.repeat(24), technicianId: null },
      { title: 'Segundo dictado', description: 'Otro texto', equipmentId: null, technicianId: null },
    ] },
  }, async ({ page, state }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await login(page, 'A')
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click()
    const form = page.getByRole('dialog', { name: 'Nueva tarea técnica' })
    await dictate(form, 'Dictar tarea completa')
    await page.waitForFunction(() => document.querySelector('input[name="title"]').value === 'Primer dictado')
    await form.locator('input[name="title"]').fill('Título escrito por la persona')
    await form.locator('textarea[name="description"]').fill('Descripción escrita por la persona')
    await dictate(form, 'Dictar tarea completa')
    await page.getByRole('status').filter({ hasText: 'Selecciona manualmente el equipo' }).waitFor()
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), '')
    assert.equal(await form.locator('input[name="title"]').inputValue(), 'Título escrito por la persona')
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción escrita por la persona')
    await form.getByRole('alert').filter({ hasText: 'conflictos con tus cambios manuales' }).waitFor()
    assert.equal(await form.getByText('Segundo dictado', { exact: true }).count(), 1)
    assert.equal(await form.getByText('Otro texto', { exact: true }).count(), 1)
    assert.equal(await form.locator('.dictation-conflicts').evaluate((panel) => panel.scrollWidth <= panel.clientWidth + 1), true)
    assert.equal(await form.getByRole('button', { name: 'Crear tarea', exact: true }).isDisabled(), true)
    assert.equal(await form.locator('select[name="equipmentId"]').evaluate((select) => select.checkValidity()), false)
    await form.locator('select[name="equipmentId"]').selectOption('a'.repeat(24))
    assert.equal(await form.locator('select[name="equipmentId"]').evaluate((select) => select.checkValidity()), true)
    assert.equal(state.voiceUploads.length, 2)
    assert.equal(state.assignments.length, 0)
    assert.equal(state.taskCreates.length, 0)
    await form.getByRole('button', { name: 'Conservar mi título', exact: true }).click()
    await form.getByRole('button', { name: 'Usar este dictado como descripción', exact: true }).click()
    assert.equal(await form.getByRole('alert').count(), 0)
    await form.getByRole('button', { name: 'Crear tarea', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Tarea creada' }).waitFor()
    assert.deepEqual(state.taskCreates, [{ title: 'Título escrito por la persona', description: 'Otro texto', equipmentId: 'a'.repeat(24) }])
  })
  await run('A04: dos dictados de asignación eliminan asociaciones inciertas sin borrar lo escrito', {
    admin: true,
    voiceDrafts: { '/voice/assignment-draft': [
      { title: 'Primera asignación', description: 'Dictado inicial', equipmentId: 'b'.repeat(24), technicianId: profiles.B._id },
      { title: 'Otra asignación', description: 'Otro texto', equipmentId: 'b'.repeat(24), technicianId: null },
    ] },
  }, async ({ page, state }) => {
    await login(page, 'A')
    await page.getByTitle('Supervisión', { exact: true }).click()
    const form = page.locator('.admin-assignment-form')
    await dictate(form, 'Dictar asignación completa')
    await page.waitForFunction(() => document.querySelector('.admin-assignment-form input[name="title"]').value === 'Primera asignación')
    await form.locator('input[name="title"]').fill('Título manual')
    await form.locator('textarea[name="description"]').fill('Descripción manual')
    await dictate(form, 'Dictar asignación completa')
    await page.getByRole('status').filter({ hasText: 'Selecciona manualmente el técnico' }).waitFor()
    assert.equal(await form.locator('select[name="technicianId"]').inputValue(), '')
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), '')
    assert.equal(await form.locator('input[name="title"]').inputValue(), 'Título manual')
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción manual')
    await form.getByRole('alert').filter({ hasText: 'conflictos con tus cambios manuales' }).waitFor()
    assert.equal(await form.getByText('Otra asignación', { exact: true }).count(), 1)
    assert.equal(await form.getByText('Otro texto', { exact: true }).count(), 1)
    assert.equal(state.assignments.length, 0)
    await form.locator('select[name="technicianId"]').selectOption(profiles.B._id)
    await form.locator('select[name="equipmentId"]').selectOption('b'.repeat(24))
    assert.equal(await form.getByRole('button', { name: 'Asignar tarea', exact: true }).isDisabled(), true)
    await form.getByRole('button', { name: 'Conservar mi título', exact: true }).click()
    await form.getByRole('button', { name: 'Conservar mi descripción', exact: true }).click()
    await form.getByRole('button', { name: 'Asignar tarea', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Tarea asignada' }).waitFor()
    assert.deepEqual(state.assignments, [{ title: 'Título manual', description: 'Descripción manual', technicianId: profiles.B._id, equipmentId: 'b'.repeat(24) }])
  })
  await run('A04: la procedencia se controla por campo y los conflictos sucesivos siguen disponibles', {
    voiceDrafts: { '/voice/task-draft': [
      { title: 'Título inicial', description: 'Descripción inicial', equipmentId: 'a'.repeat(24), technicianId: null },
      { title: 'Propuesta segunda', description: 'Descripción segunda', equipmentId: 'a'.repeat(24), technicianId: null },
      { title: 'Propuesta tercera', description: 'Descripción tercera', equipmentId: null, technicianId: null },
    ] },
  }, async ({ page }) => {
    await login(page, 'A')
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click()
    const form = page.getByRole('dialog', { name: 'Nueva tarea técnica' })
    await dictate(form, 'Dictar tarea completa')
    await page.waitForFunction(() => document.querySelector('input[name="title"]').value === 'Título inicial')
    await form.locator('input[name="title"]').fill('Mi título')
    await dictate(form, 'Dictar tarea completa')
    await form.getByText('Propuesta segunda', { exact: true }).waitFor()
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción segunda')
    assert.equal(await form.locator('input[name="title"]').inputValue(), 'Mi título')
    await dictate(form, 'Dictar tarea completa')
    await form.getByText('Propuesta tercera', { exact: true }).waitFor()
    assert.equal(await form.getByText('Propuesta segunda', { exact: true }).count(), 1)
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Descripción tercera')
    assert.equal(await form.locator('input[name="title"]').inputValue(), 'Mi título')
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), '')
    await form.getByRole('button', { name: 'Usar este dictado como título', exact: true }).first().click()
    assert.equal(await form.locator('input[name="title"]').inputValue(), 'Propuesta segunda')
    assert.equal(await form.getByRole('alert').count(), 0)
  })
  await run('Voz: el dictado se agrega al campo sin reemplazarlo ni guardarlo, y envía audio multipart', {}, async ({ page, state }) => {
    await login(page, 'A'); await openDetail(page)
    await dictate(page.getByRole('dialog'), 'Dictar diagnóstico')
    await page.waitForFunction(() => document.querySelector('textarea[name="diagnosis"]').value.includes('Texto dictado.'))
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'DIAGNOSTICO_A\nTexto dictado.')
    assert.equal(state.docsWrites, 0)
    assert.match(state.voiceUploads[0].contentType, /^multipart\/form-data/)
    await page.getByText('Hay cambios sin guardar.').waitFor()
  })
  await run('Voz: el informe dictado se reparte por secciones y respeta los demás campos', {}, async ({ page, state }) => {
    await login(page, 'A'); await openDetail(page)
    await dictate(page.getByRole('dialog'), 'Dictar informe completo')
    await page.getByRole('status').filter({ hasText: 'Informe dictado agregado' }).waitFor()
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'DIAGNOSTICO_A\nFuente dañada.')
    assert.equal(await page.locator('textarea[name="result"]').inputValue(), 'RESULTADO_A\nEnciende.')
    assert.equal(await page.locator('textarea[name="activities"]').inputValue(), 'ACTIVIDADES_A')
    assert.equal(state.docsWrites, 0)
  })
  await run('Voz: una tarea dictada rellena el formulario para revisarla antes de crearla', {}, async ({ page }) => {
    await login(page, 'A')
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click()
    const form = page.getByRole('dialog', { name: 'Nueva tarea técnica' })
    await dictate(form, 'Dictar tarea completa')
    await page.waitForFunction(() => document.querySelector('input[name="title"]').value === 'Cambiar disco')
    assert.equal(await form.locator('select[name="equipmentId"]').inputValue(), 'a'.repeat(24))
    assert.equal(await form.locator('textarea[name="description"]').inputValue(), 'Hace ruido.')
    assert.equal(await form.getByRole('button', { name: 'Crear tarea' }).isEnabled(), true)
  })
  await run('Voz: una asignación dictada selecciona técnico y equipo, y se limpia al asignar', { admin: true }, async ({ page, state }) => {
    await login(page, 'A')
    await page.getByTitle('Supervisión', { exact: true }).click()
    await dictate(page.locator('.admin-assignment-form'), 'Dictar asignación completa')
    const title = page.locator('.admin-assignment-form input[name="title"]')
    await page.waitForFunction(() => document.querySelector('.admin-assignment-form input[name="title"]').value === 'Cambiar pantalla')
    assert.equal(await page.locator('select[name="technicianId"]').inputValue(), profiles.B._id)
    assert.equal(await page.locator('.admin-assignment-form select[name="equipmentId"]').inputValue(), 'b'.repeat(24))
    await page.getByRole('button', { name: 'Asignar tarea', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Tarea asignada' }).waitFor()
    assert.deepEqual(state.assignments, [{ title: 'Cambiar pantalla', description: '', technicianId: profiles.B._id, equipmentId: 'b'.repeat(24) }])
    assert.equal(await title.inputValue(), '')
  })
  await run('Voz: cerrar el detalle durante la transcripción descarta el resultado tardío', { voiceDelay: 700 }, async ({ page }) => {
    await login(page, 'A'); await openDetail(page)
    await dictate(page.getByRole('dialog'), 'Dictar diagnóstico')
    await page.getByRole('button', { name: 'Transcribiendo dictado', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
    await delay(1000)
    await openDetail(page)
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'DIAGNOSTICO_A')
  })
  await run('Voz: el error de transcripción se comunica y conserva lo escrito', { voiceError: 'No se detectó voz en la grabación.' }, async ({ page }) => {
    await login(page, 'A'); await openDetail(page)
    await page.locator('textarea[name="diagnosis"]').fill('SIN_GUARDAR')
    await dictate(page.getByRole('dialog'), 'Dictar diagnóstico')
    await page.getByRole('status').filter({ hasText: 'No se detectó voz' }).waitFor()
    assert.equal(await page.locator('textarea[name="diagnosis"]').inputValue(), 'SIN_GUARDAR')
    await page.getByRole('button', { name: 'Dictar diagnóstico', exact: true }).waitFor()
  })
  await run('Voz: sin ElevenLabs la lectura usa la voz del navegador y se puede detener', {}, async ({ page, state }) => {
    await page.evaluate(() => {
      window.__spoken = []
      window.speechSynthesis.speak = (utterance) => window.__spoken.push({ text: utterance.text, lang: utterance.lang })
    })
    await login(page, 'A')
    await page.getByRole('button', { name: 'Escuchar resumen', exact: true }).click()
    await page.getByRole('button', { name: 'Detener lectura', exact: true }).click()
    await page.getByRole('button', { name: 'Escuchar resumen', exact: true }).waitFor()
    const [spoken] = await page.evaluate(() => window.__spoken)
    assert.equal(spoken.lang, 'es-ES')
    assert.equal(spoken.text, state.speechText)
    assert.match(spoken.text, /^Hola Técnico\. Tienes 0 tareas pendientes y 1 tarea en progreso\. TAREA_PRIVADA_A, en EQUIPO_PRIVADO_A, en progreso\.$/)
  })
  await run('Voz: con ElevenLabs reproduce su audio; una lectura nueva reemplaza a la anterior y cerrar la detiene', { elevenLabsConfigured: true }, async ({ page, state }) => {
    await page.evaluate(() => {
      window.__plays = 0
      window.__pauses = 0
      window.speechSynthesis.speak = () => { throw new Error('No debe usar la voz del navegador') }
      HTMLMediaElement.prototype.play = async () => { window.__plays++ }
      HTMLMediaElement.prototype.pause = () => { window.__pauses++ }
    })
    await login(page, 'A')
    await page.getByRole('button', { name: 'Escuchar resumen', exact: true }).click()
    await page.getByRole('button', { name: 'Detener lectura', exact: true }).waitFor()
    await openDetail(page)
    await page.getByRole('dialog').getByRole('button', { name: 'Leer tarea', exact: true }).click()
    await page.waitForFunction(() => window.__plays === 2)
    assert.match(state.speechText, /^Tarea: TAREA_PRIVADA_A\. Equipo: EQUIPO_PRIVADO_A\. Estado: en progreso\. Problema reportado: PROBLEMA_A\./)
    assert.equal(await page.evaluate(() => window.__pauses), 1)
    await page.getByRole('button', { name: 'Escuchar resumen', exact: true }).waitFor({ state: 'attached' })
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
    await page.waitForFunction(() => window.__pauses === 2)
  })
  console.log(JSON.stringify({ scope: 'Chromium, API simulada; sin Atlas', passed: results.length, results }, null, 2))
} finally { await browser.close(); await server.close() }
