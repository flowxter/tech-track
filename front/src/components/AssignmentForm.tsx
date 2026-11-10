import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { AdminEquipment, User, VoiceTaskDraft } from '../types'
import { DictableTextarea } from '../voice/DictableTextarea'
import { DictationButton } from '../voice/DictationButton'
import { DictationConflicts } from '../voice/DictationConflicts'
import { useDictatedFields } from '../voice/useDictatedFields'

export type AssignmentData = { title: string; description: string; technicianId: string; equipmentId: string }

type AssignmentFormProps = {
  technicians: User[]
  equipment: AdminEquipment[]
  technicianId: string
  onTechnicianChange: (technicianId: string) => void
  dictateDraft: (audio: Blob) => Promise<VoiceTaskDraft>
  transcribe: (audio: Blob) => Promise<string>
  /** Devuelve `true` si la tarea quedó asignada, para limpiar el formulario. */
  onAssign: (data: AssignmentData) => Promise<boolean>
  onNotice: (message: string) => void
}

/** Asignación administrativa de tareas, escrita o dictada: «Asignar a Ana. Equipo PC-001. Título: ...». */
export function AssignmentForm({ technicians, equipment, technicianId, onTechnicianChange, dictateDraft, transcribe, onAssign, onNotice }: AssignmentFormProps) {
  const [equipmentId, setEquipmentId] = useState('')
  const text = useDictatedFields()
  const { title, setTitle, description, setDescription } = text
  const technicianEquipment = equipment.filter((item) => item.owner === technicianId)

  function changeTechnician(next: string) {
    onTechnicianChange(next)
    setEquipmentId('')
  }

  function applyDraft({ draft }: VoiceTaskDraft) {
    const nextTechnician = technicians.find(({ _id }) => _id === draft.technicianId)?._id ?? ''
    const nextEquipment = equipment.find(({ _id, owner }) => _id === draft.equipmentId && owner === nextTechnician)?._id ?? ''
    changeTechnician(nextTechnician)
    setEquipmentId(nextEquipment)
    text.applyDictation(draft)
    onNotice(nextTechnician && nextEquipment ? 'Revisa la asignación actualizada. Los conflictos con cambios manuales se muestran en el formulario.' : 'Selecciona manualmente el técnico y el equipo pendientes. Revisa el texto y los posibles conflictos en el formulario.')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (text.hasConflicts) return
    const assigned = await onAssign({ title: title.trim(), description: description.trim(), technicianId, equipmentId })
    if (!assigned) return
    setEquipmentId('')
    text.reset()
  }

  return <form className="admin-assignment-form" onSubmit={(event) => void handleSubmit(event)}>
    <div className="voice-draft">
      <DictationButton label="Dictar asignación completa" disabled={technicians.length === 0} process={dictateDraft} onResult={applyDraft} onError={onNotice}>Dictar asignación</DictationButton>
      <span>Ej.: «Asignar a Ana. Equipo PC-001. Título: mantenimiento preventivo.»</span>
    </div>
    <div className="form-grid">
      <label>Técnico<select name="technicianId" value={technicianId} required onChange={(event) => changeTechnician(event.target.value)}><option value="" disabled>Selecciona un técnico</option>{technicians.map((technician) => <option key={technician._id} value={technician._id}>{technician.name} · {technician.email}</option>)}</select></label>
      <label>Equipo asignado<select name="equipmentId" required value={equipmentId} onChange={(event) => setEquipmentId(event.target.value)}><option value="" disabled>Selecciona un equipo</option>{technicianEquipment.map((item) => <option key={item._id} value={item._id}>{item.assetTag} · {item.name}</option>)}</select></label>
    </div>
    <label>Título de la tarea<input name="title" required maxLength={120} placeholder="Ej. Mantenimiento preventivo" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <DictableTextarea label="Descripción inicial" name="description" rows={2} maxLength={2000} placeholder="Describe el trabajo solicitado" value={description} onValueChange={setDescription} transcribe={transcribe} onDictationError={onNotice} />
    <DictationConflicts conflicts={text.conflicts} onAccept={text.acceptProposal} onKeep={text.keepManual} />
    <div className="dialog-actions"><span className="assignment-hint">{technicians.length === 0 ? 'No hay técnicos registrados.' : technicianEquipment.length === 0 ? 'El técnico seleccionado aún no tiene equipos.' : 'El técnico podrá documentar y actualizar su tarea.'}</span><button type="submit" className="primary-button" disabled={technicianEquipment.length === 0 || text.hasConflicts}><Plus size={15} /> Asignar tarea</button></div>
  </form>
}
