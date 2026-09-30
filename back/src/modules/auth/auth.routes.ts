import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import { sign, type SignOptions } from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../../config/env'
import { requireAuth } from '../../middleware/requireAuth'
import { UserModel } from '../../models/User'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'

const router = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 25, standardHeaders: 'draft-8', legacyHeaders: false })
const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(80),
  email: z.string().trim().toLowerCase().email('Ingresa un correo válido.').max(254),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(72),
})
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Ingresa un correo válido.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
})

function issueToken(user: { id: string; tokenVersion: number }) {
  return sign({ tokenVersion: user.tokenVersion }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

router.post('/register', authLimiter, asyncHandler(async (request, response) => {
  const input = registerSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa los datos del formulario.')
  const existingUser = await UserModel.exists({ email: input.data.email })
  if (existingUser) throw new HttpError(409, 'Ya existe una cuenta con ese correo electrónico.')

  const passwordHash = await bcrypt.hash(input.data.password, 12)
  const user = await UserModel.create({ ...input.data, passwordHash })
  response.status(201).json({
    message: 'Cuenta creada correctamente.',
    token: issueToken({ id: String(user._id), tokenVersion: user.tokenVersion }),
    user: { _id: String(user._id), name: user.name, email: user.email, role: user.role },
  })
}))

router.post('/login', authLimiter, asyncHandler(async (request, response) => {
  const input = loginSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa tus credenciales.')
  const user = await UserModel.findOne({ email: input.data.email }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(input.data.password, user.passwordHash))) {
    throw new HttpError(401, 'Correo o contraseña incorrectos.')
  }
  response.json({
    token: issueToken({ id: String(user._id), tokenVersion: user.tokenVersion }),
    user: { _id: String(user._id), name: user.name, email: user.email, role: user.role },
  })
}))

router.get('/me', requireAuth, asyncHandler(async (request, response) => {
  response.json({ user: request.authUser })
}))

router.post('/logout', requireAuth, asyncHandler(async (request, response) => {
  await UserModel.updateOne({ _id: request.authUser!.id }, { $inc: { tokenVersion: 1 } })
  response.json({ message: 'La sesión se cerró correctamente.' })
}))

export default router