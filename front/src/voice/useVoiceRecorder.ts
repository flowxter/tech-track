import { useCallback, useEffect, useRef, useState } from 'react'

// A esta calidad, tres minutos de voz ocupan menos de 1 MB, muy por debajo del límite de la API.
const AUDIO_BITS_PER_SECOND = 32_000
const MAX_RECORDING_MS = 3 * 60 * 1000
// Chrome y Edge graban webm, Firefox ogg y Safari mp4.
const PREFERRED_FORMATS = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']

type RecorderHandlers = { onRecorded: (audio: Blob) => void; onError: (message: string) => void }

function describeMicrophoneError(error: unknown) {
  if (error instanceof DOMException && error.name === 'NotAllowedError') return 'Permite el acceso al micrófono para poder dictar.'
  if (error instanceof DOMException && error.name === 'NotFoundError') return 'No se encontró un micrófono en este dispositivo.'
  return 'No se pudo iniciar la grabación.'
}

/** Graba del micrófono y entrega el audio al detener. Desmontar descarta la grabación en curso. */
export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      recorder.current?.stop()
    }
  }, [])

  const stop = useCallback(() => recorder.current?.stop(), [])

  const start = useCallback(async ({ onRecorded, onError }: RecorderHandlers) => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      onError('Este navegador no permite grabar audio.')
      return
    }
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (error) {
      onError(describeMicrophoneError(error))
      return
    }
    // El permiso pudo concederse después de cerrar el formulario.
    if (!mounted.current) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }

    const mimeType = PREFERRED_FORMATS.find((format) => MediaRecorder.isTypeSupported(format))
    const active = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: AUDIO_BITS_PER_SECOND })
    const chunks: Blob[] = []
    const limit = window.setTimeout(() => active.stop(), MAX_RECORDING_MS)
    active.ondataavailable = (event) => chunks.push(event.data)
    active.onstop = () => {
      window.clearTimeout(limit)
      stream.getTracks().forEach((track) => track.stop())
      recorder.current = null
      if (!mounted.current) return
      setRecording(false)
      onRecorded(new Blob(chunks, { type: active.mimeType }))
    }
    active.start()
    recorder.current = active
    setRecording(true)
  }, [])

  return { recording, start, stop }
}
