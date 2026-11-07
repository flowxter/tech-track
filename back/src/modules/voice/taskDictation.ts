import { mentionsTerm, splitSpokenSections } from './spokenText'

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

/** El nombre de pila solo se acepta si se dictó en la sección del técnico; suelto genera falsos positivos. */
function matchTechnician(section: string | undefined, transcript: string, technicians: TechnicianCandidate[]) {
  return pickBestMatch(technicians, ({ name }) => {
    if (mentionsTerm(section ?? transcript, name)) return 1000
    if (!section) return 0
    return Math.max(0, ...name.split(/\s+/).filter((word) => word.length >= 3 && mentionsTerm(section, word)).map((word) => word.length))
  })
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
  const technician = matchTechnician(sections.technician, transcript, technicians)
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
    technicianId: technician?.id ?? (technicians.length > 0 ? matchedEquipment?.ownerId ?? null : null),
  }
}
