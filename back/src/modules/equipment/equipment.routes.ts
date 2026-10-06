import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../middleware/requireAuth'
import { EquipmentModel } from '../../models/Equipment'
import { TaskModel } from '../../models/Task'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'

const router = Router()
const equipmentSchema = z.object({
  assetTag: z.string().trim().min(1, 'El identificador es obligatorio.').max(40),
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(120),
  type: z.string().trim().min(1, 'El tipo de equipo es obligatorio.').max(60),
  brand: z.string().trim().min(1, 'La marca es obligatoria.').max(60),
  model: z.string().trim().min(1, 'El modelo es obligatorio.').max(80),
  serialNumber: z.string().trim().min(1, 'El número de serie es obligatorio.').max(100),
})

router.use(requireAuth)

router.get('/', asyncHandler(async (request, response) => {
  const equipment = await EquipmentModel.find({ owner: request.authUser!.id }).sort({ createdAt: -1 }).lean()
  response.json({ equipment })
}))

router.get('/:id/history', asyncHandler(async (request, response) => {
  const equipment = await EquipmentModel.findOne({ _id: request.params.id, owner: request.authUser!.id })
    .select('assetTag name type brand model serialNumber')
    .lean()
  if (!equipment) throw new HttpError(404, 'No se encontró el equipo solicitado.')
  const tasks = await TaskModel.find({ equipment: equipment._id, owner: request.authUser!.id })
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean()
  response.json({ equipment, tasks })
}))

router.post('/', asyncHandler(async (request, response) => {
  const input = equipmentSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa los datos del equipo.')
  const equipment = await EquipmentModel.create({ ...input.data, owner: request.authUser!.id })
  response.status(201).json({ message: 'Equipo registrado correctamente.', equipment })
}))

export default router