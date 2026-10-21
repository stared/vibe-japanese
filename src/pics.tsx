// Pictures hidden in the kana's own shape: the strokes themselves must convincingly be the
// thing, and give the whole syllable. Drawing an object next to a kana doesn't make it one. A picture either recolours part of the kana
// (clip: the region shown in red) or adds shapes around it, never both.
// Coordinates are tuned to Klee One at the size below; check visually after any change.
type Pic = { hook: string; clip?: string; under?: string; over?: string }

export const PICS: Record<string, Pic> = {
  の: { hook: 'a “no” sign', clip: 'M0 0H100V100H0Z M40 35.5L55 35.5L38 79L26 74Z' },
  ん: { hook: 'an n inside', clip: 'M0 52H53V100H0Z' },
  い: { hook: '“ii” without the dots', over: '<circle class="pa" cx="24" cy="25" r="4"/><circle class="pa" cx="66" cy="33" r="4"/>' },
  す: { hook: 'a rope with a knot: supeł', clip: 'M51.3 0H59.5V47H100V100H0V47H51.3Z' },
  よ: { hook: 'a jo-jo on its string', clip: 'M0 64H49V100H0Z' },
  つ: {
    hook: 'a wave: tsunami',
    under: '<path class="pw" d="M83 50 C88 66 66 77 40 82 C30 85 18 92 10 100 L100 100 L100 40 C95 42 88 45 83 50Z"/><path class="pw2" d="M24 51 C45 41 72 37 79 50 C83 62 64 72 44 78 C55 70 66 62 62 54 C56 47 40 48 24 51Z"/>',
  },
  く: {
    hook: 'an open beak: ku-ku',
    under: '<path class="py" d="M33 55 L60 26 Q66 58 62 90Z"/><circle class="pt" cx="20" cy="55" r="14"/>',
    over: '<circle class="pa" cx="17" cy="51" r="2.4"/>',
  },
  ひ: { hook: 'a grin: hi hi', under: '<circle class="pt" cx="50" cy="56" r="42"/>', over: '<circle class="pa" cx="38" cy="56" r="2.8"/><circle class="pa" cx="50" cy="56" r="2.8"/>' },
  あ: { hook: 'an ɑ inside', clip: 'M0 47H46.5V100H0Z M38 86H46.5V100H38Z' },
  お: { hook: 'an o inside', clip: 'M42 55H100V100H42Z' },
  う: { hook: 'a U-turn sign', over: '<path class="pa" d="M32 96 L40 85.5 L45.5 94.5Z"/>' },
  ぬ: { hook: 'nudle in a bowl', under: '<path class="pb" d="M10 72 H92 C90 92 70 100 51 100 C32 100 12 92 10 72Z"/>' },
  て: { hook: 'a T: in Polish the letter is called “te”', clip: 'M0 0H100V44H62V72H30V52H0Z' },
  ね: { hook: 'a cursive “ne”', clip: 'M31.5 0H100V100H31.5Z' },
}

const glyph = (k: string, attrs = '') =>
  `<text x="50" y="50" font-family="Klee One" font-weight="600" font-size="84" text-anchor="middle" dominant-baseline="central" ${attrs}>${k}</text>`

/** The kana with its picture, or just the kana in the same style when it has none. */
export function KanaPic({ k, size = 160 }: { k: string; size?: number }) {
  const p = PICS[k]
  const id = `clip-${k.codePointAt(0)}`
  const svg = (p?.under ?? '') + glyph(k, 'fill="currentColor"') +
    (p?.clip ? `<clipPath id="${id}"><path d="${p.clip}" clip-rule="evenodd"/></clipPath>${glyph(k, `class="pa" clip-path="url(#${id})"`)}` : '') +
    (p?.over ?? '')
  return <svg className="kana-pic" width={size} height={size} viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: svg }} />
}
