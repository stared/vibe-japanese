import { useMemo, useState } from 'react'
import { align, isKata, misread, normalize, tokenize } from './kana'
import { WORDS } from './words'
import { kanaHistories, pWrong } from './history'
import { DAY, type LogEntry, type Store } from './srs'
import { RowSession } from './Rows'
import { MixupGraph } from './MixupGraph'

export type Mixup = { a: string; b: string; n: number; w: number }
export type MixupGroup = { kana: string[]; pairs: Mixup[] }
const MAX = 5
const MIXUP = 2

const toksOf = (id: string) => {
  try {
    return tokenize(id, WORDS.find(w => w.kana === id)?.read)
  } catch {
    return []
  }
}

const TAU = 21 * DAY

export function mixups(log: LogEntry[]): Mixup[] {
  const m = new Map<string, Mixup>()
  for (const e of log) {
    if (e.kind === 'retype' || e.typo || e.ok || !e.typed) continue
    const t = toksOf(e.id)
    if (!t.length) continue
    const segs = align(t, normalize(e.typed))
    const w = Math.exp(-(Date.now() - e.t) / TAU)
    t.forEach((x, i) => {
      if (segs[i].ok) return
      const c = misread(x, segs[i].text)
      if (!c) return
      const key = x.kana < c ? x.kana + c : c + x.kana
      const p = m.get(key) ?? { a: x.kana, b: c, n: 0, w: 0 }
      p.n++
      p.w += w
      m.set(key, p)
    })
  }
  return [...m.values()].sort((x, y) => y.w - x.w || y.n - x.n)
}

export function mixupGroups(log: LogEntry[]): MixupGroup[] {
  const pairs = mixups(log)
  const key = (p: Mixup) => p.a + p.b
  const used = new Set<string>()
  const groups: MixupGroup[] = []
  for (const seed of pairs) {
    if (used.has(key(seed))) continue
    const ps = [seed]
    const kana = new Set([seed.a, seed.b])
    used.add(key(seed))
    for (;;) {
      const next = pairs.find(p => !used.has(key(p)) && (kana.has(p.a) || kana.has(p.b)) &&
        kana.size + (kana.has(p.a) ? 0 : 1) + (kana.has(p.b) ? 0 : 1) <= MAX)
      if (!next) break
      ps.push(next)
      used.add(key(next))
      kana.add(next.a)
      kana.add(next.b)
    }
    const w = (k: string) => ps.reduce((s, p) => s + (p.a === k || p.b === k ? p.w : 0), 0)
    groups.push({ kana: [...kana].sort((x, y) => w(y) - w(x)), pairs: ps })
  }
  const top = (g: MixupGroup) => Math.max(...g.pairs.map(p => p.w))
  const sum = (g: MixupGroup) => g.pairs.reduce((s, p) => s + p.w, 0)
  return groups.sort((x, y) => top(y) - top(x) || sum(y) - sum(x))
}

type Props = { store: Store; setStore: (s: Store) => void }

export function Mixups({ store, setStore }: Props) {
  const [sel, setSel] = useState<{ groups: MixupGroup[]; i: number } | null>(null)
  const groups = useMemo(() => mixupGroups(store.log), [store.log])
  const hists = useMemo(() => kanaHistories(store.log), [store.log])
  const pairs = useMemo(() => groups.flatMap(g => g.pairs), [groups])
  const color = (k: string) => {
    if (!store.kana[k]) return undefined
    const score = 1 - pWrong(hists.get(k) ?? [])
    return `color-mix(in oklab, var(--good) ${Math.round(score * 100)}%, var(--bad))`
  }
  if (sel) {
    const g = sel.groups[sel.i]
    const hasNext = sel.i + 1 < sel.groups.length
    const old = Object.keys(store.kana).filter(k => isKata(k) === isKata(g.kana[0]) && !g.kana.includes(k))
    return <RowSession key={sel.i} kana={g.kana} old={old} hasNext={hasNext} bonus={MIXUP} store={store} setStore={setStore} onNext={() => setSel(hasNext ? { ...sel, i: sel.i + 1 } : null)} />
  }
  return (
    <main className="rows-page">
      <p className="sub">kana you mix up — click one to drill it with its neighbours</p>
      {!groups.length && <p className="sub">no mixups yet — mistakes will show up here</p>}
      <MixupGraph pairs={pairs} color={color} onPick={k => setSel({ groups, i: groups.findIndex(g => g.kana.includes(k)) })} />
    </main>
  )
}
