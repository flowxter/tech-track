import type { Request, RequestHandler, Response } from 'express'

type AsyncController = (request: Request, response: Response) => Promise<unknown>

/** Convierte controladores async en handlers compatibles con Express 5. */
export function asyncHandler(controller: AsyncController): RequestHandler {
  return (request, response, next) => {
    void controller(request, response).catch(next)
  }
}