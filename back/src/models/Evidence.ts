import { model, Schema } from 'mongoose'

const evidenceSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  filename: { type: String, required: true, trim: true, maxlength: 255 },
  mimeType: { type: String, enum: ['image/jpeg', 'image/png', 'image/webp'], required: true },
  size: { type: Number, required: true, max: 5 * 1024 * 1024 },
  data: { type: Buffer, required: true, select: false },
  uploadedAt: { type: Date, default: Date.now, required: true },
}, { timestamps: false })

evidenceSchema.index({ task: 1, uploadedAt: -1 })

export const EvidenceModel = model('Evidence', evidenceSchema)