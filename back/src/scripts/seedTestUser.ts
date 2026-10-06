import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { env } from '../config/env'
import { UserModel } from '../models/User'

/** Crea una cuenta local de prueba; nunca se usa como ruta pública de registro. */
async function seedTestUser() {
  const name = process.env.TEST_USER_NAME ?? 'Juan'
  const email = process.env.TEST_USER_EMAIL ?? 'juan@techtrack.local'
  const password = process.env.TEST_USER_PASSWORD
  const role = process.env.TEST_USER_ROLE === 'ADMIN' ? 'ADMIN' : 'TECHNICIAN'
  if (!password) throw new Error('Define TEST_USER_PASSWORD solo en el .env local.')

  await mongoose.connect(env.MONGODB_URI)
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { name, email: email.toLowerCase(), passwordHash, role } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
  console.info(`Cuenta local lista: ${user.name} (${user.email}), rol ${user.role}.`)
}

seedTestUser()
  .catch((error: unknown) => {
    console.error('No se pudo crear la cuenta local de prueba.', error)
    process.exitCode = 1
  })
  .finally(async () => mongoose.disconnect())