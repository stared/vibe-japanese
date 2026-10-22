import { useState } from 'react'
import { GRID, tokenize } from './kana'
import { LOOK_ALIKES, MNEMONICS } from './mnemonics'
import { CueText, KanaPic } from './pics'
import { useScript } from './script'

const ALL = GRID.map(r => r.cells.replaceAll('・', '')).join('')

export function Mnemonics() {
  const sc = useScript()
  const [group, setGroup] = useState('all')
  const [hidden, setHidden] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const selected = LOOK_ALIKES.find(g => g.kana === group)
  const kana = selected?.kana ?? ALL
  const toggleHints = () => { setHidden(!hidden); setRevealed(new Set()) }

  return <main className="mnemonics-page">
    <h1>One shape, one cue</h1>
    <p className="mnemonic-intro">Polish and English hooks for all 46 basic hiragana. Bold gives the sound cue; colour picks out the distinguishing strokes. Find that feature in the plain character, then recall its sound.</p>
    <div className="mnemonic-controls">
      <label>Compare <select value={group} onChange={e => { setGroup(e.target.value); setRevealed(new Set()) }}>
        <option value="all">All 46 hiragana</option>
        {LOOK_ALIKES.map(g => <option key={g.kana} value={g.kana}>{g.kana} — {g.title}</option>)}
      </select></label>
      <button className="hint-toggle" onClick={toggleHints} aria-pressed={hidden}>{hidden ? 'Show all hints' : 'Hide hints · try recall'}</button>
    </div>
    {selected && <p className="comparison-question">{selected.title}</p>}
    {hidden && <p className="recall-instruction">Say the sound before revealing a card. These are the plain glyphs you will read in words.</p>}
    <div className="mnemonic-cards">
      {[...kana].map(k => {
        const p = MNEMONICS[k]
        const visible = !hidden || revealed.has(k)
        return <article className="mnemonic-card" key={k}>
          <KanaPic k={k} size={130} plain={!visible} />
          {visible ? <>
            <div className="reading">{tokenize(k)[0][sc]}</div>
            <h2><CueText text={p.hook} /></h2>
            <p className="shape-feature">{p.feature}</p>
            <details className="mnemonic-details">
              <summary>Why this cue?</summary>
              <p>{p.shape}</p>
              <p>{p.sound}</p>
              <p className="mnemonic-kind">{p.kind === 'bridge' ? 'Memory bridge' : 'Shape cue'}</p>
            </details>
          </> : <button className="reveal-cue" aria-label={`Reveal hint for ${k}`} onClick={() => setRevealed(prev => new Set([...prev, k]))}>Reveal sound & cue</button>}
        </article>
      })}
    </div>
    <aside className="mnemonic-notes">
      <p>Use a cue only if you can see it. Some are direct shape matches; others need a verbal bridge, explained under “Why this cue?”. The comparisons tell you which stroke separates neighbours even when the image does not click.</p>
      <p>Fonts and handwriting vary: き and さ may have a detached bottom curve; り may have a connection at the top. Brush-style fonts can join strokes with fine hairlines. Look for the main bars, loops and bends.</p>
      <p>These are memory aids, not the historical origins of the characters. Sound cues are approximate; use the reading selector and the app’s spoken examples for pronunciation.</p>
      <p className="mnemonic-sources">References checked: <a href="https://www.tofugu.com/japanese/learn-hiragana/">Tofugu’s hiragana guide</a> and <a href="https://classroomresources.sydney.jpf.go.jp/jpfmedia/%E3%81%B2%E3%82%89%E3%81%8C%E3%81%AA-Worksheet-B-1.pdf">Japan Foundation’s Hiragana Memory Hint</a>. Familiar anchors such as key, tsunami and jo-jo are retained where the shape earns them; the hooks and comparisons are rewritten for Polish + English.</p>
    </aside>
  </main>
}
