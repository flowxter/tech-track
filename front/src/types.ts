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
  problemReported: string
  diagnosis: string
  activities: string
  result: string
  recommendations: string
  evidence?: TaskEvidence[]
  equipment: Equipment | string
  status: TaskStatus
  statusHistory: { status: TaskStatus; changedAt: string }[]
  createdAt: string
  updatedAt: string
}

export type TaskEvidence = {
  _id: string
  filename: string
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
  size: number
  uploadedAt: string
  url: string
}

export type AdminActivity = Task & { owner: Pick<User, '_id' | 'name' | 'email'> }

export type AuthResult = { token: string; user: User }