import type { AdminActivity, AdminEquipment, AuthResult, Equipment, Task, TaskStatus, User } from './types'

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
  getTask: (token: string, id: string) => request<{ task: Task }>(`/tasks/${id}`, {}, token).then(({ task }) => task),
  getEvidenceImage: async (token: string, path: string) => {
    const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { message?: string }
      throw new ApiError(payload.message ?? 'No se pudo cargar la evidencia.', response.status)
    }
    return response.blob()
  },
  evidenceUrl: (path: string) => `${API_URL}${path}`,
  uploadEvidence: (token: string, id: string, image: File) => {
    const body = new FormData()
    body.append('image', image)
    return request<{ message: string; task: Task }>(`/tasks/${id}/evidence`, { method: 'POST', body }, token)
  },
  createTask: (token: string, data: { title: string; description: string; equipmentId: string }) =>
    request<{ task: Task }>('/tasks', { method: 'POST', body: JSON.stringify(data) }, token).then(({ task }) => task),
  updateTaskDocumentation: (token: string, id: string, data: Pick<Task, 'problemReported' | 'diagnosis' | 'activities' | 'result' | 'recommendations'>) =>
    request<{ message: string; task: Task }>(`/tasks/${id}/documentation`, { method: 'PATCH', body: JSON.stringify(data) }, token),
  updateTaskStatus: (token: string, id: string, status: TaskStatus) =>
    request<{ task: Task }>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token).then(({ task }) => task),
  listEquipment: (token: string) => request<{ equipment: Equipment[] }>('/equipment', {}, token).then(({ equipment }) => equipment),
  getEquipmentHistory: (token: string, id: string) => request<{ equipment: Equipment; tasks: Task[] }>(`/equipment/${id}/history`, {}, token),
  listAdminActivities: (token: string) => request<{ activities: AdminActivity[] }>('/admin/activities', {}, token).then(({ activities }) => activities),
  getAdminTechnicians: (token: string) => request<{ technicians: User[]; equipment: AdminEquipment[] }>('/admin/technicians', {}, token),
  createAssignedTask: (token: string, data: { title: string; description: string; technicianId: string; equipmentId: string }) =>
    request<{ message: string; task: AdminActivity }>('/admin/tasks', { method: 'POST', body: JSON.stringify(data) }, token),
  getAdminTask: (token: string, id: string) => request<{ task: AdminActivity }>(`/admin/tasks/${id}`, {}, token).then(({ task }) => task),
  createEquipment: (token: string, data: Omit<Equipment, '_id' | 'createdAt'>) =>
    request<{ equipment: Equipment }>('/equipment', { method: 'POST', body: JSON.stringify(data) }, token).then(({ equipment }) => equipment),
}