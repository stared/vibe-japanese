import { expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { GRID } from './kana'
import { LOOK_ALIKES, MNEMONICS, comparison } from './mnemonics'
import { KanaPic, Hook } from './pics'

test('the set covers exactly the 46 base kana, and every cue has a sound anchor', () => {
  const base = GRID.flatMap(r => [...r.cells].filter(k => k !== '・'))
  expect(Object.keys(MNEMONICS).sort()).toEqual(base.sort())
  for (const [k, m] of Object.entries(MNEMONICS)) {
    expect(m.hook, k).toMatch(/\*\*[^*]+\*\*/)
    expect(m.hook.split('**').length % 2, k).toBe(1)
    expect(m.feature.length, k).toBeGreaterThan(0)
    for (const [x, y, w, h] of m.focus) {
      expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 100 && y + h <= 100, k).toBe(true)
    }
  }
})

test('reviewed comparisons resolve real, distinct kana and work in both directions', () => {
  for (const g of LOOK_ALIKES) {
    const chars = [...g.kana]
    expect(new Set(chars).size).toBe(chars.length)
    for (const a of chars) for (const b of chars) {
      expect(MNEMONICS[a], a).toBeDefined()
      if (a === b) expect(comparison(a, b)).toBeNull()
      else {
        expect(comparison(a, b)).toContain(MNEMONICS[a].feature)
        expect(comparison(b, a)).toContain(MNEMONICS[b].feature)
      }
    }
  }
  expect(comparison('が', 'か')).toBeNull()
  expect(comparison('あ', 'へ')).toBeNull()
})

test('plain mode reveals no highlight, and duplicate kana get independent clipping IDs', () => {
  const plain = renderToStaticMarkup(<KanaPic k="ね" plain />)
  expect(plain).not.toContain('clipPath')
  expect(plain).toContain('>ね</text>')
  const repeated = renderToStaticMarkup(<><KanaPic k="ね" /><KanaPic k="ね" /></>)
  const ids = [...repeated.matchAll(/<clipPath id="([^"]+)"/g)].map(m => m[1])
  expect(ids).toHaveLength(2)
  expect(new Set(ids).size).toBe(2)
  for (const id of ids) expect(repeated).toContain(`url(#${id})`)
  expect(renderToStaticMarkup(<Hook k="が" />)).toBe('')
  expect(renderToStaticMarkup(<KanaPic k="が" />)).toContain('>が</text>')
})
