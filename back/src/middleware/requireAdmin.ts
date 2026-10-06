import type { RequestHandler } from 'express'

export const requireAdmin: RequestHandler = (request, response, next) => {
  if (request.authUser?.role !== 'ADMIN') {
    response.status(403).json({ message: 'No tienes permisos para consultar la supervisión de actividades.' })
    return
  }
  next()
}