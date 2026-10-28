import { WORDS, NEW_CHARS, toks, type Word } from './words'
import type { Store } from './srs'
import { kanaHistories, pWrong } from './history'
import { fade, recent, weighted } from './recency'

export type Pick =
  | { kind: 'review' | 'drill'; word: Word }
  | { kind: 'new'; word: Word; chars: string[] }
  | { kind: 'idle' }

export const T = 0.3

export const boltzmann = (score: number) => Math.exp(score / T)

export function pick(s: Store, now: number): Pick {
  const hists = kanaHistories(s.log)
  const r = recent(s.log)
  const pWord = (w: Word) => 1 - toks(w).reduce((a, t) => a * (1 - pWrong(hists.get(t.kana) ?? [])), 1)

  type Item = { word: Word; kind: Pick['kind']; x: number }
  const learned = WORDS.filter(w => s.cards[w.kana])
  const items: Item[] = learned.map(w => ({
    word: w,
    kind: s.cards[w.kana].due <= now ? 'review' : 'drill',
    x: boltzmann(Math.log(pWord(w)) + Math.log(fade(Math.min(r.ids.get(w.kana) ?? Infinity, ...toks(w).map(t => r.kana.get(t.kana) ?? Infinity))))),
  }))
  const next = WORDS.find(w => !s.cards[w.kana])
  const right = s.log.filter(e => e.kind !== 'retype').map(e => e.ok)
  if (next) items.push({ word: next, kind: 'new', x: learned.length ? boltzmann(Math.log(1 - pWrong(right))) : 1 })

  const it = weighted(items, x => x.x)
  if (!it) return { kind: 'idle' }
  if (it.kind === 'new') return { kind: 'new', word: it.word, chars: NEW_CHARS.get(it.word.kana)!.filter(c => !s.kana[c]) }
  return { kind: it.kind as 'review' | 'drill', word: it.word }
}
