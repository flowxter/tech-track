import { model, Schema } from 'mongoose'

export const taskStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const
export type TaskStatus = typeof taskStatuses[number]

const taskSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', trim: true, maxlength: 2000 },
  problemReported: { type: String, default: '', trim: true, maxlength: 3000 },
  diagnosis: { type: String, default: '', trim: true, maxlength: 5000 },
  activities: { type: String, default: '', trim: true, maxlength: 5000 },
  result: { type: String, default: '', trim: true, maxlength: 3000 },
  recommendations: { type: String, default: '', trim: true, maxlength: 3000 },
  evidence: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  status: { type: String, enum: taskStatuses, default: 'PENDING', required: true },
  statusHistory: [{
    status: { type: String, enum: taskStatuses, required: true },
    changedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

taskSchema.index({ owner: 1, createdAt: -1 })
taskSchema.index({ equipment: 1, createdAt: -1 })

export const TaskModel = model('Task', taskSchema)