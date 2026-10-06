import { Router } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { requireAuth } from '../../middleware/requireAuth'
import { EquipmentModel } from '../../models/Equipment'
import { EvidenceModel } from '../../models/Evidence'
import { TaskModel, taskStatuses, type TaskStatus } from '../../models/Task'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'
import { canTransitionTaskStatus } from './taskStatus'
import { isValidEvidenceImage } from './evidenceValidation'

const router = Router()
const evidenceUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } })
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

async function taskWithEvidence(taskId: string, ownerId: string) {
  const task = await TaskModel.findOne({ _id: taskId, owner: ownerId })
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .lean()
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  const evidence = await EvidenceModel.find({ task: task._id, owner: ownerId })
    .select('filename mimeType size uploadedAt')
    .sort({ uploadedAt: 1 })
    .lean()
  return {
    ...task,
    evidence: evidence.map((item) => ({
      _id: String(item._id),
      filename: item.filename,
      mimeType: item.mimeType,
      size: item.size,
      uploadedAt: item.uploadedAt,
      url: `/tasks/${taskId}/evidence/${item._id}/content`,
    })),
  }
}

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
  const task = await taskWithEvidence(String(request.params.id), request.authUser!.id)
  response.json({ task })
}))

router.get('/:id/evidence/:evidenceId/content', asyncHandler(async (request, response) => {
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id }).select('_id')
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  const evidence = await EvidenceModel.findOne({ _id: request.params.evidenceId, task: task._id, owner: request.authUser!.id }).select('+data')
  if (!evidence) throw new HttpError(404, 'No se encontró la evidencia solicitada.')
  response.setHeader('Cache-Control', 'private, no-store')
  response.setHeader('Content-Disposition', 'inline')
  response.type(evidence.mimeType).send(evidence.data)
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
  response.json({ message: 'Estado actualizado correctamente.', task: await taskWithEvidence(String(task._id), request.authUser!.id) })
}))

router.patch('/:id/documentation', asyncHandler(async (request, response) => {
  const input = documentationSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa la documentación enviada.')
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id })
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  if (task.status === 'COMPLETED') throw new HttpError(409, 'No se puede editar la documentación de una tarea completada.')
  Object.assign(task, input.data)
  await task.save()
  response.json({ message: 'Documentación técnica guardada.', task: await taskWithEvidence(String(task._id), request.authUser!.id) })
}))

router.post('/:id/evidence', (request, response, next) => {
  evidenceUpload.single('image')(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE'
      next(new HttpError(tooLarge ? 413 : 400, tooLarge ? 'La imagen supera el máximo de 5 MB.' : 'Solo puedes adjuntar una imagen por carga.'))
      return
    }
    if (error) {
      next(error)
      return
    }
    next()
  })
}, asyncHandler(async (request, response) => {
  const task = await TaskModel.findOne({ _id: request.params.id, owner: request.authUser!.id }).select('_id status')
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  if (task.status === 'COMPLETED') throw new HttpError(409, 'No se pueden adjuntar evidencias a una tarea completada.')
  const file = request.file
  if (!file) throw new HttpError(400, 'Selecciona una imagen para adjuntar.')
  if (!await isValidEvidenceImage(file.mimetype, file.buffer)) throw new HttpError(400, 'La evidencia debe ser una imagen JPG, PNG o WEBP válida.')

  await EvidenceModel.create({
    task: task._id,
    owner: request.authUser!.id,
    filename: file.originalname.slice(0, 255),
    mimeType: file.mimetype,
    size: file.size,
    data: file.buffer,
  })
  response.status(201).json({ message: 'Evidencia adjuntada correctamente.', task: await taskWithEvidence(String(request.params.id), request.authUser!.id) })
}))

export default router