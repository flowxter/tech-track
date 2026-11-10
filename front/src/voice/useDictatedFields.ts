import { useCallback, useState, type SetStateAction } from 'react'

type FieldState = { value: string; edited: boolean; proposals: string[] }
export type DictatedField = 'title' | 'description'
type TextDraft = Record<DictatedField, string>
const fieldNames: DictatedField[] = ['title', 'description']
const labels: Record<DictatedField, string> = { title: 'título', description: 'descripción' }
const emptyFields = (): Record<DictatedField, FieldState> => ({
  title: { value: '', edited: false, proposals: [] },
  description: { value: '', edited: false, proposals: [] },
})

/** El dictado reemplaza su texto anterior; las ediciones de la persona requieren una decisión explícita. */
export function useDictatedFields() {
  const [fields, setFields] = useState(emptyFields)
  const edit = useCallback((name: DictatedField, update: SetStateAction<string>) => {
    setFields((current) => ({ ...current, [name]: {
      ...current[name],
      value: typeof update === 'function' ? update(current[name].value) : update,
      edited: true,
    } }))
  }, [])

  const applyDictation = useCallback((draft: TextDraft) => {
    setFields((current) => {
      const next = { ...current }
      for (const name of fieldNames) {
        const proposed = draft[name]
        // Un campo no reconocido no borra lo que ya se había escrito o dictado.
        if (!proposed) continue
        const field = current[name]
        if (!field.edited) next[name] = { value: proposed, edited: false, proposals: [] }
        else if (proposed !== field.value && !field.proposals.includes(proposed)) {
          next[name] = { ...field, proposals: [...field.proposals, proposed] }
        }
      }
      return next
    })
  }, [])

  const acceptProposal = useCallback((name: DictatedField, proposed: string) => {
    setFields((current) => current[name].proposals.includes(proposed)
      ? { ...current, [name]: { value: proposed, edited: false, proposals: [] } }
      : current)
  }, [])
  const keepManual = useCallback((name: DictatedField) => {
    setFields((current) => ({ ...current, [name]: { ...current[name], proposals: [] } }))
  }, [])
  const reset = useCallback(() => setFields(emptyFields()), [])
  const conflicts = fieldNames.filter((name) => fields[name].proposals.length > 0)
    .map((name) => ({ name, label: labels[name], proposals: fields[name].proposals }))

  return {
    title: fields.title.value,
    description: fields.description.value,
    setTitle: (update: SetStateAction<string>) => edit('title', update),
    setDescription: (update: SetStateAction<string>) => edit('description', update),
    applyDictation, conflicts, acceptProposal, keepManual, reset,
    hasConflicts: conflicts.length > 0,
  }
}
