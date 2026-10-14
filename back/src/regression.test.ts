import assert from 'node:assert/strict'
import { after, before, beforeEach, mock, test } from 'node:test'
import type { Server } from 'node:http'
import mongoose from 'mongoose'
import { sign } from 'jsonwebtoken'
import { UserModel } from './models/User'
import { TaskModel } from './models/Task'
import { EquipmentModel } from './models/Equipment'
import { EvidenceModel } from './models/Evidence'

// No dotenv ni connect(): ninguna prueba usa credenciales o registros compartidos.
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/unused-regression'
process.env.JWT_SECRET = 'isolated-regression-fixture-secret-only'
mongoose.set('bufferCommands', false)
const owner = '111111111111111111111111'
const foreign = '222222222222222222222222'
const taskId = '333333333333333333333333'
const equipmentId = '444444444444444444444444'
const evidenceId = '555555555555555555555555'
const token = sign({ tokenVersion: 0 }, process.env.JWT_SECRET, { subject: owner })
const adminToken = sign({ tokenVersion: 0 }, process.env.JWT_SECRET, { subject: foreign })
let server: Server
let base: string

function query(value: unknown) {
  const chain = { select: (_?: unknown) => chain, populate: (..._args: unknown[]) => chain,
    sort: (_?: unknown) => chain, lean: async () => value,
    then: (resolve: (result: unknown) => unknown) => Promise.resolve(value).then(resolve) }
  return chain
}
function stub(target: object, method: string, implementation: (...args: any[]) => unknown) {
  return mock.method(target as Record<string, (...args: any[]) => unknown>, method, implementation)
}
async function call(path: string, method = 'GET', body?: object, auth: string | null = token) {
  const response = await fetch(`${base}${path}`, { method,
    headers: { ...(auth ? { Authorization: `Bearer ${auth}` } : {}), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined })
  return { status: response.status, payload: await response.json() }
}
before(async () => {
  const app = (require('./app') as typeof import('./app')).default
  server = app.listen(0, '127.0.0.1')
  await new Promise<void>((resolve) => server.once('listening', resolve))
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  base = `http://127.0.0.1:${address.port}/api`
})
beforeEach(() => {
  mock.restoreAll()
  stub(mongoose, 'connect', async () => mongoose)
  stub(UserModel, 'findById', (id) => query({ _id: id, id, name: 'Fixture', email: 'fixture@example.invalid', role: id === owner ? 'TECHNICIAN' : 'ADMIN', tokenVersion: 0 }))
})
after(async () => {
  mock.restoreAll()
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  assert.equal(mongoose.connection.readyState, 0)
})

test('D02: IDs mal formados en todas las rutas parametrizadas responden 400 sin consultar recursos', async () => {
  const noQuery = () => { throw new Error('No debe consultar recursos con ID inválido') }
  const tasks = stub(TaskModel, 'findOne', noQuery)
  const admin = stub(TaskModel, 'findById', noQuery)
  const equipment = stub(EquipmentModel, 'findOne', noQuery)
  const routes: [string, string, object?, string?][] = [
    ['/tasks/invalid-id', 'GET'], ['/equipment/invalid-id/history', 'GET'],
    ['/tasks/invalid-id/status', 'PATCH', { status: 'IN_PROGRESS' }],
    ['/tasks/invalid-id/documentation', 'PATCH', { diagnosis: 'test' }],
    ['/tasks/invalid-id/evidence', 'POST'],
    [`/tasks/${taskId}/evidence/invalid-id/content`, 'GET'],
    [`/tasks/invalid-id/evidence/${evidenceId}/content`, 'GET'],
    ['/admin/tasks/invalid-id', 'GET', undefined, adminToken],
    [`/admin/tasks/invalid-id/evidence/${evidenceId}/content`, 'GET', undefined, adminToken],
    [`/admin/tasks/${taskId}/evidence/invalid-id/content`, 'GET', undefined, adminToken],
  ]
  for (const [path, method, body, auth] of routes) {
    const result = await call(path, method, body, auth)
    assert.equal(result.status, 400, path)
    assert.deepEqual(result.payload, { message: 'El identificador solicitado no es válido.' })
  }
  assert.equal(tasks.mock.callCount() + admin.mock.callCount() + equipment.mock.callCount(), 0)
})

test('D02: IDs válidos inexistentes conservan 404, incluidos documentación, estado e imágenes', async () => {
  stub(TaskModel, 'findOne', () => query(null))
  stub(TaskModel, 'findById', () => query(null))
  stub(EquipmentModel, 'findOne', () => query(null))
  for (const [path, method, body, auth] of [
    [`/tasks/${taskId}`, 'GET', undefined, token],
    [`/equipment/${equipmentId}/history`, 'GET', undefined, token],
    [`/tasks/${taskId}/status`, 'PATCH', { status: 'COMPLETED' }, token],
    [`/tasks/${taskId}/documentation`, 'PATCH', { diagnosis: 'test' }, token],
    [`/tasks/${taskId}/evidence`, 'POST', undefined, token],
    [`/tasks/${taskId}/evidence/${evidenceId}/content`, 'GET', undefined, token],
    [`/admin/tasks/${taskId}`, 'GET', undefined, adminToken],
    [`/admin/tasks/${taskId}/evidence/${evidenceId}/content`, 'GET', undefined, adminToken],
  ] as const) assert.equal((await call(path, method, body, auth)).status, 404, path)
})

test('D01/D02: autenticación y rol se evalúan antes de validar parámetros', async () => {
  assert.equal((await call('/tasks/invalid-id', 'GET', undefined, null)).status, 401)
  assert.equal((await call('/admin/tasks/invalid-id')).status, 403)
})

test('D01/D02: tarea y equipo ajenos conservan filtros de propietario y 404', async () => {
  stub(TaskModel, 'findOne', (filter) => { assert.equal(filter.owner, owner); return query(null) })
  stub(EquipmentModel, 'findOne', (filter) => { assert.equal(filter.owner, owner); return query(null) })
  assert.equal((await call(`/tasks/${taskId}`)).status, 404)
  assert.equal((await call(`/equipment/${equipmentId}/history`)).status, 404)
  assert.equal((await call(`/tasks/${taskId}/documentation`, 'PATCH', { diagnosis: 'forbidden' })).status, 404)
  assert.equal((await call(`/tasks/${taskId}/status`, 'PATCH', { status: 'COMPLETED' })).status, 404)
  assert.equal((await call(`/tasks/${taskId}/evidence/${evidenceId}/content`)).status, 404)
})

test('D05: /auth/me mantiene contrato público id sin exponer _id o tokenVersion', async () => {
  const result = await call('/auth/me')
  assert.equal(result.status, 200)
  assert.deepEqual(result.payload.user, { id: owner, name: 'Fixture', email: 'fixture@example.invalid', role: 'TECHNICIAN' })
})

test('D06: lista, historial, detalle y supervisión comparten metadatos reales sin binarios', async () => {
  const task = { _id: taskId, owner, equipment: equipmentId, evidence: [{ filename: 'stale-embedded' }] }
  stub(TaskModel, 'find', () => query([task]))
  stub(TaskModel, 'findOne', () => query(task))
  stub(TaskModel, 'findById', () => query({ ...task, owner: { _id: owner, name: 'Fixture' } }))
  stub(EquipmentModel, 'findOne', () => query({ _id: equipmentId }))
  const metadata = { _id: evidenceId, task: taskId, owner, filename: 'fixture.png', mimeType: 'image/png', size: 20, uploadedAt: 'fixture-time' }
  const evidence = stub(EvidenceModel, 'find', (filter) => {
    assert.deepEqual(filter, { $or: [{ task: taskId, owner }] })
    return query([metadata])
  })
  const list = await call('/tasks')
  const detail = await call(`/tasks/${taskId}`)
  const history = await call(`/equipment/${equipmentId}/history`)
  const activities = await call('/admin/activities', 'GET', undefined, adminToken)
  const adminDetail = await call(`/admin/tasks/${taskId}`, 'GET', undefined, adminToken)
  for (const result of [list, detail, history, activities, adminDetail]) assert.equal(result.status, 200)
  const expected = { _id: evidenceId, filename: 'fixture.png', mimeType: 'image/png', size: 20, uploadedAt: 'fixture-time', url: `/tasks/${taskId}/evidence/${evidenceId}/content` }
  for (const actual of [list.payload.tasks[0], detail.payload.task, history.payload.tasks[0]]) assert.deepEqual(actual.evidence, [expected])
  for (const actual of [activities.payload.activities[0], adminDetail.payload.task]) assert.deepEqual(actual.evidence, [{ ...expected, url: `/admin${expected.url}` }])
  assert.equal(evidence.mock.callCount(), 5)
})

test('D06: contenido de imagen mantiene MIME, no-store y autorización tarea/evidencia/propietario', async () => {
  stub(TaskModel, 'findOne', (filter) => { assert.equal(filter.owner, owner); return query({ _id: taskId }) })
  stub(EvidenceModel, 'findOne', (filter) => {
    assert.deepEqual(filter, { _id: evidenceId, task: taskId, owner })
    return query({ mimeType: 'image/png', data: Buffer.from('isolated-image') })
  })
  const response = await fetch(`${base}/tasks/${taskId}/evidence/${evidenceId}/content`, { headers: { Authorization: `Bearer ${token}` } })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'image/png')
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  assert.equal(await response.text(), 'isolated-image')
})

test('D03: completar conserva documentación y evidencias guardadas y bloquea edición posterior', async () => {
  const task = { _id: taskId, owner, status: 'IN_PROGRESS', statusHistory: [] as object[], problemReported: 'saved-problem', diagnosis: 'saved-diagnosis', activities: 'saved-activities', result: 'saved-result', recommendations: 'saved-recommendations', save: async () => task }
  stub(TaskModel, 'findOne', () => query(task))
  stub(EvidenceModel, 'find', () => query([{ _id: evidenceId, task: taskId, owner, filename: 'saved.png', mimeType: 'image/png', size: 10, uploadedAt: 'fixture-time' }]))
  const completed = await call(`/tasks/${taskId}/status`, 'PATCH', { status: 'COMPLETED' })
  assert.equal(completed.status, 200)
  for (const field of ['problemReported', 'diagnosis', 'activities', 'result', 'recommendations'] as const) assert.equal(completed.payload.task[field], task[field])
  assert.equal(completed.payload.task.evidence.length, 1)
  assert.equal((await call(`/tasks/${taskId}/documentation`, 'PATCH', { diagnosis: 'overwrite' })).status, 409)
  assert.equal((await call(`/tasks/${taskId}/evidence`, 'POST')).status, 409)
})
