import { useId } from 'react'
import { MNEMONICS, comparison } from './mnemonics'
import { KANA_ART } from './kanaArt'

// Keep the existing public API for study, row practice and the kana grid.
export const PICS = MNEMONICS

/** Pictures keep the native glyph intact; structure mode isolates its identifying ink. */
export function KanaPic({ k, size = 160, plain = false, mode = 'picture' }: {
  k: string; size?: number; plain?: boolean; mode?: 'picture' | 'structure'
}) {
  const id = useId()
  const p = MNEMONICS[k]
  const art = !plain && mode === 'picture' ? KANA_ART[k] : undefined
  const focus = !plain && p && (mode === 'structure' ? 'var(--accent)' : art?.focus)
  const material = art?.material
  const glyph = <text x="50" y="50" fontSize="84" fontWeight="400" textAnchor="middle" dominantBaseline="central">{k}</text>
  return (
    <svg className="kana-pic" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={k} data-treatment={art?.treatment}>
      {art?.under && <g data-art-layer="under" aria-hidden="true">{art.under}</g>}
      {material === 'neon' && <g data-art-layer="glow" fill="none" stroke={art?.ink} strokeWidth="4" opacity=".18" aria-hidden="true">{glyph}</g>}
      <g fill={art?.ink ?? 'currentColor'}>{glyph}</g>
      {focus && <>
        <defs><clipPath id={`${id}-focus`}>
          {p.focus.map(([x, y, width, height], i) => <rect key={i} x={x} y={y} width={width} height={height} />)}
        </clipPath></defs>
        <g fill={focus} clipPath={`url(#${id}-focus)`} aria-hidden="true">{glyph}</g>
      </>}
      {(material === 'rope' || material === 'metal') && <>
        <defs>
          <clipPath id={`${id}-ink`}>{glyph}</clipPath>
          <pattern id={`${id}-twist`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M-1 1L5 7M2 -2L8 4" stroke="var(--art-shine)" strokeWidth="1" opacity=".45" />
          </pattern>
          <linearGradient id={`${id}-shine`} x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset=".48" stopColor="white" stopOpacity=".4" />
            <stop offset=".52" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect data-art-layer="texture" width="100" height="100" clipPath={`url(#${id}-ink)`} fill={`url(#${id}-${material === 'rope' ? 'twist' : 'shine'})`} aria-hidden="true" />
      </>}
      {art?.over && <g data-art-layer="over" aria-hidden="true">{art.over}</g>}
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
