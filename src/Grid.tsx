import { useState } from 'react'
import { GRID, GRID_VOICED, VOWELS, YOON_BASES, YOON_SMALL } from './kana'
import { ORIGIN, ORIGIN_MEANING, NOTE } from './kanaInfo'
import { WORDS, toks } from './words'
import type { Store } from './srs'
import { useScript } from './script'

const TABLES = [
  { head: VOWELS, rows: GRID.map(r => ({ c: r.c, cells: [...r.cells] })), note: 'Consonant + vowel. Irregular: si, ci, cu, fu.' },
  { head: VOWELS, rows: GRID_VOICED.map(r => ({ c: r.c, cells: [...r.cells] })), note: '゛ voices: k→g, s→z, t→d, h→b. ゜ makes h→p.' },
  { head: ['ja', 'ju', 'jo'], rows: [...YOON_BASES].map(b => ({ c: b, cells: [...YOON_SMALL].map(s => b + s) })), note: 'Small ゃゅょ glide: き + ゃ → kia.' },
]

export function Grid({ store }: { store: Store }) {
  const [sel, setSel] = useState<string | null>(null)
  const learned = WORDS.filter(w => store.cards[w.kana])
  const seen = new Set(learned.flatMap(w => toks(w).map(t => t.kana)))

  const cell = (k: string, j: number) => {
    if (k === '・') return <td key={j} />
    const st = store.kana[k]
    const weak = st && st.ema < 0.6
    return (
      <td key={j} className={(seen.has(k) ? 'known' : 'locked') + (weak ? ' weak' : '') + (sel === k ? ' sel' : '')}
        onClick={() => setSel(sel === k ? null : k)}>
        {k}
      </td>
    )
  }

  return (
    <main className="grid-page">
      <div className="tables">
        {TABLES.map((tb, i) => (
          <section key={i}>
            <table className="kana-grid">
              <thead><tr><th />{tb.head.map(v => <th key={v}>{v}</th>)}</tr></thead>
              <tbody>{tb.rows.map((r, ri) => <tr key={ri}><th>{r.c.length > 1 || /[ぁ-ん]/.test(r.c) ? '' : r.c}</th>{r.cells.map(cell)}</tr>)}</tbody>
            </table>
            <p className="sub">{tb.note}</p>
          </section>
        ))}
      </div>
      <aside className="detail">{sel && <Detail k={sel} store={store} />}</aside>
    </main>
  )
}

function Detail({ k, store }: { k: string; store: Store }) {
  const sc = useScript()
  const t = toks({ kana: k, en: '' })[0]
  const words = WORDS.filter(w => store.cards[w.kana] && toks(w).some(x => x.kana === k))
  return (
    <>
      <div className="detail-kana">{k}</div>
      <div className="reading">{t[sc]}</div>
      {ORIGIN[k] && <div className="sub">from <span className="origin">{ORIGIN[k]}</span> meaning ‘{ORIGIN_MEANING[ORIGIN[k]]}’</div>}
      {NOTE[k] && <p className="sub">{NOTE[k]}</p>}
      <ul className="mini-words">
        {words.map(w => <li key={w.kana}><span className="jp">{w.kana}</span> {w.en}</li>)}
      </ul>
    </>
  )
}
