import { useState } from 'react'
import { GRID, GRID_VOICED, VOWELS, YOON_BASES, YOON_SMALL } from './kana'
import { WORDS, firstWordWith, toks } from './words'
import type { Store } from './srs'
import { KanaCard } from './App'

export function Grid({ store }: { store: Store }) {
  const [sel, setSel] = useState<string | null>(null)
  const learned = WORDS.filter(w => store.cards[w.kana])
  const known = new Set(learned.flatMap(w => [...w.kana]))
  const seenToks = new Set(learned.flatMap(w => toks(w).map(t => t.kana)))

  const cell = (k: string, key: string | number) => {
    if (k === '・') return <td key={key} className="empty" />
    const isKnown = k.length === 1 ? known.has(k) : seenToks.has(k)
    const derivable = !isKnown && [...k].every(c => known.has(c))
    const st = store.kana[k]
    const level = st ? Math.round(st.ema * 100) : null
    const style = isKnown && level !== null
      ? { background: `color-mix(in oklab, var(${level < 60 ? '--bad' : '--good'}) ${level < 60 ? 100 - level : level - 30}%, var(--paper))` }
      : undefined
    return (
      <td key={key} className={(isKnown ? 'known' : derivable ? 'derivable' : 'locked') + (sel === k ? ' sel' : '')}
        style={style} onClick={() => setSel(k)} title={st ? `${st.n} reads, ${level}%` : ''}>
        {k}
      </td>
    )
  }

  const sw = sel ? WORDS.filter(w => w.kana.includes(sel)) : []
  return (
    <main className="grid-page">
      <div className="tables">
        <table className="kana-grid">
          <thead><tr><th />{VOWELS.map(v => <th key={v}>{v}</th>)}</tr></thead>
          <tbody>{GRID.map((r, i) => <tr key={i}><th>{r.c}</th>{[...r.cells].map((k, j) => cell(k, j))}</tr>)}</tbody>
        </table>
        <p className="explain">Each cell is consonant + vowel. Irregulars: <b>si ci cu fu</b>. The consonant softens before i and u.</p>

        <table className="kana-grid">
          <thead><tr><th />{VOWELS.map(v => <th key={v}>{v}</th>)}</tr></thead>
          <tbody>{GRID_VOICED.map((r, i) => <tr key={i}><th>{r.c}</th>{[...r.cells].map((k, j) => cell(k, j))}</tr>)}</tbody>
        </table>
        <p className="explain">゛ voices the consonant: k→g, s→z, t→d, h→b. ゜ gives h→p, because old Japanese h was once p.</p>

        <table className="kana-grid">
          <thead><tr><th />{['ja', 'ju', 'jo'].map(v => <th key={v}>{v}</th>)}</tr></thead>
          <tbody>
            {[...YOON_BASES].map(b => <tr key={b}><th>{b}</th>{[...YOON_SMALL].map(s => cell(b + s, s))}</tr>)}
          </tbody>
        </table>
        <p className="explain">Small ゃゅょ glide into the i-kana: き + ゃ → kia (kya). <span className="derivable-chip">dashed</span> = not seen yet, but you know both parts.</p>
      </div>

      <aside className="detail">
        {sel ? (
          <>
            {sel.length === 1 ? <KanaCard k={sel} /> : <div className="kana-card"><div className="fonts"><span className="sans">{sel}</span></div><div className="reading">{toks({ kana: sel, en: '' })[0].pl} · {toks({ kana: sel, en: '' })[0].hep}</div></div>}
            {store.kana[sel] && <p className="muted">{store.kana[sel].n} reads · strength {Math.round(store.kana[sel].ema * 100)}%</p>}
            <h4>words</h4>
            <ul className="mini-words">
              {sw.filter(w => store.cards[w.kana]).map(w => <li key={w.kana}><span className="jp">{w.kana}</span> {w.en}</li>)}
            </ul>
            {!sw.some(w => store.cards[w.kana]) && <p className="muted">Not learned yet. First appears in word #{WORDS.indexOf(firstWordWith(sel[0])!) + 1}.</p>}
          </>
        ) : <p className="muted">Click a kana. Colour shows how well you read it: green is strong, red is weak.</p>}
      </aside>
    </main>
  )
}
