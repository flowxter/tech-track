/** Une lo dictado al texto existente, porque el dictado complementa lo escrito y nunca lo reemplaza. */
export function appendDictation(current: string, dictated: string, maxLength: number) {
  return (current.trim() ? `${current.trimEnd()}\n${dictated}` : dictated).slice(0, maxLength)
}
