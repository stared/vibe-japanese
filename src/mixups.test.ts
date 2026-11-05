import { expect, test } from 'vitest'
import { mixupGroups, mixups } from './Mixups'
import { layout } from './MixupGraph'
import type { LogEntry } from './srs'

const DAY = 86400000
const ago = (d: number) => Date.now() - d * DAY

const log: LogEntry[] = [
  { t: ago(1), id: 'な', ok: false, typed: 'ta', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'な', ok: true, typed: 'na', kind: 'retype' },
  { t: ago(1), id: 'てら', ok: false, typed: 'tora', miss: [0], kind: 'review' },
  { t: ago(1), id: 'な', ok: false, typed: 'ta', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'た', ok: false, typed: 'na', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'ク', ok: false, typed: 'ke', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'ヒ', ok: false, typed: '?', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'と', ok: false, typed: 'na', miss: [0], kind: 'drill' },
  { t: ago(1), id: 'ことば', ok: false, typed: 'kotoga', miss: [2], kind: 'new' },
]

test('mixups pairs kana with what they were typed as, most mixed first', () => {
  expect(mixups(log).map(p => [p.a, p.b, p.n])).toEqual([
    ['な', 'た', 3],
    ['て', 'と', 1],
    ['ク', 'ケ', 1],
    ['と', 'な', 1],
    ['ば', 'が', 1],
  ])
})

test('an old slip counts for less than a recent one', () => {
  const l: LogEntry[] = [
    { t: ago(21), id: 'な', ok: false, typed: 'ta', miss: [0], kind: 'drill' },
    { t: Date.now(), id: 'て', ok: false, typed: 'to', miss: [0], kind: 'drill' },
  ]
  expect(mixups(l).map(p => [p.a, p.b, p.n])).toEqual([['て', 'と', 1], ['な', 'た', 1]])
})

test('groups share a kana but stop at five, so a kana can be in two groups', () => {
  const l: LogEntry[] = [
    { t: ago(1), id: 'な', ok: false, typed: 'ta', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'た', ok: false, typed: 'to', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'と', ok: false, typed: 'te', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'て', ok: false, typed: 'tu', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'つ', ok: false, typed: 'nu', miss: [0], kind: 'drill' },
  ]
  expect(mixupGroups(l).map(g => g.kana)).toEqual([['た', 'と', 'て', 'な', 'つ'], ['つ', 'ぬ']])
})

test('mixupGroups keeps scripts apart and skips typos, retypes and unreadable input', () => {
  const g = mixupGroups(log)
  expect(g[0].kana).toEqual(['な', 'た', 'と', 'て'])
  expect(g[0].pairs.reduce((s, p) => s + p.n, 0)).toBe(5)
  expect(g[1].kana).toEqual(['ク', 'ケ'])
  expect(g[2].kana).toEqual(['ば', 'が'])
  for (const x of g) expect(x.kana.length).toBeLessThanOrEqual(5)
})

test('layout pulls mixed-up kana together and keeps them in the frame', () => {
  const pairs = mixups([
    { t: ago(1), id: 'な', ok: false, typed: 'ta', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'ク', ok: false, typed: 'ke', miss: [0], kind: 'drill' },
    { t: ago(1), id: 'め', ok: false, typed: 'nu', miss: [0], kind: 'drill' },
  ])
  const nodes = [...new Set(pairs.flatMap(p => [p.a, p.b]))]
  const { pos, h } = layout(nodes, pairs)
  const d = (a: string, b: string) => Math.hypot(pos.get(a)!.x - pos.get(b)!.x, pos.get(a)!.y - pos.get(b)!.y)
  for (const q of pos.values()) {
    expect(q.x).toBeGreaterThanOrEqual(0); expect(q.x).toBeLessThanOrEqual(640)
    expect(q.y).toBeGreaterThanOrEqual(0); expect(q.y).toBeLessThanOrEqual(h)
  }
  expect(d('な', 'た')).toBeLessThan(d('な', 'ク'))
  expect(d('め', 'ぬ')).toBeLessThan(d('め', 'ケ'))
  expect(d('な', 'ク')).toBeGreaterThanOrEqual(84)
  for (const a of nodes) for (const b of nodes) if (a < b) expect(d(a, b)).toBeGreaterThanOrEqual(44)
})
