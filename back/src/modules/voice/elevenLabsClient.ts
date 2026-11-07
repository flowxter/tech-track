import { HttpError } from '../../utils/HttpError'

const API_URL = 'https://api.elevenlabs.io/v1'

type ElevenLabsOptions = {
  apiKey: string
  voiceId: string
  modelId: string
  fetchFn?: typeof fetch
  timeoutMs?: number
}

/** Cliente mínimo de texto a voz de ElevenLabs. La clave nunca sale del servidor. */
export function createElevenLabsClient({ apiKey, voiceId, modelId, fetchFn = fetch, timeoutMs = 30_000 }: ElevenLabsOptions) {
  return {
    /** Devuelve el audio MP3 de la lectura del texto indicado. */
    async synthesize(text: string): Promise<Buffer> {
      try {
        const response = await fetchFn(`${API_URL}/text-to-speech/${encodeURIComponent(voiceId)}`, {
          method: 'POST',
          signal: AbortSignal.timeout(timeoutMs),
          headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify({ text, model_id: modelId }),
        })
        if (!response.ok) {
          console.error(`ElevenLabs respondió ${response.status}.`)
          throw new HttpError(502, 'El servicio de voz no está disponible.')
        }
        return Buffer.from(await response.arrayBuffer())
      } catch (error) {
        if (error instanceof HttpError) throw error
        console.error('No se pudo contactar con ElevenLabs:', error)
        throw new HttpError(502, 'El servicio de voz no está disponible.')
      }
    },
  }
}
