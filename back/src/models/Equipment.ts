import { model, Schema } from 'mongoose'

const equipmentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assetTag: { type: String, required: true, trim: true, maxlength: 40 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  type: { type: String, required: true, trim: true, maxlength: 60 },
  brand: { type: String, required: true, trim: true, maxlength: 60 },
  model: { type: String, required: true, trim: true, maxlength: 80 },
  serialNumber: { type: String, required: true, trim: true, maxlength: 100 },
}, { timestamps: true })

equipmentSchema.index({ owner: 1, assetTag: 1 }, { unique: true })

export const EquipmentModel = model('Equipment', equipmentSchema)