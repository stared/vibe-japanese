import { expect, test } from 'vitest'
import { fade, recent, weighted } from './recency'
import type { LogEntry } from './srs'

test('recent counts answers back, skipping retypes, and tracks kana inside words', () => {
  const e = (id: string, kind: LogEntry['kind'] = 'drill'): LogEntry => ({ t: 0, id, ok: true, kind })
  const r = recent([e('か'), e('き'), e('すし', 'review'), e('すし', 'retype')])
  expect(r.ids.get('すし')).toBe(1)
  expect(r.kana.get('し')).toBe(1)
  expect(r.ids.get('き')).toBe(2)
  expect(r.kana.get('か')).toBe(3)
  expect(fade(r.ids.get('すし'))).toBe(0)
  expect(fade(undefined)).toBe(1)
})

test('weighted never returns a zero-weight item, and gives up when all are zero', () => {
  for (let i = 0; i < 1000; i++) expect(weighted(['a', 'b', 'c'], x => (x === 'b' ? 0 : 1))).not.toBe('b')
  expect(weighted(['a'], () => 0)).toBeUndefined()
})
