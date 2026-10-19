import { tokenize } from './kana'
import { WORDS } from './words'
import type { LogEntry } from './srs'

// retypes and pre-v2 entries (no miss info) don't count as reads
const scored = (e: LogEntry) => e.kind !== 'retype' && e.miss !== undefined

export const wordHistory = (log: LogEntry[], id: string) => log.filter(e => scored(e) && e.id === id).map(e => e.ok)

export function kanaHistory(log: LogEntry[], k: string): boolean[] {
  const out: boolean[] = []
  for (const e of log) {
    if (!scored(e) || !e.id.includes(k[0])) continue
    tokenize(e.id, WORDS.find(w => w.kana === e.id)?.read).forEach((x, i) => {
      if (x.kana === k) out.push(!e.miss!.includes(i))
    })
  }
  return out
}

/** Oldest → newest, green = read right, red = misread. */
export function Dots({ hist, max = 30 }: { hist: boolean[]; max?: number }) {
  return (
    <span className="dots">
      {hist.slice(-max).map((ok, i) => <i key={i} className={ok ? 'ok' : 'no'} />)}
    </span>
  )
}
