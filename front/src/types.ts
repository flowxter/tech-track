export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export type User = {
  _id: string
  name: string
  email: string
  role: 'TECHNICIAN' | 'ADMIN'
}

export type Equipment = {
  _id: string
  assetTag: string
  name: string
  type: string
  brand: string
  model: string
  serialNumber: string
  createdAt: string
}

export type Task = {
  _id: string
  title: string
  description: string
  equipment: Equipment | string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export type AuthResult = { token: string; user: User }