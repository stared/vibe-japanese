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
  ち: { hook: 'a chick: cip-cip', under: '<path class="py" d="M37 72 Q48 61 62 60 Q74 62 75 71 Q72 82 44 88 Q36 84 37 72Z"/>', over: '<circle class="pa" cx="66" cy="66" r="2.6"/><path class="pa" d="M75 66 L84 69 L75 73Z"/><path class="ps" stroke-width="2" d="M50 89 V95 M56 88 V94"/>' },
  た: { hook: 't + a', over: '<path class="ps" stroke-width="5" d="M77 49 Q81 62 79 85"/><path class="ps" stroke-width="5" d="M79 65 Q60 60 51 72"/>' },
  と: { hook: 't + o', over: '<path class="ps" stroke-width="4" d="M31 40 L50 37"/><path class="ps" stroke-width="4" d="M71 44 Q84 56 80 72 Q78 80 72 82"/>' },
  は: { hook: 'H + a', clip: 'M0 0H38V100H0Z M38 35H56V47H38Z M56 0H67V66H56Z' },
  ほ: { hook: 'H + o', clip: 'M17 23H36V92H17Z M36 42H58V55H36Z M58 38H70V70H58Z M36 70H62V90H36Z' },
  け: { hook: 'a kebab on its spit', under: '<path class="pb" d="M53 26Q65 22 77 26L72 62Q66 72 60 62Z"/><path fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1" d="M55 33Q65 31 76 33M56 52Q65 50 74 52M57 58Q65 57 73 58"/>' },
  こ: { hook: 'a hen calling ko-ko', under: '<circle class="pt" cx="18" cy="53" r="17"/><path class="pa" d="M8 39Q6 30 12 33Q14 26 19 33Q23 27 26 37Z M27 66Q30 76 25 75Q22 72 24 66Z"/>', over: '<circle class="pa" cx="17" cy="47" r="2.3"/>' },
  む: { hook: 'a cow: muu', under: '<path class="pt" d="M41 72Q55 66 69 72L69 82Q60 86 42 84Z"/>', over: '<circle class="pa" cx="48" cy="60" r="2.3"/><circle class="pa" cx="62" cy="60" r="2.3"/><ellipse class="pa" cx="49" cy="78" rx="2.2" ry="1.5"/><ellipse class="pa" cx="61" cy="78" rx="2.2" ry="1.5"/>' },
  ろ: { hook: 'a winding road', over: '<path fill="none" stroke="#fff" stroke-width="1.3" stroke-dasharray="3 2.5" d="M32 31.5 L56 29.5 L26 70 M31 65 Q45 54 57 53 Q74 56 75 68 Q73 82 55 86 L39 88"/>' },
  わ: { hook: 'a watermelon slice', under: '<path class="pa" style="opacity:.55" d="M37 58 Q50 45 62 46 Q77 50 77 63 Q75 76 52 87 L37 87Z"/><path fill="none" stroke="#5a9e44" stroke-width="2.2" d="M38 57 Q50 45 61 46.5 Q75.5 50 75.5 63 Q74 76 51 86"/>', over: '<g fill="#5a2418"><ellipse cx="50" cy="60" rx="1" ry="1.7"/><ellipse cx="61" cy="58" rx="1" ry="1.7"/><ellipse cx="57" cy="69" rx="1" ry="1.7"/><ellipse cx="46" cy="72" rx="1" ry="1.7"/><ellipse cx="67" cy="68" rx="1" ry="1.7"/><ellipse cx="52" cy="80" rx="1" ry="1.7"/></g>' },
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
