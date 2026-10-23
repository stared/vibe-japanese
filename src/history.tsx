import { tokenize } from './kana'
import { WORDS } from './words'
import type { LogEntry } from './srs'

const scored = (e: LogEntry) => e.kind !== 'retype' && (e.miss !== undefined || e.ok)

export const wordHistory = (log: LogEntry[], id: string) => log.filter(e => scored(e) && e.id === id).map(e => e.ok)

function toks(id: string) {
  try {
    return tokenize(id, WORDS.find(w => w.kana === id)?.read)
  } catch {
    return []
  }
}

export function kanaHistories(log: LogEntry[]): Map<string, boolean[]> {
  const m = new Map<string, boolean[]>()
  for (const e of log) {
    if (!scored(e)) continue
    const miss = e.miss ?? []
    toks(e.id).forEach((x, i) => {
      if (e.hint?.includes(i) && !miss.includes(i)) return
      if (!m.has(x.kana)) m.set(x.kana, [])
      m.get(x.kana)!.push(!miss.includes(i))
    })
  }
  return m
}

export function recentScore(hist: boolean[], decay = 0.8): number | null {
  if (!hist.length) return null
  let num = 0, den = 0, w = 1
  for (let i = hist.length - 1; i >= 0; i--, w *= decay) {
    num += w * (hist[i] ? 1 : 0)
    den += w
  }
  return num / den
}

export function Dots({ hist, max = 30 }: { hist: boolean[]; max?: number }) {
  return (
    <span className="dots">
      {hist.slice(-max).map((ok, i) => <i key={i} className={ok ? 'ok' : 'no'} />)}
    </span>
  )
}
