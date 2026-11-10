import { useState, type FormEvent } from 'react'
import { ClipboardList, Laptop, Plus } from 'lucide-react'
import type { Equipment, VoiceTaskDraft } from '../types'
import { DictableTextarea } from '../voice/DictableTextarea'
import { DictationButton } from '../voice/DictationButton'
import { DictationConflicts } from '../voice/DictationConflicts'
import { useDictatedFields } from '../voice/useDictatedFields'

type NewTaskFormProps = {
  equipment: Equipment[]
  dictateDraft: (audio: Blob) => Promise<VoiceTaskDraft>
  transcribe: (audio: Blob) => Promise<string>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onNotice: (message: string) => void
}

/** Formulario de nueva tarea. El dictado solo rellena campos: guardar sigue siendo una decisión de la persona. */
export function NewTaskForm({ equipment, dictateDraft, transcribe, onSubmit, onCancel, onNotice }: NewTaskFormProps) {
  const [equipmentId, setEquipmentId] = useState('')
  const text = useDictatedFields()
  const { title, setTitle, description, setDescription } = text

  function applyDraft({ draft }: VoiceTaskDraft) {
    const nextEquipment = equipment.find(({ _id }) => _id === draft.equipmentId)?._id ?? ''
    text.applyDictation(draft)
    setEquipmentId(nextEquipment)
    onNotice(nextEquipment ? 'Revisa el borrador actualizado. Los conflictos con cambios manuales se muestran en el formulario.' : 'Selecciona manualmente el equipo: no se pudo identificar por voz. Revisa el texto y los posibles conflictos en el formulario.')
  }

  return <form className="dialog-form" onSubmit={(event) => {
    if (text.hasConflicts) { event.preventDefault(); return }
    onSubmit(event)
  }}>
    <div className="form-intro"><span className="dialog-icon"><ClipboardList size={18} /></span><div><strong>Define la intervención</strong><span>La tarea se creará con estado pendiente.</span></div></div>
    <div className="voice-draft">
      <DictationButton label="Dictar tarea completa" disabled={equipment.length === 0} process={dictateDraft} onResult={applyDraft} onError={onNotice}>Dictar tarea</DictationButton>
      <span>Ej.: «Equipo PC-001. Título: cambiar disco. Descripción: hace ruido al arrancar.»</span>
    </div>
    <label>Título de la tarea<input name="title" required maxLength={120} placeholder="Ej. Diagnóstico de equipo" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <label>Equipo asociado<select name="equipmentId" required value={equipmentId} onChange={(event) => setEquipmentId(event.target.value)}><option value="" disabled>Selecciona un equipo</option>{equipment.map((item) => <option key={item._id} value={item._id}>{item.assetTag} · {item.name}</option>)}</select></label>
    <DictableTextarea label="Descripción del problema" name="description" rows={3} maxLength={2000} placeholder="Describe brevemente el trabajo solicitado" value={description} onValueChange={setDescription} transcribe={transcribe} onDictationError={onNotice} />
    <DictationConflicts conflicts={text.conflicts} onAccept={text.acceptProposal} onKeep={text.keepManual} />
    {equipment.length === 0 && <div className="form-warning"><Laptop size={16} /> Primero registra un equipo para poder asociarlo a una tarea.</div>}
    <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancelar</button><button type="submit" className="primary-button" disabled={equipment.length === 0 || text.hasConflicts}><Plus size={16} /> Crear tarea</button></div>
  </form>
}
