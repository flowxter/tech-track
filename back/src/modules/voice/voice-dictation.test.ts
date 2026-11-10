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

const assignmentTechnicians = [
  { id: 'juan', name: 'Juan Pérez' },
  { id: 'carlos', name: 'Carlos Gómez' },
  { id: 'ana', name: 'Ana Gómez' },
  { id: 'otra-ana', name: 'Ana López' },
]

for (const spoken of [
  'Técnico Juan o Carlos.',
  'Técnico Juan y Carlos.',
  'Técnico Juan Pérez y Carlos.',
  'Técnico Juan Pérez. Técnico Carlos Gómez.',
  'Técnico Ana.',
  'Técnico Pérez.',
  'Técnico Jua.',
  'Técnico Juan desconocido.',
  'Técnico Pedro.',
  'No asignar a Juan.',
  'No le asignes a Juan Pérez.',
  'Técnico: no Juan Pérez.',
  'Nunca asignar a Carlos Gómez.',
  'No Juan Pérez.',
  'Juan Pérez o Pedro.',
  'Juan Pérez y Carlos.',
  'Juan y Carlos.',
]) {
  test(`A03: selección manual sin inferir propietario para «${spoken}»`, () => {
    const draft = parseTaskDictation(`${spoken} Equipo PC-001. Título: revisar.`, equipment, assignmentTechnicians)
    assert.equal(draft.technicianId, null)
    assert.equal(draft.equipmentId, 'laptop', 'El reconocimiento del equipo se conserva sin resolver a la persona')
  })
}

test('A03: un nombre completo distingue técnicos que comparten nombre de pila', () => {
  assert.equal(parseTaskDictation('Asignar a Ana Gómez. Equipo PC-001.', equipment, assignmentTechnicians).technicianId, 'ana')
})

test('A03: una negación del síntoma no invalida una asignación inequívoca', () => {
  const draft = parseTaskDictation('Asignar a Ana Gómez. Equipo PC-001. Título: no enciende.', equipment, assignmentTechnicians)
  assert.equal(draft.technicianId, 'ana')
  assert.equal(draft.equipmentId, 'laptop')
})

for (const spoken of [
  'Equipo PC-001. Título: no enciende',
  'Equipo PC-001. Descripción: no enciende ni carga la batería.',
  'Equipo PC-001. Título: sin conexión. Descripción: nunca detecta la red.',
  'Equipo PC-001. Descripción: Carlos Gómez revisó anteriormente el computador',
  'Equipo PC-001. Título: seguimiento de Carlos Gómez.',
  'Equipo PC-001. Descripción: Carlos Gómez y Juan Pérez revisaron el equipo anteriormente.',
  'Equipo PC-001. Descripción: Carlos Gómez no pudo reparar el computador.',
  'Carlos Gómez revisó anteriormente el computador. Equipo PC-001.',
  'Equipo PC-001.',
  'Actualizar el servidor principal.',
]) {
  test(`A03: el contexto descriptivo permite inferir al propietario para «${spoken}»`, () => {
    const draft = parseTaskDictation(spoken, equipment, [...assignmentTechnicians, technicians[1]])
    const expectedOwner = spoken.includes('servidor') ? 'luis' : 'ana'
    const expectedEquipment = expectedOwner === 'luis' ? 'server' : 'laptop'
    assert.equal(draft.technicianId, expectedOwner)
    assert.equal(draft.equipmentId, expectedEquipment)
  })
}

for (const spoken of [
  'Equipo PC-001. Descripción: Carlos Gómez revisó anteriormente. Asignar a Ana Gómez.',
  'Asignar a Ana Gómez. Equipo PC-001. Título: no enciende. Descripción: Carlos Gómez no pudo repararlo.',
  'Técnico Ana Gómez. Equipo PC-001. Descripción: Juan Pérez y Carlos Gómez atendieron el caso antes.',
]) {
  test(`A03: una asignación explícita prevalece sobre los antecedentes para «${spoken}»`, () => {
    const draft = parseTaskDictation(spoken, equipment, assignmentTechnicians)
    assert.equal(draft.technicianId, 'ana')
    assert.equal(draft.equipmentId, 'laptop')
  })
}

for (const spoken of [
  'Equipo PC-001. No asignar a Carlos Gómez. Título: no enciende.',
  'Equipo PC-001. Título: no enciende. No le asignes a Juan Pérez.',
  'Equipo PC-001. Descripción: no asignar a Juan Pérez.',
  'No asignar a Juan. Asignar a Ana Gómez. Equipo PC-001.',
  'Equipo PC-001. Técnico Juan o Carlos. Descripción: Ana Gómez lo revisó antes.',
]) {
  test(`A03: una instrucción contradictoria o incierta impide inferir al propietario para «${spoken}»`, () => {
    const draft = parseTaskDictation(spoken, equipment, assignmentTechnicians)
    assert.equal(draft.technicianId, null)
    assert.equal(draft.equipmentId, 'laptop')
  })
}

test('A03: un antecedente sin equipo no propone a la persona mencionada', () => {
  const draft = parseTaskDictation('Descripción: Carlos Gómez revisó anteriormente el computador.', equipment, assignmentTechnicians)
  assert.equal(draft.technicianId, null)
  assert.equal(draft.equipmentId, null)
})

test('A03: un antecedente no oculta la incompatibilidad de una asignación explícita con el equipo', () => {
  const draft = parseTaskDictation('Asignar a Carlos Gómez. Equipo PC-001. Descripción: Ana Gómez revisó anteriormente.', equipment, assignmentTechnicians)
  assert.equal(draft.technicianId, 'carlos')
  assert.equal(draft.equipmentId, null)
})
