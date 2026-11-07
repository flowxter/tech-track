import type { Task } from '../types'

// Mismo máximo que acepta POST /api/voice/speech.
const MAX_SPEECH_CHARACTERS = 2500
const MAX_BRIEFING_TASKS = 5

const spokenStatus: Record<Task['status'], string> = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en progreso',
  COMPLETED: 'completada',
}

function equipmentName(task: Task) {
  return typeof task.equipment === 'string' ? '' : task.equipment.name
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Recorta en el último final de frase para que la lectura no termine a media palabra. */
function fitForSpeech(script: string) {
  if (script.length <= MAX_SPEECH_CHARACTERS) return script
  const cut = script.slice(0, MAX_SPEECH_CHARACTERS)
  return cut.slice(0, cut.lastIndexOf('. ') + 1) || cut
}

/** Resumen hablado de la jornada: conteos y primero lo que lleva más tiempo sin atender. */
export function buildBriefing(userName: string, tasks: Task[]) {
  const inProgress = tasks.filter(({ status }) => status === 'IN_PROGRESS')
  const pending = tasks.filter(({ status }) => status === 'PENDING')
  const greeting = `Hola ${userName.split(' ')[0]}.`
  if (inProgress.length + pending.length === 0) return `${greeting} No tienes tareas por atender.`

  const queue = [...inProgress, ...pending.toSorted((first, second) => first.createdAt.localeCompare(second.createdAt))]
  const details = queue.slice(0, MAX_BRIEFING_TASKS).map((task) => {
    const equipment = equipmentName(task)
    return `${task.title}${equipment ? `, en ${equipment}` : ''}, ${spokenStatus[task.status]}.`
  })
  const remaining = queue.length - details.length
  return fitForSpeech([
    greeting,
    `Tienes ${countLabel(pending.length, 'tarea pendiente', 'tareas pendientes')} y ${countLabel(inProgress.length, 'tarea en progreso', 'tareas en progreso')}.`,
    ...details,
    ...(remaining > 0 ? [`Y ${countLabel(remaining, 'tarea más', 'tareas más')} en tu lista.`] : []),
  ].join(' '))
}

/** Lectura de una intervención, omitiendo las secciones sin contenido. */
export function buildTaskReading(task: Task) {
  const equipment = equipmentName(task)
  const sections: [string, string][] = [
    ['Problema reportado', task.problemReported || task.description],
    ['Diagnóstico', task.diagnosis],
    ['Actividades realizadas', task.activities],
    ['Resultado', task.result],
    ['Recomendaciones', task.recommendations],
  ]
  return fitForSpeech([
    `Tarea: ${task.title}.`,
    ...(equipment ? [`Equipo: ${equipment}.`] : []),
    `Estado: ${spokenStatus[task.status]}.`,
    ...sections.filter(([, content]) => content?.trim()).map(([label, content]) => `${label}: ${content.trim().replace(/[.\s]*$/, '')}.`),
  ].join(' '))
}
