import { HttpError } from '../../utils/HttpError'

const API_URL = 'https://api.assemblyai.com/v2'
// Mismo orden de modelos que el demo: AssemblyAI usa el primero que soporte el idioma.
const SPEECH_MODELS = ['universal-3-pro', 'universal-2']

type AssemblyAiOptions = {
  apiKey: string
  fetchFn?: typeof fetch
  pollIntervalMs?: number
  /** Margen total para subir, encolar y esperar; evita agotar el tiempo de la función serverless. */
  timeoutMs?: number
}

type TranscriptResponse = { id: string; status: 'queued' | 'processing' | 'completed' | 'error'; text?: string | null; error?: string }

/** Cliente mínimo de la API REST de AssemblyAI: sube el audio y espera la transcripción en español. */
export function createAssemblyAiClient({ apiKey, fetchFn = fetch, pollIntervalMs = 1000, timeoutMs = 50_000 }: AssemblyAiOptions) {
  async function callApi<T>(path: string, init: RequestInit, signal: AbortSignal): Promise<T> {
    const response = await fetchFn(`${API_URL}${path}`, { ...init, signal, headers: { Authorization: apiKey, ...init.headers } })
    if (!response.ok) {
      console.error(`AssemblyAI respondió ${response.status} en ${path}.`)
      throw new HttpError(502, 'El servicio de transcripción no está disponible.')
    }
    return await response.json() as T
  }

  async function waitForTranscript(id: string, signal: AbortSignal) {
    for (;;) {
      const transcript = await callApi<TranscriptResponse>(`/transcript/${id}`, { method: 'GET' }, signal)
      if (transcript.status === 'completed' || transcript.status === 'error') return transcript
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }
  }

  return {
    /** Devuelve el texto dictado; responde 422 si el audio no contiene voz reconocible. */
    async transcribe(audio: Buffer): Promise<string> {
      const signal = AbortSignal.timeout(timeoutMs)
      try {
        const { upload_url: audioUrl } = await callApi<{ upload_url: string }>('/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: new Uint8Array(audio),
        }, signal)
        const { id } = await callApi<TranscriptResponse>('/transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio_url: audioUrl, language_code: 'es', speech_models: SPEECH_MODELS }),
        }, signal)
        const transcript = await waitForTranscript(id, signal)

        if (transcript.status === 'error') {
          if (/no spoken audio/i.test(transcript.error ?? '')) throw new HttpError(422, 'No se detectó voz en la grabación. Intenta de nuevo.')
          console.error('AssemblyAI no pudo transcribir el audio:', transcript.error)
          throw new HttpError(502, 'No se pudo transcribir el audio.')
        }
        const text = transcript.text?.trim()
        if (!text) throw new HttpError(422, 'No se detectó voz en la grabación. Intenta de nuevo.')
        return text
      } catch (error) {
        if (error instanceof HttpError) throw error
        if (error instanceof Error && error.name === 'TimeoutError') throw new HttpError(504, 'La transcripción tardó demasiado. Intenta con un dictado más corto.')
        console.error('No se pudo contactar con AssemblyAI:', error)
        throw new HttpError(502, 'El servicio de transcripción no está disponible.')
      }
    },
  }
}
