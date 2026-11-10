import { mentionsTerm, normalizeSpoken, splitSpokenSections } from './spokenText'

const MAX_TITLE_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 2000
const TASK_LEAD_IN = /^\s*(?:(?:crear|crea|registrar|registra|agregar|agrega)\s+)?(?:una\s+)?(?:nueva\s+)?tarea(?![\p{L}\p{N}])[\s:,.;-]*/iu
const TASK_MARKERS = {
  technician: ['tecnico', 'tecnica', 'asignar tarea a', 'asignar la tarea a', 'asignar a', 'asignada a', 'asignado a'],
  equipment: ['equipo', 'activo'],
  title: ['titulo'],
  description: ['descripcion', 'problema', 'detalle'],
}

export type EquipmentCandidate = { id: string; assetTag: string; name: string; ownerId: string }
export type TechnicianCandidate = { id: string; name: string }
export type TaskDraft = { title: string; description: string; equipmentId: string | null; technicianId: string | null }

/** Elige el candidato con la mención más específica; ante un empate no adivina. */
function pickBestMatch<T>(candidates: T[], scoreOf: (candidate: T) => number): T | null {
  const scored = candidates.map((candidate) => ({ candidate, score: scoreOf(candidate) })).filter(({ score }) => score > 0)
  const best = Math.max(0, ...scored.map(({ score }) => score))
  const winners = scored.filter(({ score }) => score === best)
  return winners.length === 1 ? winners[0].candidate : null
}

function matchEquipment(text: string, equipment: EquipmentCandidate[]) {
  return pickBestMatch(equipment, ({ assetTag, name }) => {
    // El identificador es único por naturaleza: siempre pesa más que un nombre.
    if (mentionsTerm(text, assetTag)) return 1000 + assetTag.length
    return mentionsTerm(text, name) ? name.length : 0
  })
}

function nameWords(text: string) {
  return normalizeSpoken(text).match(/\p{L}+/gu)?.join(' ') ?? ''
}

/** Solo una sección de asignación identifica personas; el contenido descriptivo no asigna responsables. */
function matchTechnician(section: string | undefined, context: string, transcript: string, technicians: TechnicianCandidate[]) {
  const text = nameWords(section ?? context)
  const normalizedTranscript = normalizeSpoken(transcript)
  const hasAssignmentIntent = section !== undefined || /\b(?:asign\p{L}*|tecnic[oa])\b/u.test(normalizeSpoken(context))
  // Una instrucción negativa explícita sí bloquea la inferencia, esté donde esté.
  // Un simple «no» del síntoma, o un nombre en título/descripción, no la bloquea.
  const negatedAssignment = /\b(?:no|nunca|jamas|tampoco|sin)\s+(?:\p{L}+\s+){0,4}asign\p{L}*\b/u.test(normalizedTranscript)
  const uncertainSection = section !== undefined && /\b(?:no|ni|nunca|jamas|tampoco|sin|o|u|entre|quizas|quiza|tal vez)\b/u.test(text)
  const pending = { candidate: null, allowOwnerInference: false }
  if (negatedAssignment || uncertainSection) return pending

  const containsName = (name: string) => ` ${text} `.includes(` ${nameWords(name)} `)
  const fullMatches = technicians.filter(({ name }) => containsName(name))
  const firstNameMatches = technicians.filter(({ name }) => {
    const firstName = nameWords(name).split(' ')[0]
    return firstName.length >= 3 && containsName(firstName)
  })
  if (section === undefined) {
    // Mantener pendientes fragmentos como «Juan o Carlos» o «no Juan» fuera
    // de los campos descriptivos, sin convertir nombres sueltos en órdenes.
    const uncertainNames = firstNameMatches.length > 0 && /\b(?:no|ni|nunca|jamas|tampoco|sin|o|u|y|e|entre|quizas|quiza)\b/u.test(text)
    return { candidate: null, allowOwnerInference: !hasAssignmentIntent && !uncertainNames }
  }
  if (fullMatches.length > 1) return pending
  if (fullMatches.length === 1) {
    const candidate = fullMatches[0]
    const firstName = nameWords(candidate.name).split(' ')[0]
    if (firstNameMatches.some(({ name }) => nameWords(name).split(' ')[0] !== firstName)) return pending
    if (text !== nameWords(candidate.name)) return pending
    return { candidate, allowOwnerInference: false }
  }
  // Un apellido aislado, un nombre truncado o texto adicional desconocido no identifica a una persona.
  if (firstNameMatches.length === 1 && text === nameWords(firstNameMatches[0].name).split(' ')[0]) {
    return { candidate: firstNameMatches[0], allowOwnerInference: false }
  }
  return pending
}

function truncateAtWord(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return lastSpace > 0 ? cut.slice(0, lastSpace) : cut
}

/** Sin palabra clave "título", la primera frase hace de título y el resto de descripción. */
function splitTitleFromText(text: string) {
  const sentence = /^.+?[.?!](?=\s|$)/su.exec(text)?.[0] ?? text
  const title = truncateAtWord(sentence.replace(/[.?!\s]+$/u, ''), MAX_TITLE_LENGTH)
  const wasCut = title.length < sentence.replace(/[.?!\s]+$/u, '').length
  return { title, rest: wasCut ? text : text.slice(sentence.length).trim() }
}

/**
 * Convierte un dictado en un borrador de tarea para revisar antes de guardar.
 * Solo busca entre los candidatos recibidos, por lo que nunca propone datos ajenos a la cuenta.
 */
export function parseTaskDictation(transcript: string, equipment: EquipmentCandidate[], technicians: TechnicianCandidate[] = []): TaskDraft {
  const { sections, unlabeled } = splitSpokenSections(transcript.replace(TASK_LEAD_IN, ''), TASK_MARKERS)
  // Excluir título y descripción al buscar intenciones ambiguas o incompletas.
  const assignmentContext = [unlabeled, sections.equipment].filter(Boolean).join(' ')
  const { candidate: technician, allowOwnerInference } = matchTechnician(sections.technician, assignmentContext, transcript, technicians)
  const eligibleEquipment = technician ? equipment.filter(({ ownerId }) => ownerId === technician.id) : equipment
  const matchedEquipment = matchEquipment(sections.equipment ?? transcript, eligibleEquipment)

  const fallback = splitTitleFromText(unlabeled || sections.description || '')
  const title = sections.title ? truncateAtWord(sections.title.replace(/[.?!\s]+$/u, ''), MAX_TITLE_LENGTH) : fallback.title
  // Lo dictado sin palabra clave que no fue a parar al título se conserva en la descripción.
  const unlabeledRest = sections.title ? unlabeled : unlabeled && fallback.rest
  const description = [unlabeledRest, sections.description].filter(Boolean).join(' ')

  return {
    title,
    description: truncateAtWord(description, MAX_DESCRIPTION_LENGTH),
    equipmentId: matchedEquipment?.id ?? null,
    // Si solo se nombró el equipo, su propietario determina el técnico.
    technicianId: technician?.id ?? (allowOwnerInference && technicians.length > 0 ? matchedEquipment?.ownerId ?? null : null),
  }
}
