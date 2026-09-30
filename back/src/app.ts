import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { ZodError } from 'zod'
import { env } from './config/env'
import { UserModel } from './models/User'
import authRoutes from './modules/auth/auth.routes'
import equipmentRoutes from './modules/equipment/equipment.routes'
import taskRoutes from './modules/tasks/task.routes'
import { HttpError } from './utils/HttpError'

const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok', database: 'connected' }))
app.use('/api/auth', authRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/tasks', taskRoutes)

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message })
    return
  }
  if (error instanceof ZodError) {
    response.status(400).json({ message: error.issues[0]?.message ?? 'Los datos enviados no son válidos.' })
    return
  }
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    response.status(409).json({ message: 'Ya existe un registro con ese identificador.' })
    return
  }
  console.error(error)
  response.status(500).json({ message: 'Ocurrió un error interno. Intenta de nuevo más tarde.' })
}
app.use(errorHandler)

export default app