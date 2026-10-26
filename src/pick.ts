import { WORDS, NEW_CHARS, toks, type Word } from './words'
import type { Store } from './srs'
import { fade, recent, weighted } from './recency'

export type Pick =
  | { kind: 'review' | 'drill'; word: Word }
  | { kind: 'new'; word: Word; chars: string[] }
  | { kind: 'idle' }

const T = 0.6
const ID_TAU = 4
const KANA_TAU = 2
const FAILED = 3
const DUE = 0.5
const NEW_MAX = 0.4
const ACC_WINDOW = 8
const LEARNING = 30
const KANA_ONLY = 0.25

export function pick(s: Store, now: number): Pick {
  const r = recent(s.log)
  const log = s.log.filter(e => e.kind !== 'retype')
  const weak = (k: string) => 1 - (s.kana[k]?.ema ?? 0.5)
  const fresh = (w: Word) => fade(r.ids.get(w.kana), ID_TAU) * Math.min(1, ...toks(w).map(t => fade(r.kana.get(t.kana), KANA_TAU)))
  const failed = (id: string) => (log.findLast(e => e.id === id)?.ok === false ? FAILED : 0)
  const learned = WORDS.filter(w => s.cards[w.kana])
  const learning = learned.filter(w => s.cards[w.kana].ivl === 0).length
  const next = WORDS.find(w => !s.cards[w.kana])
  const intro = next && { kind: 'new' as const, word: next, chars: NEW_CHARS.get(next.kana)!.filter(c => !s.kana[c]) }

  const lately = log.slice(-ACC_WINDOW)
  const acc = lately.length ? lately.filter(e => e.ok).length / lately.length : 1
  if (intro && (!learned.length || Math.random() < NEW_MAX * acc ** 3 * Math.exp(-learning / LEARNING))) return intro

  type Option = { word: Word; kind: 'review' | 'drill'; w: number }
  const options: Option[] = learned.map(w => {
    const due = s.cards[w.kana].due <= now
    const score = failed(w.kana) + (due ? DUE : 0) + Math.max(...toks(w).map(t => weak(t.kana)))
    return { word: w, kind: due ? 'review' : 'drill', w: Math.exp(score / T) * fresh(w) }
  })
  for (const k of new Set(learned.flatMap(w => toks(w).map(t => t.kana)))) {
    if (weak(k) <= 0.3) continue
    const word = { kana: k, en: '' }
    options.push({ word, kind: 'drill', w: KANA_ONLY * Math.exp((failed(k) + weak(k)) / T) * fresh(word) })
  }
  return weighted(options, o => o.w) ?? intro ?? { kind: 'idle' }
}
