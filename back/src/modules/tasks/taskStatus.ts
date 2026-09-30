import type { TaskStatus } from '../../models/Task'

/** Solo permite avanzar por el flujo operativo definido para el MVP. */
export function canTransitionTaskStatus(current: TaskStatus, next: TaskStatus) {
  return (current === 'PENDING' && next === 'IN_PROGRESS')
    || (current === 'IN_PROGRESS' && next === 'COMPLETED')
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'PENDING' || value === 'IN_PROGRESS' || value === 'COMPLETED'
}