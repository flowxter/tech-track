import { Router } from 'express'
import { z } from 'zod'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'
import { EquipmentModel } from '../../models/Equipment'
import { EvidenceModel } from '../../models/Evidence'
import { TaskModel } from '../../models/Task'
import { UserModel } from '../../models/User'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'

const router = Router()
const assignmentSchema = z.object({
  title: z.string().trim().min(1, 'El título de la tarea es obligatorio.').max(120),
  description: z.string().trim().max(2000).default(''),
  technicianId: z.string().regex(/^[a-f\d]{24}$/i, 'Selecciona un técnico válido.'),
  equipmentId: z.string().regex(/^[a-f\d]{24}$/i, 'Selecciona un equipo válido.'),
})

router.use(requireAuth, requireAdmin)

router.get('/technicians', asyncHandler(async (_request, response) => {
  const technicians = await UserModel.find({ role: 'TECHNICIAN' }).select('name email role').sort({ name: 1 }).lean()
  const equipment = await EquipmentModel.find({ owner: { $in: technicians.map((technician) => technician._id) } })
    .select('owner assetTag name type brand model serialNumber createdAt')
    .sort({ assetTag: 1 })
    .lean()
  response.json({ technicians, equipment })
}))

router.get('/activities', asyncHandler(async (_request, response) => {
  const activities = await TaskModel.find()
    .populate('owner', 'name email')
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean()
  response.json({ activities })
}))

router.post('/tasks', asyncHandler(async (request, response) => {
  const input = assignmentSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa los datos de la asignación.')
  const technician = await UserModel.findOne({ _id: input.data.technicianId, role: 'TECHNICIAN' }).select('_id name')
  if (!technician) throw new HttpError(404, 'No se encontró el técnico seleccionado.')
  const equipment = await EquipmentModel.findOne({ _id: input.data.equipmentId, owner: technician._id }).select('_id')
  if (!equipment) throw new HttpError(400, 'Selecciona un equipo que pertenezca al técnico asignado.')

  const task = await TaskModel.create({
    owner: technician._id,
    equipment: equipment._id,
    title: input.data.title,
    description: input.data.description,
    problemReported: input.data.description,
    status: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedAt: new Date() }],
  })
  await task.populate([
    { path: 'owner', select: 'name email' },
    { path: 'equipment', select: 'assetTag name type brand model serialNumber' },
  ])
  response.status(201).json({ message: `Tarea asignada a ${technician.name}.`, task })
}))

router.get('/tasks/:id', asyncHandler(async (request, response) => {
  const taskId = String(request.params.id)
  const task = await TaskModel.findById(taskId)
    .populate('owner', 'name email')
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .lean()
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  const evidence = await EvidenceModel.find({ task: task._id, owner: task.owner._id })
    .select('filename mimeType size uploadedAt')
    .sort({ uploadedAt: 1 })
    .lean()
  response.json({ task: {
    ...task,
    evidence: evidence.map((item) => ({
      _id: String(item._id),
      filename: item.filename,
      mimeType: item.mimeType,
      size: item.size,
      uploadedAt: item.uploadedAt,
      url: `/admin/tasks/${taskId}/evidence/${item._id}/content`,
    })),
  } })
}))

router.get('/tasks/:taskId/evidence/:evidenceId/content', asyncHandler(async (request, response) => {
  const task = await TaskModel.findById(request.params.taskId).select('_id owner')
  if (!task) throw new HttpError(404, 'No se encontró la tarea solicitada.')
  const evidence = await EvidenceModel.findOne({ task: task._id, owner: task.owner, _id: request.params.evidenceId }).select('+data')
  if (!evidence) throw new HttpError(404, 'No se encontró la evidencia solicitada.')
  response.setHeader('Cache-Control', 'private, no-store')
  response.setHeader('Content-Disposition', 'inline')
  response.type(evidence.mimeType).send(evidence.data)
}))

export default router