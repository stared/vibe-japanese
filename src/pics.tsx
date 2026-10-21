// Pictures hidden in the kana's own shape. A picture either recolours part of the kana
// (clip: the region shown in red) or adds shapes around it, never both.
// Coordinates are tuned to Klee One at the size below; check visually after any change.
type Pic = { hook: string; clip?: string; under?: string; over?: string }

export const PICS: Record<string, Pic> = {
  の: { hook: 'a “no” sign', clip: 'M0 0H100V100H0Z M40 35.5L55 35.5L38 79L26 74Z' },
  ん: { hook: 'an n inside', clip: 'M0 52H53V100H0Z' },
  い: { hook: '“ii” without the dots', over: '<circle class="pa" cx="24" cy="25" r="4"/><circle class="pa" cx="66" cy="33" r="4"/>' },
  た: { hook: 'a t inside', clip: 'M0 0H60V43H47V100H0Z' },
  て: { hook: 'a T with its stem curled', clip: 'M0 0H100V44H62V72H30V52H0Z' },
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
  お: { hook: 'an o inside', clip: 'M36 55H100V100H36Z' },
  も: { hook: 'an o inside', clip: 'M40 56H100V100H40Z' },
  む: { hook: 'a u inside', clip: 'M36 54H100V100H36Z' },
  ね: { hook: 'an n inside', clip: 'M31 40H42V100H31Z M42 0H100V67H42Z' },
  ゆ: { hook: 'a j inside', clip: 'M43 47H60V100H43Z M48 0H60V37H48Z' },
  し: { hook: 'an i, dot missing', over: '<circle class="pa" cx="37" cy="15" r="4"/>' },
  に: { hook: 'an i, dot missing', over: '<circle class="pa" cx="31" cy="17" r="4"/>' },
  り: { hook: 'an i, dot missing', over: '<circle class="pa" cx="36" cy="15" r="4"/>' },
  と: { hook: 'a t, bar missing', over: '<rect class="pa" x="30" y="36" width="20" height="4.5" rx="2.2" transform="rotate(-4 40 38)"/>' },
  う: { hook: 'a U-turn sign', over: '<path class="pa" d="M32 96 L40 85.5 L45.5 94.5Z"/>' },
  こ: { hook: 'a broken o', under: '<ellipse class="pr" cx="50" cy="59" rx="25" ry="23"/>' },
  め: { hook: 'an eye: me in Japanese', over: '<circle class="pa" cx="60" cy="62" r="5"/>' },
  ふ: { hook: 'Mount Fuji', under: '<path class="pm" d="M4 94 L40 36 Q50 30 60 36 L96 94Z"/><path class="pn" d="M40 36 Q50 30 60 36 L67 47 L58 44 L52 49 L46 44 L33 47Z"/>' },
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
