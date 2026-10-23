import { WORDS, NEW_CHARS, toks, type Word } from './words'
import { solid, type Store } from './srs'
import { fade, recent, weighted, type Recent } from './recency'

export type Pick =
  | { kind: 'review' | 'drill'; word: Word }
  | { kind: 'new'; word: Word; chars: string[] }
  | { kind: 'idle' }

const byId = (id: string) => WORDS.find(w => w.kana === id)!

const KANA_TAU = 6
const NEW = 0.15

export function pick(s: Store, now: number): Pick {
  const r = recent(s.log)
  const due = Object.values(s.cards).filter(c => c.due <= now).sort((a, b) => a.due - b.due)
  const c = due.find(c => Math.random() < fade(r.ids.get(c.id)))
  if (c) return { kind: 'review', word: byId(c.id) }
  const fresh = WORDS.find(w => !s.cards[w.kana])
  const k = weakKana(s, r, fresh ? NEW : 0)
  if (k) return { kind: 'drill', word: drillWord(s, r, k) }
  if (!fresh) return due.length ? { kind: 'review', word: byId(due[0].id) } : { kind: 'idle' }
  return { kind: 'new', word: fresh, chars: NEW_CHARS.get(fresh.kana)!.filter(c => !s.kana[c]) }
}

function weakKana(s: Store, r: Recent, newWeight: number): string | null {
  const known = [...new Set(WORDS.filter(w => s.cards[w.kana]).flatMap(w => toks(w).map(t => t.kana)))]
  const weak = known.filter(k => !solid(s.kana[k]))
  const k = weighted([...weak, null], k => k === null ? newWeight : fade(r.kana.get(k), KANA_TAU) / Math.sqrt(1 + (s.kana[k]?.n ?? 0)))
  return k ?? null
}

function drillWord(s: Store, r: Recent, k: string): Word {
  const learned = WORDS.filter(w => s.cards[w.kana])
  const options: Word[] = Math.random() < 1 / 3 && learned.length > 2
    ? learned
    : [...learned.filter(w => toks(w).some(t => t.kana === k)), { kana: k, en: '' }]
  return weighted(options, w => fade(r.ids.get(w.kana)) * Math.min(...toks(w).map(t => fade(r.kana.get(t.kana), KANA_TAU)), 1) + 1e-6)!
}
