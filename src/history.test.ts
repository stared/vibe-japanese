import { expect, test } from 'vitest'
import { kanaHistories } from './history'
import type { LogEntry } from './srs'

test('kana history counts rows drills, skips peeked kana, keeps old correct answers', () => {
  const log: LogEntry[] = [
    { t: 0, id: 'か', ok: true, miss: [], kind: 'drill' },
    { t: 1, id: 'か', ok: false, miss: [0], kind: 'drill' },
    { t: 2, id: 'やま', ok: true, miss: [], kind: 'review', hint: [1] },
    { t: 3, id: 'やま', ok: true },
    { t: 4, id: 'やま', ok: false },
  ]
  const h = kanaHistories(log)
  expect(h.get('か')).toEqual([true, false])
  expect(h.get('や')).toEqual([true, true])
  expect(h.get('ま')).toEqual([true])
})
