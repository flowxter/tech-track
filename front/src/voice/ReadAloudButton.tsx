import { LoaderCircle, Square, Volume2 } from 'lucide-react'
import { useSpeechPlayer } from './useSpeechPlayer'

type ReadAloudButtonProps = {
  label: string
  /** Se calcula al pulsar, para leer siempre los datos vigentes. */
  getText: () => string
  synthesize: (text: string) => Promise<Blob>
  onError: (message: string) => void
}

/** Lee un texto en voz alta. Al desmontarse (cerrar el detalle o la sesión) la lectura se detiene. */
export function ReadAloudButton({ label, getText, synthesize, onError }: ReadAloudButtonProps) {
  const { status, speak, stop } = useSpeechPlayer(synthesize, onError)
  const idle = status === 'idle'
  return <button type="button" className="secondary-button" onClick={() => idle ? void speak(getText()) : stop()}>
    {status === 'loading' ? <LoaderCircle size={15} className="voice-spinner" /> : idle ? <Volume2 size={15} /> : <Square size={13} />}
    {idle ? label : 'Detener lectura'}
  </button>
}
