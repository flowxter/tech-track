import type { RequestParamHandler } from 'express'
import { HttpError } from '../utils/HttpError'

/** Valida antes de consultar Mongoose; se registra después de autenticación. */
export const validateObjectId: RequestParamHandler = (_request, _response, next, value) => {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) {
    next(new HttpError(400, 'El identificador solicitado no es válido.'))
    return
  }
  next()
}
