import { tokenize } from './kana'
import { WORDS } from './words'
import type { LogEntry } from './srs'

// retypes and pre-v2 entries (no miss info) don't count as reads
const scored = (e: LogEntry) => e.kind !== 'retype' && e.miss !== undefined

export const wordHistory = (log: LogEntry[], id: string) => log.filter(e => scored(e) && e.id === id).map(e => e.ok)

/** Per-kana read history, oldest → newest. */
export function kanaHistories(log: LogEntry[]): Map<string, boolean[]> {
  const m = new Map<string, boolean[]>()
  for (const e of log) {
    if (!scored(e)) continue
    tokenize(e.id, WORDS.find(w => w.kana === e.id)?.read).forEach((x, i) => {
      if (!m.has(x.kana)) m.set(x.kana, [])
      m.get(x.kana)!.push(!e.miss!.includes(i))
    })
  }
  return m
}

/** Exponentially weighted success rate; the weight halves roughly every 3 reads (1/e at ~5). */
export function recentScore(hist: boolean[], decay = 0.8): number | null {
  if (!hist.length) return null
  let num = 0, den = 0, w = 1
  for (let i = hist.length - 1; i >= 0; i--, w *= decay) {
    num += w * (hist[i] ? 1 : 0)
    den += w
  }
  return num / den
}

/** Oldest → newest, green = read right, red = misread. */
export function Dots({ hist, max = 30 }: { hist: boolean[]; max?: number }) {
  return (
    <span className="dots">
      {hist.slice(-max).map((ok, i) => <i key={i} className={ok ? 'ok' : 'no'} />)}
    </span>
  )
}
