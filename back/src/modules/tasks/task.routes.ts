import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../middleware/requireAuth'
import { EquipmentModel } from '../../models/Equipment'
import { TaskModel, taskStatuses, type TaskStatus } from '../../models/Task'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'
import { canTransitionTaskStatus } from './taskStatus'

const router = Router()
const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.').max(120),
  description: z.string().trim().max(2000).default(''),
  equipmentId: z.string().regex(/^[a-f\d]{24}$/i, 'Selecciona un equipo válido.'),
})
const statusSchema = z.object({ status: z.enum(taskStatuses) })
const documentationSchema = z.object({
  problemReported: z.string().trim().max(3000).optional(),
  diagnosis: z.string().trim().max(5000).optional(),
  activities: z.string().trim().max(5000).optional(),
  result: z.string().trim().max(3000).optional(),
  recommendations: z.string().trim().max(3000).optional(),
}).refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.')

router.use(requireAuth)

router.get('/', asyncHandler(async (request, response) => {
  const tasks = await TaskModel.find({ owner: request.authUser!.id })
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .sort({ createdAt: -1 })
    .lean()
  response.json({ tasks })
}))

router.post('/', asyncHandler(async (request, response) => {
  const input = createTaskSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa los datos de la tarea.')
  const equipment = await EquipmentModel.findOne({ _id: input.data.equipmentId, owner: request.authUser!.id }).select('_id')
  if (!equipment) throw new HttpError(404, 'El equipo seleccionado no existe o no está disponible en tu cuenta.')

  const task = await TaskModel.create({
    owner: request.authUser!.id,
    equipment: equipment._id,
    title: input.data.title,
    description: input.data.description,
    problemReported: input.data.description,
    status: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedAt: new Date() }],
  })
  await task.populate('equipment', 'assetTag name type brand model serialNumber')
  response.status(201).json({ message: 'Tarea creada correctamente.', task })
}))

router.get('/:id', asyncHandler(async (request, response) => {
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id })
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .lean()
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  response.json({ task })
}))

router.patch('/:id/status', asyncHandler(async (request, response) => {
  const input = statusSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, 'El estado indicado no pertenece al flujo del MVP.')
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id })
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  if (task.status !== input.data.status && !canTransitionTaskStatus(task.status as TaskStatus, input.data.status)) {
    throw new HttpError(409, `No se permite cambiar de ${task.status} a ${input.data.status}.`)
  }
  if (task.status !== input.data.status) {
    task.status = input.data.status
    task.statusHistory.push({ status: input.data.status, changedAt: new Date() })
    await task.save()
  }
  await task.populate('equipment', 'assetTag name type brand model serialNumber')
  response.json({ message: 'Estado actualizado correctamente.', task })
}))

router.patch('/:id/documentation', asyncHandler(async (request, response) => {
  const input = documentationSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa la documentación enviada.')
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id })
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  if (task.status === 'COMPLETED') throw new HttpError(409, 'No se puede editar la documentación de una tarea completada.')
  Object.assign(task, input.data)
  await task.save()
  await task.populate('equipment', 'assetTag name type brand model serialNumber')
  response.json({ message: 'Documentación técnica guardada.', task })
}))

export default router