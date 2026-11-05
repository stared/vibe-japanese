import { useMemo, useState } from 'react'
import type { Mixup } from './Mixups'
import { tokenize } from './kana'
import { useScript } from './script'

export type Pt = { x: number; y: number }
const W = 640
const L = 60
const R = 22
const GAP = 24

function components(nodes: string[], edges: Mixup[]): string[][] {
  const root = new Map(nodes.map(k => [k, k]))
  const find = (k: string): string => root.get(k) === k ? k : find(root.get(k)!)
  for (const e of edges) root.set(find(e.a), find(e.b))
  const m = new Map<string, string[]>()
  for (const k of nodes) m.set(find(k), [...(m.get(find(k)) ?? []), k])
  return [...m.values()].sort((x, y) => y.length - x.length)
}

function place(nodes: string[], edges: Mixup[]): Pt[] {
  const n = nodes.length
  const idx = new Map(nodes.map((k, i) => [k, i]))
  const adj = nodes.map(() => [] as number[])
  for (const e of edges) if (idx.has(e.a)) { adj[idx.get(e.a)!].push(idx.get(e.b)!); adj[idx.get(e.b)!].push(idx.get(e.a)!) }
  const hops = nodes.map((_, s) => {
    const d = nodes.map(() => Infinity)
    d[s] = 0
    for (const q = [s]; q.length;) { const i = q.shift()!; for (const j of adj[i]) if (d[j] === Infinity) { d[j] = d[i] + 1; q.push(j) } }
    return d
  })
  const want = (i: number, j: number) => L * hops[i][j] ** 0.6
  const p = nodes.map((_, i) => ({ x: Math.cos(2.4 * i) * L * Math.sqrt(i + 1) / 2, y: Math.sin(2.4 * i) * L * Math.sqrt(i + 1) / 2 }))
  for (let it = 0; it < 300; it++)
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0, ws = 0
      for (let j = 0; j < n; j++) {
        if (j === i) continue
        const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y
        const r = Math.hypot(dx, dy) || 1e-3
        const t = want(i, j), w = 1 / (t * t)
        x += w * (p[j].x + t * dx / r)
        y += w * (p[j].y + t * dy / r)
        ws += w
      }
      p[i] = { x: x / ws, y: y / ws }
    }
  const x0 = Math.min(...p.map(q => q.x)), y0 = Math.min(...p.map(q => q.y))
  const s = Math.min(1, (W - 2 * R) / Math.max(Math.max(...p.map(q => q.x)) - x0, 1))
  return p.map(q => ({ x: (q.x - x0) * s, y: (q.y - y0) * s }))
}

export function layout(nodes: string[], edges: Mixup[]): { pos: Map<string, Pt>; h: number } {
  const boxes = components(nodes, edges).map(c => {
    const p = place(c, edges)
    return { c, p, w: Math.max(...p.map(q => q.x)), h: Math.max(...p.map(q => q.y)) }
  })
  const pos = new Map<string, Pt>()
  let y = R + 4
  for (let i = 0; i < boxes.length;) {
    const row = [boxes[i++]]
    let w = row[0].w
    while (i < boxes.length && w + GAP + 2 * R + boxes[i].w <= W - 2 * R) w += GAP + 2 * R + boxes[i].w, row.push(boxes[i++])
    const rh = Math.max(...row.map(b => b.h))
    let x = (W - w) / 2
    for (const b of row) {
      b.c.forEach((k, j) => pos.set(k, { x: x + b.p[j].x, y: y + (rh - b.h) / 2 + b.p[j].y }))
      x += b.w + GAP + 2 * R
    }
    y += rh + GAP + 2 * R
  }
  return { pos, h: y - GAP - R + 4 }
}

type Props = { pairs: Mixup[]; color: (k: string) => string | undefined; onPick: (k: string) => void }

export function MixupGraph({ pairs, color, onPick }: Props) {
  const sc = useScript()
  const [hover, setHover] = useState<string | null>(null)
  const nodes = useMemo(() => [...new Set(pairs.flatMap(p => [p.a, p.b]))].sort(), [pairs])
  const { pos, h } = useMemo(() => layout(nodes, pairs), [nodes, pairs])
  if (!nodes.length) return null
  const wMax = Math.max(...pairs.map(p => p.w))
  const near = (k: string) => hover === k || pairs.some(p => (p.a === hover && p.b === k) || (p.b === hover && p.a === k))
  return (
    <div className="mixup-graph">
      <svg viewBox={`0 0 ${W} ${h}`} width="100%">
        {pairs.map(p => {
          const a = pos.get(p.a)!, b = pos.get(p.b)!
          const on = hover === p.a || hover === p.b
          return <line key={p.a + p.b} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={'edge' + (on ? ' on' : hover ? ' dim' : '')} strokeWidth={1 + 5 * Math.sqrt(p.w / wMax)} />
        })}
        {nodes.map(k => {
          const q = pos.get(k)!
          return (
            <g key={k} className={'node' + (hover && !near(k) ? ' dim' : '')} transform={`translate(${q.x} ${q.y})`}
              onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} onClick={() => onPick(k)}>
              <circle r={R} />
              <text style={{ fill: color(k) }}>{k}</text>
            </g>
          )
        })}
        {hover && nodes.filter(near).map(k => {
          const q = pos.get(k)!
          return <text key={k} className="roma" x={q.x} y={q.y + R + 12}>{tokenize(k)[0][sc]}</text>
        })}
      </svg>
    </div>
  )
}
