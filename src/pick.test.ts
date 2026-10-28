import { expect, test } from 'vitest'
import { pick } from './pick'
import { newCard, record, type Store } from './srs'
import { toks } from './words'

function session(n: number, err = 0, seconds = 8) {
  let s: Store = { cards: {}, kana: {}, log: [] }
  let now = Date.parse('2026-01-01')
  const seq: { id: string; kana: string[]; kind: string; ok: boolean }[] = []
  for (let i = 0; i < n; i++) {
    const p = pick(s, now)
    if (p.kind === 'idle') break
    const w = p.word, t = toks(w)
    if (p.kind === 'new') s = { ...s, cards: { ...s.cards, [w.kana]: newCard(w.kana, now) } }
    const ok = Math.random() >= err
    s = record(s, w.kana, t, ok ? [] : [0], now, { typed: '', kind: p.kind === 'drill' ? 'drill' : p.kind === 'new' ? 'new' : 'review' })
    seq.push({ id: w.kana, kana: t.map(x => x.kana), kind: p.kind, ok })
    now += seconds * 1000
  }
  return seq
}

type Step = ReturnType<typeof session>[number]
const near = (seq: Step[], key: (x: Step) => string[]) =>
  seq.filter((x, i) => i >= 2 && key(x).some(k => key(seq[i - 1]).includes(k) || key(seq[i - 2]).includes(k))).length / seq.length

test('study rarely asks the same thing again soon', () => {
  const runs = Array.from({ length: 30 }, () => session(300))
  const mean = (f: (seq: Step[]) => number) => runs.reduce((t, r) => t + f(r), 0) / runs.length
  expect(mean(r => near(r, x => [x.id]))).toBeLessThan(0.04)
  expect(mean(r => near(r, x => x.kana))).toBeLessThan(0.15)
})

test('study spreads over many words and keeps bringing new ones', () => {
  const runs = Array.from({ length: 20 }, () => session(200))
  const mean = (f: (seq: Step[]) => number) => runs.reduce((t, r) => t + f(r), 0) / runs.length
  const distinct = (seq: Step[]) => new Set(seq.slice(100, 130).map(x => x.id)).size
  expect(mean(distinct)).toBeGreaterThan(22)
  expect(mean(seq => seq.filter(x => x.kind === 'new').length)).toBeGreaterThan(35)
})

test('a missed kana comes back sooner than a known one', () => {
  const lags = Array.from({ length: 20 }, () => session(200, 0.15)).flatMap(seq =>
    seq.flatMap((x, i) => [{ ok: x.ok, lag: seq.findIndex((y, j) => j > i && y.kana.includes(x.kana[0])) - i }]))
  const soon = (ok: boolean) => { const l = lags.filter(x => x.ok === ok && x.lag > 0); return l.filter(x => x.lag <= 8).length / l.length }
  expect(soon(false)).toBeGreaterThan(1.3 * soon(true))
})
