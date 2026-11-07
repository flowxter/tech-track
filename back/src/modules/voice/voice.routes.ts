import { Router, type RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import multer from 'multer'
import { z } from 'zod'
import { env } from '../../config/env'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'
import { EquipmentModel } from '../../models/Equipment'
import { UserModel } from '../../models/User'
import { HttpError } from '../../utils/HttpError'
import { asyncHandler } from '../../utils/asyncHandler'
import { createAssemblyAiClient } from './assemblyAiClient'
import { parseDocumentationDictation } from './documentationDictation'
import { createElevenLabsClient } from './elevenLabsClient'
import { parseTaskDictation } from './taskDictation'

// Por debajo del límite de 4,5 MB de Vercel Functions, multipart incluido.
const MAX_AUDIO_BYTES = 4 * 1024 * 1024
const MAX_SPEECH_CHARACTERS = 2500

const router = Router()
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_AUDIO_BYTES, files: 1 } })
// Cada llamada consume créditos de un proveedor externo, así que el cupo es por usuario.
const voiceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (request) => request.authUser!.id,
  message: { message: 'Alcanzaste el límite de uso de voz. Intenta de nuevo en unos minutos.' },
})
const speechSchema = z.object({ text: z.string().trim().min(1, 'No hay texto para leer.').max(MAX_SPEECH_CHARACTERS, 'El texto es demasiado largo para leerlo en voz alta.') })

const transcriber = env.ASSEMBLYAI_API_KEY ? createAssemblyAiClient({ apiKey: env.ASSEMBLYAI_API_KEY }) : null
const speechSynthesizer = env.ELEVENLABS_API_KEY
  ? createElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY, voiceId: env.ELEVENLABS_VOICE_ID, modelId: env.ELEVENLABS_MODEL_ID })
  : null

/** Recibe el audio en el campo multipart `audio` y traduce los errores de carga a mensajes del dominio. */
const receiveAudio: RequestHandler = (request, response, next) => {
  audioUpload.single('audio')(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE'
      next(new HttpError(tooLarge ? 413 : 400, tooLarge ? 'La grabación supera el máximo de 4 MB.' : 'Envía una sola grabación por solicitud.'))
      return
    }
    next(error)
  })
}

/** Transcribe la grabación de la solicitud; sin clave configurada responde 503 antes de leer el audio. */
async function transcribeUpload(file: Express.Multer.File | undefined) {
  if (!transcriber) throw new HttpError(503, 'La transcripción por voz no está configurada en el servidor.')
  if (!file?.buffer.length) throw new HttpError(400, 'Envía una grabación para transcribir.')
  if (!file.mimetype.startsWith('audio/')) throw new HttpError(415, 'El archivo enviado no es un audio.')
  return transcriber.transcribe(file.buffer)
}

function toEquipmentCandidates(equipment: { _id: unknown; assetTag: string; name: string; owner: unknown }[]) {
  return equipment.map(({ _id, assetTag, name, owner }) => ({ id: String(_id), assetTag, name, ownerId: String(owner) }))
}

router.use(requireAuth, voiceLimiter)

/** Dictado libre de un campo de texto. */
router.post('/transcribe', receiveAudio, asyncHandler(async (request, response) => {
  response.json({ text: await transcribeUpload(request.file) })
}))

/** Borrador de tarea propia: solo reconoce equipos de la cuenta autenticada. */
router.post('/task-draft', receiveAudio, asyncHandler(async (request, response) => {
  const text = await transcribeUpload(request.file)
  const equipment = await EquipmentModel.find({ owner: request.authUser!.id }).select('owner assetTag name').lean()
  response.json({ text, draft: parseTaskDictation(text, toEquipmentCandidates(equipment)) })
}))

/** Borrador de asignación administrativa: reconoce técnicos y sus equipos. */
router.post('/assignment-draft', requireAdmin, receiveAudio, asyncHandler(async (request, response) => {
  const text = await transcribeUpload(request.file)
  const technicians = await UserModel.find({ role: 'TECHNICIAN' }).select('name').lean()
  const equipment = await EquipmentModel.find({ owner: { $in: technicians.map(({ _id }) => _id) } }).select('owner assetTag name').lean()
  const candidates = technicians.map(({ _id, name }) => ({ id: String(_id), name }))
  response.json({ text, draft: parseTaskDictation(text, toEquipmentCandidates(equipment), candidates) })
}))

/** Informe técnico dictado de corrido y repartido por secciones. */
router.post('/documentation-draft', receiveAudio, asyncHandler(async (request, response) => {
  const text = await transcribeUpload(request.file)
  response.json({ text, sections: parseDocumentationDictation(text) })
}))

/** Lectura en voz alta con ElevenLabs; el cliente usa la voz del navegador si responde 503. */
router.post('/speech', asyncHandler(async (request, response) => {
  if (!speechSynthesizer) throw new HttpError(503, 'La voz de ElevenLabs no está configurada en el servidor.')
  const input = speechSchema.safeParse(request.body)
  if (!input.success) throw new HttpError(400, input.error.issues[0]?.message ?? 'Revisa el texto enviado.')
  const audio = await speechSynthesizer.synthesize(input.data.text)
  response.setHeader('Cache-Control', 'private, no-store')
  response.type('audio/mpeg').send(audio)
}))

export default router
