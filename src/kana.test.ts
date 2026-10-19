import { expect, test } from 'vitest'
import { display, match, normalize, tokenize, BASE } from './kana'
import { WORDS, NEW_CHARS, toks } from './words'

test('every word accepts its own Polish and Hepburn reading', () => {
  for (const w of WORDS) {
    const t = toks(w)
    expect(match(t, normalize(display(t, true))).ok, `${w.kana} pl ${display(t)}`).toBe(true)
    expect(match(t, normalize(display(t, false))).ok, `${w.kana} hep ${display(t, false)}`).toBe(true)
  }
})

test('variants', () => {
  const ok = (k: string, s: string) => match(tokenize(k), normalize(s)).ok
  expect(ok('とうきょう', 'toukiou')).toBe(true)
  expect(ok('とうきょう', 'Tōkyō')).toBe(true)
  expect(ok('とうきょう', 'tokio')).toBe(true)
  expect(ok('じんじゃ', 'jinja')).toBe(true)
  expect(ok('まっちゃ', 'matcha')).toBe(true)
  expect(ok('まっちゃ', 'maccia')).toBe(true)
  expect(ok('さんぽ', 'sampo')).toBe(true)
  expect(ok('さんぽ', 'sanpo')).toBe(true)
  expect(ok('すし', 'sushi')).toBe(true)
  expect(ok('すし', 'susa')).toBe(false)
  expect(match(tokenize('さくら'), 'sakira').blame).toBe(1)
})

test('curriculum covers all base and voiced kana', () => {
  const all = new Set(WORDS.flatMap(w => [...w.kana]))
  const missing = Object.keys(BASE).filter(k => !all.has(k))
  expect(missing).toEqual([])
  for (const w of WORDS) expect(NEW_CHARS.get(w.kana)!.length, w.kana).toBeLessThanOrEqual(3)
})
