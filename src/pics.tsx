import { useId } from 'react'
import { MNEMONICS, comparison } from './mnemonics'

// Keep the existing public API for study, row practice and the kana grid.
export const PICS = MNEMONICS

/** No invented strokes: colour only the actual ink in the identifying region. */
export function KanaPic({ k, size = 160, plain = false }: { k: string; size?: number; plain?: boolean }) {
  const id = useId()
  const p = MNEMONICS[k]
  const glyph = <text x="50" y="50" fontSize="84" fontWeight="400" textAnchor="middle" dominantBaseline="central">{k}</text>
  return (
    <svg className="kana-pic" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={k}>
      <g fill="currentColor">{glyph}</g>
      {!plain && p && <>
        <defs><clipPath id={id}>
          {p.focus.map(([x, y, width, height], i) => <rect key={i} x={x} y={y} width={width} height={height} />)}
        </clipPath></defs>
        <g className="mnemonic-ink" clipPath={`url(#${id})`} aria-hidden="true">{glyph}</g>
      </>}
    </svg>
  )
}

export function CueText({ text }: { text: string }) {
  return <>{text.split('**').map((t, i) => i % 2 ? <b key={i}>{t}</b> : t)}</>
}

/** Short cue for practice; optional explanation never crowds the row cards. */
export function Hook({ k, explain = false }: { k: string; explain?: boolean }) {
  const p = MNEMONICS[k]
  if (!p) return null
  return (
    <div className="mnemonic-hint">
      <div className="hook"><CueText text={p.hook} /></div>
      {explain && <details className="mnemonic-details" key={k}>
        <summary>See the shape</summary>
        <p>{p.shape}</p>
        <p>{p.sound}</p>
        <p className="mnemonic-kind">{p.kind === 'bridge' ? 'Memory bridge: the sound needs a verbal association.' : 'Shape cue: look for the image in the strokes.'}</p>
      </details>}
    </div>
  )
}

/** Only explain pairs we have actually reviewed as look-alikes. */
export function Contrast({ a, b }: { a: string; b: string }) {
  if (!comparison(a, b)) return null
  return <div className="mnemonic-contrast">
    {[a, b].map(k => <p key={k}><span className="jp">{k}</span> {MNEMONICS[k].feature}</p>)}
  </div>
}
