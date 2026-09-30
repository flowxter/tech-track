import assert from 'node:assert/strict'
import test from 'node:test'
import { canTransitionTaskStatus, isTaskStatus } from './taskStatus'

test('permite avanzar de pendiente a en progreso', () => {
  assert.equal(canTransitionTaskStatus('PENDING', 'IN_PROGRESS'), true)
})

test('permite avanzar de en progreso a completada', () => {
  assert.equal(canTransitionTaskStatus('IN_PROGRESS', 'COMPLETED'), true)
})

test('rechaza saltos, retrocesos y estados desconocidos', () => {
  assert.equal(canTransitionTaskStatus('PENDING', 'COMPLETED'), false)
  assert.equal(canTransitionTaskStatus('COMPLETED', 'IN_PROGRESS'), false)
  assert.equal(isTaskStatus('CANCELLED'), false)
})

test('reconoce únicamente los estados definidos por el MVP', () => {
  assert.deepEqual(['PENDING', 'IN_PROGRESS', 'COMPLETED'].filter(isTaskStatus), ['PENDING', 'IN_PROGRESS', 'COMPLETED'])
})