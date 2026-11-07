import { splitSpokenSections } from './spokenText'

// Incluye nombres de campo y las frases con que un técnico narra de forma natural su intervención.
const DOCUMENTATION_MARKERS = {
  problemReported: ['problema reportado', 'problema', 'falla reportada', 'falla'],
  diagnosis: ['diagnostico', 'encontre', 'se encontro', 'detecte', 'se detecto'],
  activities: ['actividades realizadas', 'actividades', 'acciones realizadas', 'acciones', 'hice', 'realice', 'se realizo'],
  result: ['resultado', 'como resultado', 'al final'],
  recommendations: ['recomendaciones', 'recomendacion', 'observaciones', 'observacion', 'recomiendo', 'se recomienda'],
}

export type DocumentationSections = Partial<Record<keyof typeof DOCUMENTATION_MARKERS, string>>

/**
 * Reparte un informe dictado de corrido entre los campos de la documentación.
 * Lo que no se atribuye a una sección pasa a actividades, para no perder lo dictado.
 */
export function parseDocumentationDictation(transcript: string): DocumentationSections {
  const { sections, unlabeled } = splitSpokenSections(transcript, DOCUMENTATION_MARKERS)
  if (!unlabeled) return sections
  return { ...sections, activities: [unlabeled, sections.activities].filter(Boolean).join(' ') }
}
