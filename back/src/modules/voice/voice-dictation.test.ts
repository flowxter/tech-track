import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseDocumentationDictation } from './documentationDictation'
import { parseTaskDictation } from './taskDictation'

const equipment = [
  { id: 'laptop', assetTag: 'PC-001', name: 'Laptop de recepción', ownerId: 'ana' },
  { id: 'server', assetTag: 'SRV-10', name: 'Servidor principal', ownerId: 'luis' },
]
const technicians = [{ id: 'ana', name: 'Ana Gómez' }, { id: 'luis', name: 'Luis Pérez' }]

test('el informe dictado se reparte entre las secciones, con o sin acentos y artículos', () => {
  const sections = parseDocumentationDictation('Diagnóstico: la fuente está dañada. Las actividades realizadas fueron cambiar la fuente. Resultado, el equipo enciende. Observaciones: revisar en un mes.')
  assert.deepEqual(sections, {
    diagnosis: 'La fuente está dañada.',
    activities: 'Cambiar la fuente.',
    result: 'El equipo enciende.',
    recommendations: 'Revisar en un mes.',
  })
})

test('un informe narrado de forma natural también se reparte (transcripción real de AssemblyAI)', () => {
  const sections = parseDocumentationDictation('Orden de servicio 457. Atendí un portátil Lenovo ThinkPad. El problema era que el equipo se apagaba solo. Encontré el ventilador lleno de polvo y la pasta térmica reseca. Hice limpieza interna y cambié la pasta térmica. Como resultado, la temperatura bajó de 90 a 55 grados. Recomiendo repetir el mantenimiento cada seis meses.')
  assert.deepEqual(sections, {
    problemReported: 'El equipo se apagaba solo.',
    diagnosis: 'El ventilador lleno de polvo y la pasta térmica reseca.',
    activities: 'Orden de servicio 457. Atendí un portátil Lenovo ThinkPad. Limpieza interna y cambié la pasta térmica.',
    result: 'La temperatura bajó de 90 a 55 grados.',
    recommendations: 'Repetir el mantenimiento cada seis meses.',
  })
})

test('una palabra clave a mitad de frase no abre una sección nueva', () => {
  assert.deepEqual(parseDocumentationDictation('Cambié la fuente y como resultado el equipo enciende.'), {
    activities: 'Cambié la fuente y como resultado el equipo enciende.',
  })
})

test('el texto sin sección se conserva en actividades', () => {
  assert.deepEqual(parseDocumentationDictation('Limpié el equipo. Actividades: cambié la pasta térmica.'), {
    activities: 'Limpié el equipo. Cambié la pasta térmica.',
  })
})

test('la primera frase es el título y el equipo se reconoce por su nombre', () => {
  assert.deepEqual(parseTaskDictation('Nueva tarea: revisar teclado de la laptop de recepción. Algunas teclas no responden.', equipment), {
    title: 'Revisar teclado de la laptop de recepción',
    description: 'Algunas teclas no responden.',
    equipmentId: 'laptop',
    technicianId: null,
  })
})

test('las palabras clave permiten dictar la tarea por partes', () => {
  const draft = parseTaskDictation('Equipo PC 001. Título: cambiar disco. Descripción: el disco hace ruido.', equipment)
  assert.equal(draft.equipmentId, 'laptop')
  assert.equal(draft.title, 'Cambiar disco')
  assert.equal(draft.description, 'El disco hace ruido.')
})

test('lo dictado antes de una palabra clave no se pierde', () => {
  const draft = parseTaskDictation('Orden de servicio 457. Atendí un portátil en Cali. El problema era que se apagaba solo.', equipment)
  assert.equal(draft.title, 'Orden de servicio 457')
  assert.equal(draft.description, 'Atendí un portátil en Cali. Se apagaba solo.')
})

test('el identificador se reconoce con dígitos dictados en palabras, pero no por coincidencia parcial', () => {
  assert.equal(parseTaskDictation('Revisar pc cero cero uno.', equipment).equipmentId, 'laptop')
  assert.equal(parseTaskDictation('Revisar PC-0010.', equipment).equipmentId, null)
})

test('un equipo ambiguo no se adivina', () => {
  const duplicates = [{ id: 'a', assetTag: 'A-1', name: 'Impresora', ownerId: 'ana' }, { id: 'b', assetTag: 'B-1', name: 'Impresora', ownerId: 'luis' }]
  assert.equal(parseTaskDictation('Revisar la impresora.', duplicates, technicians).equipmentId, null)
})

test('la asignación resuelve técnico y equipo, y deduce el técnico desde su equipo', () => {
  const byName = parseTaskDictation('Asignar a Ana. Equipo PC-001. Título: cambiar pantalla.', equipment, technicians)
  assert.deepEqual([byName.technicianId, byName.equipmentId, byName.title], ['ana', 'laptop', 'Cambiar pantalla'])
  assert.equal(parseTaskDictation('Actualizar el servidor principal.', equipment, technicians).technicianId, 'luis')
})

test('no se propone un equipo que pertenece a otro técnico', () => {
  const draft = parseTaskDictation('Técnico Luis. Equipo PC-001. Título: revisar.', equipment, technicians)
  assert.deepEqual([draft.technicianId, draft.equipmentId], ['luis', null])
})

test('el título largo se recorta sin perder el texto dictado', () => {
  const sentence = 'revisar '.repeat(30).trim()
  const draft = parseTaskDictation(sentence, equipment)
  assert.ok(draft.title.length <= 120)
  assert.equal(draft.description, sentence.charAt(0).toUpperCase() + sentence.slice(1))
})
