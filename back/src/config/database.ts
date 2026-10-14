import mongoose from 'mongoose'
import { env } from './env'

let connectionPromise: Promise<typeof mongoose> | null = null

/** Reutiliza la conexión entre solicitudes y funciones calientes de Vercel. */
export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose
  if (mongoose.connection.readyState === 0) connectionPromise = null

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then((connection) => {
        console.info('Conexión con MongoDB establecida.')
        return connection
      })
      .catch((error: unknown) => {
        connectionPromise = null
        throw error
      })
  }

  return connectionPromise
}