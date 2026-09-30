import type { RequestHandler } from 'express'
import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { env } from '../config/env'
import { UserModel, type UserRole } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      authUser?: { id: string; name: string; email: string; role: UserRole }
    }
  }
}

/** Verifica el JWT y carga el usuario para aislar los recursos por propietario. */
export const requireAuth: RequestHandler = async (request, response, next) => {
  const authorization = request.header('authorization')
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    response.status(401).json({ message: 'Debes iniciar sesión para continuar.' })
    return
  }

  try {
    const payload = verify(token, env.JWT_SECRET) as { sub?: string; tokenVersion?: number }
    if (!payload.sub || typeof payload.tokenVersion !== 'number') throw new JsonWebTokenError('Token inválido.')
    const user = await UserModel.findById(payload.sub).select('_id name email role tokenVersion')
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      response.status(401).json({ message: 'La sesión expiró. Inicia sesión nuevamente.' })
      return
    }
    request.authUser = { id: user.id, name: user.name, email: user.email, role: user.role as UserRole }
    next()
  } catch {
    response.status(401).json({ message: 'La sesión no es válida. Inicia sesión nuevamente.' })
  }
}