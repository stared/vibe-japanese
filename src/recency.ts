import type { LogEntry } from './srs'
import { WORDS, toks } from './words'

// Asking the same thing again right away tests short-term memory, not reading.
// Pickers weigh recent items down, softly: asked n answers ago, weight 1 - exp(-(n-1)/TAU),
// so 0 right after, then 0.28, 0.49, 0.63, 0.74... back towards 1.
const TAU = 3
const WINDOW = 15 // beyond this the weight is > 0.99: treat as never asked
export const fade = (ago?: number) => (ago === undefined ? 1 : 1 - Math.exp(-(ago - 1) / TAU))

const kanaOf = (id: string) => toks(WORDS.find(w => w.kana === id) ?? { kana: id, en: '' }).map(t => t.kana)

/** How many answers ago each id, and each kana, was last asked. */
export function recent(log: LogEntry[]) {
  const ids = new Map<string, number>()
  const kana = new Map<string, number>()
  let ago = 0
  for (let i = log.length - 1; i >= 0 && ago < WINDOW; i--) {
    if (log[i].kind === 'retype') continue
    ago++
    const id = log[i].id
    if (!ids.has(id)) ids.set(id, ago)
    for (const k of kanaOf(id)) if (!kana.has(k)) kana.set(k, ago)
  }
  return { ids, kana }
}
export type Recent = ReturnType<typeof recent>

/** Random item with probability proportional to its weight; undefined if all weigh 0. */
export function weighted<T>(items: T[], w: (x: T) => number): T | undefined {
  const ws = items.map(w)
  let r = Math.random() * ws.reduce((a, b) => a + b, 0)
  let hit: T | undefined
  for (let i = 0; i < items.length; i++) if (ws[i] > 0) { hit = items[i]; if ((r -= ws[i]) < 0) break }
  return hit
}
