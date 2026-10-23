import { WORDS, NEW_CHARS, toks, type Word } from './words'
import type { Store } from './srs'
import { fade, recent, weighted } from './recency'

export type Pick =
  | { kind: 'review' | 'drill'; word: Word }
  | { kind: 'new'; word: Word; chars: string[] }
  | { kind: 'idle' }

const T = 0.6
const ID_TAU = 8
const KANA_TAU = 2
const NEW = 2
const LEARNING = 30
const KANA_ONLY = 0.25

export function pick(s: Store, now: number): Pick {
  const r = recent(s.log)
  const weak = (k: string) => 1 - (s.kana[k]?.ema ?? 0.5)
  const fresh = (w: Word) => fade(r.ids.get(w.kana), ID_TAU) * Math.min(1, ...toks(w).map(t => fade(r.kana.get(t.kana), KANA_TAU)))
  const learned = WORDS.filter(w => s.cards[w.kana])
  const learning = learned.filter(w => s.cards[w.kana].ivl === 0).length
  const next = WORDS.find(w => !s.cards[w.kana])
  const weakKana = [...new Set(learned.flatMap(w => toks(w).map(t => t.kana)))].filter(k => weak(k) > 0.3)

  type Option = { word: Word; kind: Pick['kind']; w: number }
  const options: Option[] = learned.map(w => {
    const due = s.cards[w.kana].due <= now
    const score = (due ? 1 : 0) + Math.max(...toks(w).map(t => weak(t.kana)))
    return { word: w, kind: due ? 'review' : 'drill', w: Math.exp(score / T) * fresh(w) }
  })
  for (const k of weakKana) {
    const word = { kana: k, en: '' }
    options.push({ word, kind: 'drill', w: KANA_ONLY * Math.exp(weak(k) / T) * fresh(word) })
  }
  if (next) options.push({ word: next, kind: 'new', w: NEW * Math.exp(1 / T) * Math.exp(-learning / LEARNING) })

  const o = weighted(options, o => o.w)
  if (!o) return { kind: 'idle' }
  if (o.kind === 'new') return { kind: 'new', word: o.word, chars: NEW_CHARS.get(o.word.kana)!.filter(c => !s.kana[c]) }
  return { kind: o.kind as 'review' | 'drill', word: o.word }
}
