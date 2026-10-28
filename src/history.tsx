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

export const G = 0.6

export function pWrong(hist: boolean[]): number {
  let miss = 0, n = 0, w = 1
  for (let i = hist.length - 1; i >= 0; i--, w *= G) {
    n += w
    if (!hist[i]) miss += w
  }
  return (miss + 1) / (n + 2)
}

export function Dots({ hist, max = 30 }: { hist: boolean[]; max?: number }) {
  return (
    <span className="dots">
      {hist.slice(-max).map((ok, i) => <i key={i} className={ok ? 'ok' : 'no'} />)}
    </span>
  )
}
