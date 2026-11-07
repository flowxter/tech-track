import { useCallback, useEffect, useRef, useState } from 'react'

export type SpeechStatus = 'idle' | 'loading' | 'playing'
type CancelPlayback = () => void

// Solo puede sonar una lectura a la vez: empezar otra detiene al reproductor activo y actualiza su botón.
let stopActivePlayer: (() => void) | null = null

async function playAudio(audio: Blob, onEnded: () => void): Promise<CancelPlayback> {
  const url = URL.createObjectURL(audio)
  const element = new Audio(url)
  element.onended = () => { URL.revokeObjectURL(url); onEnded() }
  try {
    await element.play()
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
  return () => { element.pause(); URL.revokeObjectURL(url) }
}

/** Voz local del navegador: mantiene la lectura disponible sin clave o sin créditos de ElevenLabs. */
function speakWithBrowser(text: string, onEnded: () => void): CancelPlayback {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  utterance.onend = onEnded
  utterance.onerror = onEnded
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
  return () => { utterance.onend = null; utterance.onerror = null; window.speechSynthesis.cancel() }
}

/**
 * Lee textos en voz alta con la voz de ElevenLabs y usa la del navegador si la API no puede generarla.
 * @param synthesize Solicita a la API el audio del texto.
 */
export function useSpeechPlayer(synthesize: (text: string) => Promise<Blob>, onError: (message: string) => void) {
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const cancelPlayback = useRef<CancelPlayback | null>(null)
  const request = useRef(0)

  const stop = useCallback(() => {
    request.current++
    cancelPlayback.current?.()
    cancelPlayback.current = null
    setStatus('idle')
  }, [])

  useEffect(() => stop, [stop])

  const speak = useCallback(async (text: string) => {
    stopActivePlayer?.()
    stopActivePlayer = stop
    const requestId = ++request.current
    const finish = () => {
      if (requestId !== request.current) return
      cancelPlayback.current = null
      stop()
    }

    setStatus('loading')
    try {
      const audio = await synthesize(text)
      if (requestId !== request.current) return
      const cancel = await playAudio(audio, finish)
      if (requestId !== request.current) { cancel(); return }
      cancelPlayback.current = cancel
      setStatus('playing')
    } catch (error) {
      if (requestId !== request.current || (error instanceof DOMException && error.name === 'AbortError')) return
      if ('speechSynthesis' in window) {
        cancelPlayback.current = speakWithBrowser(text, finish)
        setStatus('playing')
        return
      }
      stop()
      onError('No se pudo leer el contenido en voz alta.')
    }
  }, [synthesize, onError, stop])

  return { status, speak, stop }
}
