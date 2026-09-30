import mongoose from 'mongoose'
import { env } from './env'

/** Abre la conexión con MongoDB antes de aceptar solicitudes HTTP. */
export async function connectDatabase() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  console.info('Conexión con MongoDB establecida.')
}