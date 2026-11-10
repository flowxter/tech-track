import { useCallback, useEffect, useRef, useState } from 'react'

// A esta calidad, tres minutos de voz ocupan menos de 1 MB, muy por debajo del límite de la API.
const AUDIO_BITS_PER_SECOND = 32_000
const MAX_RECORDING_MS = 3 * 60 * 1000
const FINALIZATION_TIMEOUT_MS = 5000
// Chrome y Edge graban webm, Firefox ogg y Safari mp4.
const PREFERRED_FORMATS = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']

type RecorderHandlers = { onRecorded: (audio: Blob) => void; onError: (message: string) => void }
type RecordingSession = {
  stream: MediaStream | null
  recorder: MediaRecorder | null
  timer: number | null
  stopping: boolean
  onError: RecorderHandlers['onError']
}
let activeSession: RecordingSession | null = null

/** Idempotente: también funciona si construir, iniciar o detener el recorder falla. */
function releaseSession(session: RecordingSession) {
  if (activeSession === session) activeSession = null
  if (session.timer !== null) window.clearTimeout(session.timer)
  session.timer = null
  const active = session.recorder
  if (active) {
    active.ondataavailable = null
    active.onstop = null
    active.onerror = null
    try {
      if (active.state !== 'inactive') active.stop()
    } catch { /* Las pistas deben liberarse aunque MediaRecorder ya no responda. */ }
  }
  session.stream?.getTracks().forEach((track) => track.stop())
  session.stream = null
}

function describeMicrophoneError(error: unknown) {
  if (error instanceof DOMException && error.name === 'NotAllowedError') return 'Permite el acceso al micrófono para poder dictar.'
  if (error instanceof DOMException && error.name === 'NotFoundError') return 'No se encontró un micrófono en este dispositivo.'
  return 'No se pudo iniciar la grabación.'
}

/** Graba del micrófono y entrega el audio al detener. Desmontar descarta la grabación en curso. */
export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const current = useRef<RecordingSession | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      const session = current.current
      current.current = null
      if (session) releaseSession(session)
    }
  }, [])

  const stop = useCallback(() => {
    const session = current.current
    if (!session || session.stopping) return
    // Cancelar también invalida un permiso todavía pendiente.
    if (!session.recorder) {
      current.current = null
      releaseSession(session)
      return
    }
    session.stopping = true
    if (session.timer !== null) window.clearTimeout(session.timer)
    session.timer = null
    // stop() encola dataavailable y después stop. Conservar las pistas y handlers
    // hasta ese último evento permite recibir todos los fragmentos del encoder.
    session.timer = window.setTimeout(() => {
      if (current.current !== session) return
      current.current = null
      releaseSession(session)
      if (mounted.current) {
        setRecording(false)
        session.onError('La grabación no pudo finalizar. No se envió el audio; intenta grabar de nuevo.')
      }
    }, FINALIZATION_TIMEOUT_MS)
    try {
      session.recorder.stop()
    } catch {
      current.current = null
      releaseSession(session)
      if (mounted.current) {
        setRecording(false)
        session.onError('No se pudo detener la grabación. Intenta de nuevo.')
      }
    }
  }, [])

  const start = useCallback(async ({ onRecorded, onError }: RecorderHandlers) => {
    if (!mounted.current || current.current) return
    if (activeSession) {
      onError('Ya hay un dictado en curso. Detén la grabación anterior antes de iniciar otra.')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      onError('Este navegador no permite grabar audio.')
      return
    }
    // Se reserva antes del primer await: un segundo clic no abre otro stream.
    const session: RecordingSession = { stream: null, recorder: null, timer: null, stopping: false, onError }
    current.current = session
    activeSession = session
    try {
      session.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // La sesión pudo cerrarse o cancelarse mientras se concedía el permiso.
      if (!mounted.current || current.current !== session) {
        releaseSession(session)
        return
      }

      const mimeType = PREFERRED_FORMATS.find((format) => MediaRecorder.isTypeSupported(format))
      const active = new MediaRecorder(session.stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: AUDIO_BITS_PER_SECOND })
      session.recorder = active
      const chunks: Blob[] = []
      active.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data) }
      active.onstop = () => {
        const deliver = mounted.current && current.current === session
        if (current.current === session) current.current = null
        releaseSession(session)
        if (!deliver) return
        setRecording(false)
        const audio = new Blob(chunks, { type: active.mimeType })
        if (!audio.size) {
          onError('La grabación no contiene audio. No se envió; intenta grabar de nuevo.')
          return
        }
        onRecorded(audio)
      }
      active.onerror = () => {
        const report = mounted.current && current.current === session
        if (current.current === session) current.current = null
        releaseSession(session)
        if (report) {
          setRecording(false)
          onError('La grabación se interrumpió. Intenta de nuevo.')
        }
      }
      active.start()
      session.timer = window.setTimeout(stop, MAX_RECORDING_MS)
      setRecording(true)
    } catch (error) {
      const report = mounted.current && current.current === session
      if (current.current === session) current.current = null
      releaseSession(session)
      if (report) {
        setRecording(false)
        onError(describeMicrophoneError(error))
      }
    }
  }, [stop])

  return { recording, start, stop }
}
