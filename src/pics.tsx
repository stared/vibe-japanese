// Pictures hidden in the kana's own shape: the strokes themselves must convincingly be the
// thing, and give the whole syllable. Drawing an object next to a kana doesn't make it one. A picture either recolours part of the kana
// (clip: the region shown in red) or adds shapes around it, never both.
// Coordinates are tuned to Klee One at the size below; check visually after any change.
type Pic = { hook: string; clip?: string; cls?: string; under?: string; over?: string }

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
  ろ: { hook: 'a winding road', over: '<path fill="none" style="stroke:var(--paper)" stroke-width="1.3" stroke-dasharray="3 2.5" d="M32 31.5 L56 29.5 L26 70 M31 65 Q45 54 57 53 Q74 56 75 68 Q73 82 55 86 L39 88"/>' },
  わ: { hook: 'a watermelon slice', under: '<path class="pa" style="opacity:.55" d="M37 58 Q50 45 62 46 Q77 50 77 63 Q75 76 52 87 L37 87Z"/><path fill="none" stroke="#5a9e44" stroke-width="2.2" d="M38 57 Q50 45 61 46.5 Q75.5 50 75.5 63 Q74 76 51 86"/>', over: '<g fill="#5a2418"><ellipse cx="50" cy="60" rx="1" ry="1.7"/><ellipse cx="61" cy="58" rx="1" ry="1.7"/><ellipse cx="57" cy="69" rx="1" ry="1.7"/><ellipse cx="46" cy="72" rx="1" ry="1.7"/><ellipse cx="67" cy="68" rx="1" ry="1.7"/><ellipse cx="52" cy="80" rx="1" ry="1.7"/></g>' },
  え: { hook: 'an EXIT sign: the kana runs to the door', under: '<rect x="4" y="16" width="92" height="80" rx="6" style="fill:#7cc18c"/><rect x="8" y="30" width="12" height="58" style="fill:#fff"/>', over: '<circle class="pn" cx="36" cy="26" r="5.5"/>' },
  る: { hook: 'a tape measure: ruletka', under: '<ellipse class="py" cx="54" cy="70" rx="18" ry="14"/>', over: '<path fill="none" style="stroke:var(--paper)" stroke-width="3.5" stroke-dasharray=".6 2.4" d="M57 31.5 L27 67"/>' },
  ら: { hook: 'a ping-pong bat: rakietka', under: '<path class="pa" style="opacity:.75" d="M33 70 Q46 59 58 59 Q71 61 71 72 Q67 83 50 87 L38 88 Q31 82 33 70Z"/>' },
  み: { hook: 'a note on the mi line: do re mi', under: '<path class="pq" d="M6 40.5H94M6 48.5H94M6 56.5H94M6 64.5H94M6 72.5H94"/><path class="pa" d="M21 75Q19 66 27 62Q33 60 34 63Q31 70 25 76Q22 78 21 75Z"/>', clip: 'M10 20H58V34L36 62L44 66L34 86H10Z' },
  や: { hook: 'a fried egg in a pan: jajko', under: '<path class="pn" style="stroke:#d8d2c4;stroke-width:.5" d="M52 55Q51 49 57 47Q60 43 66 44Q72 42 76 45Q81 47 80 51Q81 55 75 56Q70 59 64 57Q57 59 52 55Z"/>', over: '<circle class="pg" cx="66" cy="50.5" r="3.6"/>' },
  に: { hook: 'a spool of thread: nici', under: '<path class="pt" d="M47 42Q60 39 73 38L74 67Q60 69 47 63Z"/>', over: '<path class="ps" stroke-width="1.3" d="M47 46Q60 43.5 73 42.5M47 50.5Q60 48 73 47.5M47 55Q60 53 73 52.5M47 59.5Q60 58 73 57.5"/>' },
  き: { hook: 'a key', clip: 'M20 18H78V72H40V64H20Z', cls: 'pg', under: '<path class="pg" fill-rule="evenodd" d="M34 6a10 10 0 1 0 0.01 0Z M34 11.5a4.5 4.5 0 1 0 0.01 0Z"/>' },
  し: { hook: 'a sailing ship', under: '<path class="pa" d="M37 30L37 74Q56 74 68 68Z"/><path class="pw" d="M14 88Q50 98 94 74V100H14Z"/>' },
  そ: { hook: 'sewing: thread and needle', under: '<rect fill="#d8b98a" x="24" y="24" width="8" height="13" rx="1"/><rect fill="#b08a5a" x="22.5" y="22.5" width="11" height="2.4" rx="1"/><rect fill="#b08a5a" x="22.5" y="36" width="11" height="2.4" rx="1"/>', over: '<path fill="#93a3b8" d="M64 86.6L96 81.6Q97 82.4 96 83.2L65 92.4Q62 89.5 64 86.6Z"/><ellipse class="pn" cx="69.5" cy="88.3" rx="3" ry="1" transform="rotate(-13 69.5 88.3)"/>' },
  ふ: { hook: 'a puffer fish: fugu', under: '<ellipse class="pw2" cx="57" cy="68" rx="29" ry="21"/><path class="pn" d="M30 74Q57 98 85 74Q80 86 57 89Q38 88 30 74Z"/><g class="ps" style="stroke-width:1.5"><path d="M38 52l-3-3"/><path d="M33 64l-4-1"/><path d="M70 50l2-3"/><path d="M80 56l3-2"/><path d="M46 89l-1 3"/><path d="M58 89v3"/><path d="M70 87l2 3"/></g>', over: '<circle class="pn" cx="78" cy="63" r="4"/><circle class="pa" cx="79.2" cy="63" r="2.2"/>' },
  へ: { hook: 'a coat of arms: herb', under: '<path class="pg" d="M17 30H84V62Q84 86 50 96Q17 86 17 62Z"/>' },
  さ: {hook: 'cherry blossom twigs: sakura',over:'<g style="fill:#f4b6c8"><ellipse cx="22.3" cy="44.8" rx="4.0" ry="3.0" transform="rotate(10 22.3 44.8)"/><ellipse cx="18.6" cy="48.4" rx="4.0" ry="3.0" transform="rotate(82 18.6 48.4)"/><ellipse cx="14.0" cy="45.9" rx="4.0" ry="3.0" transform="rotate(154 14.0 45.9)"/><ellipse cx="14.9" cy="40.8" rx="4.0" ry="3.0" transform="rotate(226 14.9 40.8)"/><ellipse cx="20.1" cy="40.1" rx="4.0" ry="3.0" transform="rotate(298 20.1 40.1)"/></g><circle style="fill:#d9607a" cx="18" cy="44" r="1.4"/><g style="fill:#f4b6c8"><ellipse cx="55.9" cy="62.5" rx="3.5" ry="2.7" transform="rotate(40 55.9 62.5)"/><ellipse cx="51.6" cy="63.6" rx="3.5" ry="2.7" transform="rotate(112 51.6 63.6)"/><ellipse cx="49.2" cy="59.7" rx="3.5" ry="2.7" transform="rotate(184 49.2 59.7)"/><ellipse cx="52.1" cy="56.3" rx="3.5" ry="2.7" transform="rotate(256 52.1 56.3)"/><ellipse cx="56.3" cy="58.0" rx="3.5" ry="2.7" transform="rotate(328 56.3 58.0)"/></g><circle style="fill:#d9607a" cx="53" cy="60" r="1.3"/><g style="fill:#f4b6c8"><ellipse cx="70.1" cy="90.0" rx="3.8" ry="2.9" transform="rotate(0 70.1 90.0)"/><ellipse cx="67.3" cy="93.9" rx="3.8" ry="2.9" transform="rotate(72 67.3 93.9)"/><ellipse cx="62.7" cy="92.4" rx="3.8" ry="2.9" transform="rotate(144 62.7 92.4)"/><ellipse cx="62.7" cy="87.6" rx="3.8" ry="2.9" transform="rotate(216 62.7 87.6)"/><ellipse cx="67.3" cy="86.1" rx="3.8" ry="2.9" transform="rotate(288 67.3 86.1)"/></g><circle style="fill:#d9607a" cx="66" cy="90" r="1.3"/><g style="fill:#f4b6c8"><ellipse cx="33.4" cy="66.2" rx="3.2" ry="2.5" transform="rotate(20 33.4 66.2)"/><ellipse cx="29.9" cy="68.6" rx="3.2" ry="2.5" transform="rotate(92 29.9 68.6)"/><ellipse cx="26.6" cy="66.0" rx="3.2" ry="2.5" transform="rotate(164 26.6 66.0)"/><ellipse cx="28.0" cy="62.0" rx="3.2" ry="2.5" transform="rotate(236 28.0 62.0)"/><ellipse cx="32.2" cy="62.2" rx="3.2" ry="2.5" transform="rotate(308 32.2 62.2)"/></g><circle style="fill:#d9607a" cx="30" cy="65" r="1.2"/>'},
  か: {hook: 'an umbrella: kasa in Japanese',under:'<path class="pw2" d="M10 50Q12 18 47 13Q80 16 84 46Q77 40 70 46Q63 39 56 46Q48 39 41 46Q33 40 25 47Q17 42 10 50Z"/><path class="pq" style="stroke:#fff;stroke-width:1" d="M47 13Q30 25 25 47M47 13Q60 25 70 46"/><path class="pq" style="stroke-width:2.5" d="M47 13V8"/>'},
  な: {hook: 'n + a',over:'<path class="ps" stroke-width="5.5" d="M30 58Q36 42 47 42Q57 42 59 53"/>'},
  せ: {hook: 'a 7: seven',clip:'M0 0H100V100H0ZM41.5 46L65 42L65 48L60 66L54 66L56 53L41.5 56Z',cls:'pt'},
  も: {hook: 'camouflage: moro',over:'<clipPath id="m15"><text x="50" y="50" font-family="Klee One" font-weight="600" font-size="84" text-anchor="middle" dominant-baseline="central">も</text></clipPath><g clip-path="url(#m15)"><rect width="100" height="100" fill="#6b7a3c"/><path fill="#3d4a22" d="M36 20q8 4 4 12t-8 2zM24 40q10-4 12 4t-10 2zM40 58q6 6 0 12t-6-8zM56 82q8-6 14 0t-10 6zM66 58q6 4 2 10t-6-4z"/><path fill="#7a5634" d="M42 32q6 4 2 10t-6-6zM46 46q8-2 10 2t-8 3zM36 76q8 2 6 10t-10-4zM70 70q4 6-2 10t-2-8zM58 56q4-4 6 2t-6 2z"/><path fill="#1f2318" d="M30 46q4 0 4 4t-5-1zM44 66q4 2 2 6t-4-3zM50 88q5-2 6 2t-6 1zM64 64q3 0 3 4t-4 0zM40 26q3 0 2 3t-3-1z"/></g>'},
  ゆ: {hook: 'an onsen curtain: yu = hot water',cls:'pn',clip:'M0 0H100V100H0Z',under:'<rect x="11" y="12" width="78" height="3.4" rx="1.7" fill="#8a6a40"/><path fill="#2c4a74" d="M14 15.5H86V94H14Z"/>'},
  り: {hook: 'a diamond ring',cls:'pg',clip:'M0 0H100V100H0Z',over:'<path fill="#e6f4fb" stroke="#4a90c0" stroke-width=".9" d="M40 13 L56 13 L60 18.5 L48 29 L36 18.5Z M36 18.5H60 M44 13 L48 29 L52 13"/>'},
  れ: {hook: 'an X-ray: rentgen',under:'<rect x="6" y="12" width="88" height="86" rx="3" fill="#26303b"/>',clip:'M0 0H100V100H0Z',cls:'pn',over:'<circle cx="33" cy="25" r="3" fill="#fff"/><circle cx="37.5" cy="24" r="3" fill="#fff"/><circle cx="33" cy="89" r="3" fill="#fff"/><circle cx="38" cy="89" r="3" fill="#fff"/><circle cx="18" cy="45" r="3" fill="#fff"/><circle cx="17" cy="49.5" r="3" fill="#fff"/><circle cx="16" cy="80" r="3" fill="#fff"/><circle cx="20" cy="84" r="3" fill="#fff"/><circle cx="87" cy="69" r="3" fill="#fff"/><circle cx="90" cy="74" r="3" fill="#fff"/>'},
  を: {hook: 'a wagon: wóz',under:'<path class="pb" d="M41 69 L76 67 L76 86 L41 86Z"/><path stroke="#8a6a40" stroke-width=".8" d="M41 74H76M41 80H76"/>',over:'<circle cx="46" cy="90" r="7" style="fill:var(--paper)" stroke="#7a5a36" stroke-width="2"/><path stroke="#7a5a36" stroke-width="1.1" d="M39 90H53M46 83V97M41 85L51 95M51 85L41 95"/><circle cx="70" cy="90" r="7" style="fill:var(--paper)" stroke="#7a5a36" stroke-width="2"/><path stroke="#7a5a36" stroke-width="1.1" d="M63 90H77M70 83V97M65 85L75 95M75 85L65 95"/>'},
  め: { hook: 'a sheep: meee', under: '<path class="ps" style="stroke:#7a6f66;stroke-width:3.5" d="M46 84v12M56 86v10M70 86v10M80 80v14"/><g style="fill:#fff;stroke:#d8d2c8;stroke-width:1.2"><circle cx="82.0" cy="62.0" r="8.5"/><circle cx="79.5" cy="70.8" r="8.5"/><circle cx="72.5" cy="77.6" r="8.5"/><circle cx="62.7" cy="80.9" r="8.5"/><circle cx="52.2" cy="79.8" r="8.5"/><circle cx="43.5" cy="74.6" r="8.5"/><circle cx="38.6" cy="66.5" r="8.5"/><circle cx="38.6" cy="57.5" r="8.5"/><circle cx="43.5" cy="49.4" r="8.5"/><circle cx="52.2" cy="44.2" r="8.5"/><circle cx="62.7" cy="43.1" r="8.5"/><circle cx="72.5" cy="46.4" r="8.5"/><circle cx="79.5" cy="53.2" r="8.5"/></g><g style="fill:#fff"><circle cx="82.0" cy="62.0" r="7.9"/><circle cx="79.5" cy="70.8" r="7.9"/><circle cx="72.5" cy="77.6" r="7.9"/><circle cx="62.7" cy="80.9" r="7.9"/><circle cx="52.2" cy="79.8" r="7.9"/><circle cx="43.5" cy="74.6" r="7.9"/><circle cx="38.6" cy="66.5" r="7.9"/><circle cx="38.6" cy="57.5" r="7.9"/><circle cx="43.5" cy="49.4" r="7.9"/><circle cx="52.2" cy="44.2" r="7.9"/><circle cx="62.7" cy="43.1" r="7.9"/><circle cx="72.5" cy="46.4" r="7.9"/><circle cx="79.5" cy="53.2" r="7.9"/><ellipse cx="60" cy="62" rx="22" ry="19"/></g><path style="fill:#a89a8c" d="M26 52Q10 52 8 63Q10 71 18 71Q28 69 32 59Z"/><ellipse style="fill:#e8a8a0" cx="28" cy="49" rx="6" ry="2.6" transform="rotate(-30 28 49)"/>', over: '<circle style="fill:#5a504a" cx="17" cy="60" r="1.6"/>' },
  ま: { hook: 'a sushi roll: maki', under: '<ellipse style="fill:#2f4a32" cx="40.5" cy="80.5" rx="23" ry="15.5"/><ellipse class="pn" cx="40.5" cy="80.5" rx="19.5" ry="12"/><ellipse style="fill:#f08a5d" cx="38" cy="80.5" rx="6" ry="3"/><ellipse style="fill:#6fae5a" cx="46.5" cy="80.5" rx="2.6" ry="2.2"/>' },
}

const glyph = (k: string, attrs = '') =>
  `<text x="50" y="50" font-family="Klee One" font-weight="600" font-size="84" text-anchor="middle" dominant-baseline="central" ${attrs}>${k}</text>`

/** The kana with its picture, or just the kana in the same style when it has none. */
export function KanaPic({ k, size = 160 }: { k: string; size?: number }) {
  const p = PICS[k]
  const id = `clip-${k.codePointAt(0)}`
  const svg = (p?.under ?? '') + glyph(k, 'fill="currentColor"') +
    (p?.clip ? `<clipPath id="${id}"><path d="${p.clip}" clip-rule="evenodd"/></clipPath>${glyph(k, `class="${p.cls ?? 'pa'}" clip-path="url(#${id})"`)}` : '') +
    (p?.over ?? '')
  return <svg className="kana-pic" width={size} height={size} viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: svg }} />
}
