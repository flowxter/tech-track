import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LoaderCircle, Mic, Square } from 'lucide-react'
import { useVoiceRecorder } from './useVoiceRecorder'

type DictationButtonProps<T> = {
  /** Nombre accesible del botón en reposo, por ejemplo "Dictar diagnóstico". */
  label: string
  /** Texto visible junto al icono; sin él, el botón solo muestra el icono. */
  children?: ReactNode
  disabled?: boolean
  /** Envía la grabación a la API. */
  process: (audio: Blob) => Promise<T>
  /** Recibe el resultado; debe usar actualizaciones funcionales de estado, porque se fija al empezar a grabar. */
  onResult: (result: T) => void
  onError: (message: string) => void
}

/** Botón de tres estados: pulsar para grabar, pulsar para detener y esperar la transcripción. */
export function DictationButton<T>({ label, children, disabled = false, process, onResult, onError }: DictationButtonProps<T>) {
  const { recording, start, stop } = useVoiceRecorder()
  const [processing, setProcessing] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  async function handleRecorded(audio: Blob) {
    setProcessing(true)
    try {
      const result = await process(audio)
      if (mounted.current) onResult(result)
    } catch (reason) {
      if (mounted.current) onError(reason instanceof Error ? reason.message : 'No se pudo transcribir el audio.')
    } finally {
      if (mounted.current) setProcessing(false)
    }
  }

  const state = recording ? 'recording' : processing ? 'processing' : 'idle'
  const name = recording ? 'Detener dictado' : processing ? 'Transcribiendo dictado' : label
  const icon = recording ? <Square size={12} /> : processing ? <LoaderCircle size={13} className="voice-spinner" /> : <Mic size={13} />
  const text = recording ? 'Detener' : processing ? 'Transcribiendo...' : children

  return <button
    type="button"
    className={`voice-button voice-${state}${children ? '' : ' voice-compact'}`}
    aria-label={name}
    title={name}
    disabled={processing || (disabled && !recording)}
    onClick={() => recording ? stop() : void start({ onRecorded: (audio) => void handleRecorded(audio), onError })}
  >{icon}{text}</button>
}
