import type { DictatedField } from './useDictatedFields'

type Props = {
  conflicts: { name: DictatedField; label: string; proposals: string[] }[]
  onAccept: (name: DictatedField, proposed: string) => void
  onKeep: (name: DictatedField) => void
}

/** Mantiene visibles las alternativas hasta que la persona elige qué guardar. */
export function DictationConflicts({ conflicts, onAccept, onKeep }: Props) {
  if (!conflicts.length) return null
  return <aside className="form-warning dictation-conflicts" role="alert">
    <p>El nuevo dictado tiene conflictos con tus cambios manuales. Se conservaron tus textos. Resuelve cada conflicto antes de guardar.</p>
    {conflicts.map(({ name, label, proposals }) => <section key={name}>
      <strong>Nuevo dictado para {label}</strong>
      {proposals.map((proposed) => <div key={proposed}>
        <p className="dictation-proposal">{proposed}</p>
        <button type="button" className="secondary-button" onClick={() => onAccept(name, proposed)}>Usar este dictado como {label}</button>
      </div>)}
      <button type="button" className="secondary-button" onClick={() => onKeep(name)}>Conservar mi {label}</button>
    </section>)}
  </aside>
}
