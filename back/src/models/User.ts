import { model, Schema } from 'mongoose'

export type UserRole = 'TECHNICIAN' | 'ADMIN'

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['TECHNICIAN', 'ADMIN'], default: 'TECHNICIAN', required: true },
  tokenVersion: { type: Number, default: 0, required: true },
}, { timestamps: true })

export const UserModel = model('User', userSchema)