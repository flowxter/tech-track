import type { AuthResult, Equipment, Task, TaskStatus, User } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

/** Centraliza el manejo de errores HTTP y adjunta el token cuando hay sesión. */
async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({})) as { message?: string }
  if (!response.ok) throw new ApiError(payload.message ?? 'Ocurrió un error al procesar la solicitud.', response.status)
  return payload as T
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResult>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResult>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: async (token: string) => (await request<{ user: User }>('/auth/me', {}, token)).user,
  logout: (token: string) => request<{ message: string }>('/auth/logout', { method: 'POST' }, token),
  listTasks: (token: string) => request<{ tasks: Task[] }>('/tasks', {}, token).then(({ tasks }) => tasks),
  createTask: (token: string, data: { title: string; description: string; equipmentId: string }) =>
    request<{ task: Task }>('/tasks', { method: 'POST', body: JSON.stringify(data) }, token).then(({ task }) => task),
  updateTaskStatus: (token: string, id: string, status: TaskStatus) =>
    request<{ task: Task }>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token).then(({ task }) => task),
  listEquipment: (token: string) => request<{ equipment: Equipment[] }>('/equipment', {}, token).then(({ equipment }) => equipment),
  createEquipment: (token: string, data: Omit<Equipment, '_id' | 'createdAt'>) =>
    request<{ equipment: Equipment }>('/equipment', { method: 'POST', body: JSON.stringify(data) }, token).then(({ equipment }) => equipment),
}