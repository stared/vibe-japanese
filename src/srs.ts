import type { Tok } from './kana'

export const MIN = 60_000
export const DAY = 86_400_000
const STEPS = [1, 10] // learning steps, minutes

export type Card = { id: string; due: number; step: number; ivl: number; ease: number; reps: number; lapses: number }
export type KStat = { n: number; ema: number }
export type Store = {
  cards: Record<string, Card>
  kana: Record<string, KStat>
  log: { t: number; id: string; ok: boolean }[]
}

const KEY = 'vibe-japanese/v1'

export function load(): Store {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '')
    if (s?.cards) return s
  } catch {}
  return { cards: {}, kana: {}, log: [] }
}

export const save = (s: Store) => localStorage.setItem(KEY, JSON.stringify(s))

export const newCard = (id: string, now: number): Card => ({ id, due: now, step: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0 })

export function schedule(c: Card, ok: boolean, now: number): Card {
  if (!ok) return { ...c, step: 0, ivl: 0, ease: Math.max(1.3, c.ease - 0.2), lapses: c.lapses + 1, reps: c.reps + 1, due: now + STEPS[0] * MIN }
  if (c.ivl === 0) {
    const step = c.step + 1
    if (step < STEPS.length) return { ...c, step, reps: c.reps + 1, due: now + STEPS[step] * MIN }
    return { ...c, step, ivl: 1, reps: c.reps + 1, due: now + DAY - 4 * 3600_000 }
  }
  const ivl = Math.max(c.ivl + 1, Math.round(c.ivl * c.ease))
  return { ...c, ivl, reps: c.reps + 1, due: now + ivl * DAY - 4 * 3600_000 }
}

function updateKana(kana: Store['kana'], toks: Tok[], wrong: number[]) {
  const out = { ...kana }
  const bump = (k: string, hit: boolean) => {
    const s = out[k] ?? { n: 0, ema: 0.5 }
    out[k] = { n: s.n + 1, ema: s.ema * 0.7 + (hit ? 0.3 : 0) }
  }
  toks.forEach((t, i) => {
    const hit = !wrong.includes(i)
    bump(t.kana, hit)
    if (t.gem) bump('っ', hit)
  })
  return out
}

export function answer(s: Store, id: string, toks: Tok[], wrong: number[], now: number): Store {
  const ok = wrong.length === 0
  return {
    cards: { ...s.cards, [id]: schedule(s.cards[id], ok, now) },
    kana: updateKana(s.kana, toks, wrong),
    log: [...s.log, { t: now, id, ok }],
  }
}
