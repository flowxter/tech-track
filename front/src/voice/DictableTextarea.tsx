import { useId, type TextareaHTMLAttributes } from 'react'
import { appendDictation } from './appendDictation'
import { DictationButton } from './DictationButton'

type DictableTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'maxLength' | 'id'> & {
  label: string
  value: string
  maxLength: number
  onValueChange: (update: (current: string) => string) => void
  transcribe: (audio: Blob) => Promise<string>
  onDictationError: (message: string) => void
}

/** Área de texto con botón de micrófono para completar el campo por voz. */
export function DictableTextarea({ label, value, maxLength, onValueChange, transcribe, onDictationError, ...textareaProps }: DictableTextareaProps) {
  const id = useId()
  return <div className="dictable-field">
    <div className="dictable-label">
      <label htmlFor={id}>{label}</label>
      <DictationButton
        label={`Dictar ${label.toLowerCase()}`}
        disabled={textareaProps.disabled}
        process={transcribe}
        onResult={(text) => onValueChange((current) => appendDictation(current, text, maxLength))}
        onError={onDictationError}
      />
    </div>
    <textarea id={id} value={value} maxLength={maxLength} onChange={(event) => { const next = event.target.value; onValueChange(() => next) }} {...textareaProps} />
  </div>
}
