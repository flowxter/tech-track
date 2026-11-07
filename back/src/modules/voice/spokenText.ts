const ACCENT_VARIANTS: Record<string, string> = { a: '[aá]', e: '[eé]', i: '[ií]', o: '[oó]', u: '[uúü]', n: '[nñ]' }
const SPOKEN_DIGITS: Record<string, string> = { cero: '0', uno: '1', dos: '2', tres: '3', cuatro: '4', cinco: '5', seis: '6', siete: '7', ocho: '8', nueve: '9' }

export type SpokenSections<K extends string> = { sections: Partial<Record<K, string>>; unlabeled: string }

/** Minúsculas y sin acentos, para comparar lo dictado con los datos guardados. */
export function normalizeSpoken(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function cleanSection(text: string) {
  const cleaned = text.replace(/^[\s,;:.-]+|[\s,;:-]+$/g, '')
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

/**
 * Reconoce una palabra clave solo al inicio de una frase, para no confundir
 * "como resultado de..." con el inicio de la sección "resultado".
 */
function sectionPattern(aliases: string[]) {
  const alternatives = [...aliases]
    .sort((first, second) => second.length - first.length)
    .map((alias) => alias.replace(/[aeioun]/g, (letter) => ACCENT_VARIANTS[letter]).replace(/ /g, '\\s+'))
    .join('|')
  return new RegExp(`(?:^|(?<=[.?!;:,\\n]\\s*))(?:(?:el|la|los|las|mi|mis)\\s+)?(?:${alternatives})(?:\\s+(?:es|era|fue|son|eran|fueron)(?:\\s+que)?)?(?:\\s*[:.,;-]+\\s*|\\s+|$)`, 'giu')
}

/**
 * Divide un dictado en secciones introducidas por palabras clave habladas.
 * @param markers Palabras clave por sección, en minúsculas y sin acentos.
 * @returns Secciones encontradas y el texto previo a la primera palabra clave.
 */
export function splitSpokenSections<K extends string>(text: string, markers: Record<K, string[]>): SpokenSections<K> {
  const found = (Object.entries(markers) as [K, string[]][])
    .flatMap(([key, aliases]) => [...text.matchAll(sectionPattern(aliases))].map((match) => ({ key, start: match.index, end: match.index + match[0].length })))
    .sort((first, second) => first.start - second.start)

  const sections: Partial<Record<K, string>> = {}
  found.forEach(({ key, end }, index) => {
    const content = cleanSection(text.slice(end, found[index + 1]?.start ?? text.length))
    if (content) sections[key] = sections[key] ? `${sections[key]} ${content}` : content
  })
  return { sections, unlabeled: cleanSection(text.slice(0, found[0]?.start ?? text.length)) }
}

/**
 * Patrón que encuentra un identificador aunque se dicte separado ("PC 001") o
 * con guiones ("PC-001"), sin aceptar coincidencias parciales como "PC-0010".
 */
function spokenTermPattern(term: string) {
  const characters = normalizeSpoken(term).replace(/[^a-z0-9]/g, '')
  return characters ? new RegExp(`(?<![a-z0-9])${[...characters].join('[^a-z0-9]*')}(?![a-z0-9])`) : null
}

/** Convierte "pc cero cero uno" en "pc 0 0 1" para poder compararlo con un identificador. */
function withSpokenDigits(text: string) {
  return normalizeSpoken(text).replace(/\p{L}+/gu, (word) => SPOKEN_DIGITS[word] ?? word)
}

/** Indica si el dictado menciona el término, tolerando acentos, separadores y dígitos en palabras. */
export function mentionsTerm(text: string, term: string) {
  return spokenTermPattern(term)?.test(withSpokenDigits(text)) ?? false
}
