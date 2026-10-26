import { WORDS, NEW_CHARS, toks, type Word } from './words'
import type { Store } from './srs'
import { recent, weighted } from './recency'

export type Pick =
  | { kind: 'review' | 'drill'; word: Word }
  | { kind: 'new'; word: Word; chars: string[] }
  | { kind: 'idle' }

export const T = 0.6
export const E = {
  failed: -3,
  due: -0.5,
  weak: -1,
  seen: 2,
  seenTau: 3,
  kanaSeen: 2,
  kanaSeenTau: 2,
  kanaOnly: 3,
  fresh: -3,
  miss: 4,
  learning: 1 / 15,
}
const ACC_WINDOW = 8

const echo = (ago: number | undefined, tau: number) => ago === undefined ? 0 : ago <= 1 ? Infinity : Math.exp(-(ago - 1) / tau)

export function pick(s: Store, now: number): Pick {
  const r = recent(s.log)
  const log = s.log.filter(e => e.kind !== 'retype')
  const weak = (k: string) => 1 - (s.kana[k]?.ema ?? 0.5)
  const failed = (id: string) => log.findLast(e => e.id === id)?.ok === false
  const energy = (w: Word) =>
    (failed(w.kana) ? E.failed : 0)
    + E.weak * Math.max(...toks(w).map(t => weak(t.kana)))
    + E.seen * echo(r.ids.get(w.kana), E.seenTau)
    + E.kanaSeen * Math.max(...toks(w).map(t => echo(r.kana.get(t.kana), E.kanaSeenTau)))

  const learned = WORDS.filter(w => s.cards[w.kana])
  const lately = log.slice(-ACC_WINDOW)
  const acc = lately.length ? lately.filter(e => e.ok).length / lately.length : 1
  const learning = learned.filter(w => s.cards[w.kana].ivl === 0).length

  type State = { word: Word; kind: Pick['kind']; e: number }
  const states: State[] = learned.map(w => {
    const due = s.cards[w.kana].due <= now
    return { word: w, kind: due ? 'review' : 'drill', e: energy(w) + (due ? E.due : 0) }
  })
  for (const k of new Set(learned.flatMap(w => toks(w).map(t => t.kana)))) {
    const word = { kana: k, en: '' }
    states.push({ word, kind: 'drill', e: E.kanaOnly + energy(word) })
  }
  const next = WORDS.find(w => !s.cards[w.kana])
  if (next) states.push({ word: next, kind: 'new', e: learned.length ? E.fresh + E.miss * (1 - acc) + E.learning * learning : -Infinity })

  const st = weighted(states, x => Math.exp(-x.e / T))
  if (!st) return { kind: 'idle' }
  if (st.kind === 'new') return { kind: 'new', word: st.word, chars: NEW_CHARS.get(st.word.kana)!.filter(c => !s.kana[c]) }
  return { kind: st.kind as 'review' | 'drill', word: st.word }
}
