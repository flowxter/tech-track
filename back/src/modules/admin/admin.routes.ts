import { Router } from 'express'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'
import { TaskModel } from '../../models/Task'
import { asyncHandler } from '../../utils/asyncHandler'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/activities', asyncHandler(async (_request, response) => {
  const activities = await TaskModel.find()
    .populate('owner', 'name email')
    .populate('equipment', 'assetTag name type brand model serialNumber')
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean()
  response.json({ activities })
}))

export default router