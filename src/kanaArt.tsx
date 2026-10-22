import type { ReactNode } from 'react'

// The glyph is drawn between these two layers, at its original size and position.
// Added detail makes the association legible; the kana supplies its defining contour.
// Keep additions finer than the kana. Do not replace a missing diagnostic stroke.
export type KanaArt = {
  treatment: 'letters' | 'object' | 'scene' | 'space' | 'gesture' | 'material'
  under?: ReactNode
  over?: ReactNode
  ink?: string
  focus?: string
  material?: 'rope' | 'metal' | 'neon'
}

const blue = 'var(--art-blue)'
const red = 'var(--art-red)'
const gold = 'var(--art-gold)'
const wood = 'var(--art-wood)'
const metal = 'var(--art-metal)'
const green = 'var(--art-green)'
const purple = 'var(--art-purple)'
const pink = 'var(--art-pink)'
const line = (d: string, stroke = metal, width = 1.2) =>
  <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
const dot = (cx: number, cy: number, r: number, fill: string) => <circle cx={cx} cy={cy} r={r} fill={fill} />

export const KANA_ART: Record<string, KanaArt> = {
  あ: {
    treatment: 'letters', focus: red,
    over: <>
      <text className="art-letter" x="82" y="93" fill={red}>a</text>
      {line('M77 87Q62 88 48 79', red, .8)}
    </>,
  },
  い: {
    treatment: 'letters',
    over: <>{dot(23, 15, 3, blue)}{dot(64.5, 21, 3, blue)}</>,
  },
  う: {
    treatment: 'object', ink: wood,
    under: <path className="art-skin" d="M28 40Q55 27 72 41Q86 59 59 78Q48 84 37 84L39 70Q48 65 43 55L29 53Z" />,
    over: <>
      {line('M38 46Q62 38 65 50Q65 58 52 62L48 68', wood, 1.8)}
      {line('M40 72Q48 77 42 80', wood, 1.3)}
    </>,
  },
  え: {
    treatment: 'gesture',
    under: <>
      <circle className="art-skin" cx="49" cy="20" r="10" />
      <path className="art-sky" d="M44 34L61 36L47 58L34 56Z" />
      <path className="art-coral" d="M69 77L87 75L94 79Q92 84 73 84Z" />
    </>,
    over: <>
      {dot(54, 24, 1.3, wood)}
      {line('M4 48H16M7 56H19M2 65H10', blue, 1.5)}
      {line('M13 91H88', metal, .6)}
    </>,
  },
  お: {
    treatment: 'object', ink: metal,
    under: <>
      <ellipse className="art-glass" cx="30" cy="68" rx="11" ry="9" />
      <ellipse className="art-glass" cx="67" cy="64" rx="13" ry="13" />
    </>,
    over: <>
      {line('M23 65L30 59M59 61L68 52', 'var(--art-shine)', 2)}
      {dot(61, 48, 1.5, gold)}
      {line('M81 11L83 6M88 16L93 13', gold, 1)}
    </>,
  },
  か: {
    treatment: 'gesture',
    under: <>
      <circle className="art-skin" cx="45" cy="8" r="6.5" />
      <path className="art-sky" d="M37 17L51 20L59 43L32 42Z" />
      <path className="art-skin" d="M72 27Q80 25 84 37L89 58L83 61L74 40Z" />
    </>,
    over: <>
      {line('M38 22L44 30L51 23', blue, 1)}
      {line('M91 45L98 42M92 51H99M90 57L97 61', red, 1.5)}
    </>,
  },
  き: {
    treatment: 'material', ink: gold, material: 'metal',
    under: <path className="art-parchment" d="M39 54Q58 49 72 63Q83 79 60 88Q31 92 22 75Q18 64 29 58Z" />,
    over: <>
      <ellipse cx="48" cy="70" rx="10" ry="5.5" fill="var(--paper)" />
      {line('M35 60Q47 56 56 60', 'var(--art-shine)', 1.6)}
    </>,
  },
  く: {
    treatment: 'object',
    under: <>
      <path className="art-honey" d="M31 50L65 19Q69 49 65 84Z" />
      <circle className="art-skin" cx="17" cy="52" r="15" />
    </>,
    over: <>{dot(14, 45, 2.3, 'var(--ink)')}{line('M9 38Q13 35 17 37', wood, 1.2)}</>,
  },
  け: {
    treatment: 'object', ink: metal,
    under: <>
      <path className="art-dough" d="M55 24Q66 19 79 24L75 60Q67 68 60 59Z" />
      <path className="art-silver" d="M22 20L30 20L27 66L18 80L17 61Z" />
    </>,
    over: <>
      {line('M57 29Q67 26 77 29M59 45L76 42M60 53L75 50M61 59L73 56', wood, .9)}
      {dot(62, 36, 1, red)}{dot(71, 39, 1, red)}{dot(65, 49, .9, red)}
    </>,
  },
  こ: {
    treatment: 'space',
    under: <>
      <path className="art-stone" d="M19 19H81V34Q57 31 21 33ZM20 72Q51 79 83 73V88H19Z" />
      {line('M24 19V27M34 19V28M44 19V29M54 19V29M64 19V28M74 19V27M25 82V88M37 83V88M49 84V88M61 83V88M73 82V88', wood, .7)}
    </>,
    over: <>
      <g className="art-footsteps" fill={blue}>
        <ellipse cx="33" cy="49" rx="3.2" ry="1.7" transform="rotate(-15 33 49)" />
        <ellipse cx="46" cy="56" rx="3.2" ry="1.7" transform="rotate(15 46 56)" />
        <ellipse cx="59" cy="49" rx="3.2" ry="1.7" transform="rotate(-15 59 49)" />
      </g>
      {line('M75 52H94M89 48L94 52L89 56', blue, 1)}
    </>,
  },
  さ: {
    treatment: 'scene', ink: metal,
    under: <>
      <path className="art-dough" d="M17 29L77 23L79 35L18 41Z" />
      <path className="art-snow" d="M5 85Q39 79 92 88L92 97H5Z" />
      {line('M19 34Q7 26 7 12', wood, 1)}
    </>,
    over: <>{line('M14 91H38M45 94H83', blue, 1)}{dot(29, 35, 1.2, gold)}{dot(65, 31, 1.2, gold)}</>,
  },
  し: {
    treatment: 'object', ink: metal, material: 'metal',
    under: <>{line('M34 1V13', blue, .8)}<circle cx="34" cy="15" r="3" fill="none" stroke={metal} strokeWidth="1.4" /></>,
    over: <path fill={metal} d="M76 58L70 64L76 66Z" />,
  },
  す: {
    treatment: 'material', ink: wood, material: 'rope',
    under: <>
      <path className="art-dough" d="M10 26L90 24V40L10 42Z" />
      {line('M14 29L47 28M67 28L85 27M18 38L43 37M68 36L83 35', wood, .6)}
    </>,
    over: <>{line('M42 79L37 89M47 81L43 92M51 81L49 91', wood, .7)}</>,
  },
  せ: {
    treatment: 'letters', focus: purple,
    under: <path className="art-lilac" d="M34 43H76L77 73Q54 79 36 72Z" />,
    over: <text className="art-letter" x="84" y="22" fill={purple}>7</text>,
  },
  そ: {
    treatment: 'scene', focus: purple,
    under: <>
      <rect className="art-lilac" x="76" y="39" width="17" height="43" rx="7" />
      <path className="art-lilac" d="M51 49Q62 46 67 57L84 57Q94 57 94 70V84H49L38 73Q31 57 51 49Z" />
      {line('M49 85V91M86 85V91', wood, 2)}
      <path className="art-coral" d="M64 61Q75 56 84 62L85 74L62 75Z" />
    </>,
    over: <>{line('M65 78H88M82 46V55', purple, 1)}{line('M72 63L78 70M77 61L83 68', red, .7)}</>,
  },
  た: {
    treatment: 'gesture',
    under: <>
      <circle className="art-skin" cx="44" cy="8" r="6.5" />
      <path className="art-coral" d="M36 43L47 47L53 65Q35 69 21 61Z" />
      <ellipse className="art-honey" cx="71" cy="47" rx="15" ry="6" />
      <ellipse className="art-honey" cx="70" cy="72" rx="16" ry="7" />
    </>,
    over: <>
      {line('M82 55Q90 60 82 64', gold, 1)}
      <text className="art-small" x="89" y="47" fill={wood}>1</text>
      <text className="art-small" x="89" y="76" fill={wood}>2</text>
      {line('M5 59L11 53M7 69L14 65', red, 1)}
    </>,
  },
  ち: {
    treatment: 'object', ink: green, focus: red,
    under: <path className="art-pepper" d="M37 55Q62 45 77 56Q90 77 63 83Q41 85 28 80Q45 74 48 67Q48 59 37 55Z" />,
    over: <>{line('M54 58Q67 54 72 63', 'var(--art-shine)', 2.5)}{line('M62 76L57 78', 'var(--art-shine)', 1.3)}</>,
  },
  つ: {
    treatment: 'scene', ink: blue,
    under: <>
      <path className="art-water" d="M80 45C83 64 68 76 40 80C30 83 18 92 10 100H100V38Q87 40 80 45Z" />
      <path className="art-sky" d="M24 52C45 42 70 38 76 50C79 62 62 71 44 76C55 69 64 62 61 55C56 48 40 49 24 52Z" />
    </>,
    over: <>{dot(78, 36, 2, 'var(--art-shine)')}{dot(86, 42, 1.5, 'var(--art-shine)')}{line('M53 88Q67 82 82 84M64 94Q79 88 94 91', 'var(--art-shine)', 1.3)}</>,
  },
  て: {
    treatment: 'letters', focus: blue,
    over: <><text className="art-letter" x="81" y="89" fill={blue}>T</text>{line('M77 82Q69 71 60 67', blue, .8)}</>,
  },
  と: {
    treatment: 'object', ink: metal, focus: wood, material: 'metal',
    under: <path className="art-silver" d="M38 43L84 37L89 75Q65 90 29 79Q15 66 38 43Z" />,
    over: <>{line('M34 76Q54 83 81 75', 'var(--art-shine)', 2)}{dot(43, 48, 2, gold)}</>,
  },
  な: {
    treatment: 'scene', focus: wood,
    under: <>
      <circle className="art-skin" cx="77" cy="28" r="9" />
      <path className="art-lilac" d="M62 44Q77 47 78 66L88 83L51 85L48 75L60 68Z" />
    </>,
    over: <>{dot(73, 31, 1.2, wood)}{line('M45 92H93', metal, .6)}{line('M69 54L64 62', purple, 1)}</>,
  },
  に: {
    treatment: 'object', ink: metal,
    under: <>
      <path className="art-parchment" d="M55 38Q64 37 76 37L76 67Q66 70 55 66Z" />
      {line('M57 42L74 41M57 47L74 46M57 52L74 51M57 57L74 56M57 62L74 61', red, 1.5)}
    </>,
    over: <>
      <ellipse cx="25" cy="24" rx=".8" ry="3" fill="var(--art-shine)" />
      {line('M25 24Q8 26 10 42Q13 54 42 49L55 47', red, .9)}
    </>,
  },
  ぬ: {
    treatment: 'scene', ink: gold,
    under: <>
      <path className="art-porcelain" d="M7 76H93Q87 97 50 97Q14 97 7 76Z" />
      <ellipse cx="50" cy="76" rx="43" ry="4" fill="none" stroke={blue} strokeWidth="1" />
      {line('M23 88Q50 98 77 88', blue, 1)}
    </>,
    over: <>{line('M17 9Q13 5 17 2M76 14Q81 10 77 6', metal, .7)}</>,
  },
  ね: {
    treatment: 'material', ink: pink, material: 'neon',
  },
  の: {
    treatment: 'space', ink: red,
    under: <g transform="rotate(-12 55 55)">
      <rect x="37" y="52" width="28" height="5" rx="1" fill="var(--art-shine)" stroke={metal} strokeWidth=".6" />
      <path fill={wood} d="M37 52H45V57H37Z" />
      <path fill={red} d="M64 52H67V57H64Z" />
      {line('M68 47Q63 41 69 37Q74 33 69 28', metal, 1)}
    </g>,
  },
  は: {
    treatment: 'letters', ink: blue, focus: red,
    over: <text className="art-small" x="50" y="97" textAnchor="middle"><tspan fill={blue}>h</tspan><tspan fill={metal}> + </tspan><tspan fill={red}>a</tspan></text>,
  },
  ひ: {
    treatment: 'gesture', ink: '#59472d',
    under: <>
      <circle className="art-honey" cx="50" cy="45" r="43" />
      <path className="art-coral" d="M33 40Q47 35 66 39Q68 65 55 77Q34 88 26 63Z" />
      <path fill="var(--art-shine)" d="M32 39H66L63 48H34Z" />
    </>,
    over: <>
      {line('M34 24Q40 18 46 23M54 23Q60 18 66 24', wood, 1.8)}
      {line('M43 40V46M54 40V46', red, .8)}
      {line('M14 48L19 50M83 47L88 44', red, 1.3)}
    </>,
  },
  ふ: {
    treatment: 'scene', ink: blue,
    under: <>
      <path className="art-sky" d="M10 83L28 52L49 30L72 51L91 83Z" />
      <path className="art-snow" d="M32 49L49 30L68 50L56 46L49 51L44 44Z" />
      <path className="art-stone" d="M5 84Q49 78 96 86V95H5Z" />
    </>,
    over: <>{line('M18 91H31M67 90H86', blue, .8)}</>,
  },
  へ: {
    treatment: 'object', ink: metal, material: 'metal',
    under: <>
      <path className="art-silver" d="M12 61L35 35L89 75Q81 91 49 88Q19 86 12 61Z" />
      <path fill={metal} opacity=".55" d="M54 68L81 77L77 82L53 75Z" />
    </>,
    over: <>{dot(25, 67, 1.5, gold)}{dot(44, 78, 1.5, gold)}{line('M21 78Q44 92 76 85', metal, 1)}</>,
  },
  ほ: {
    treatment: 'scene', ink: blue,
    under: <>
      <path className="art-sky" d="M40 20H84V85H40Z" />
      <path className="art-stone" d="M14 13H31V86H14Z" />
      <g className="art-honey"><rect x="47" y="27" width="7" height="7" /><rect x="72" y="27" width="7" height="7" /><rect x="47" y="48" width="7" height="7" /><rect x="72" y="48" width="7" height="7" /></g>
      <rect x="17" y="51" width="11" height="12" fill="none" stroke={blue} strokeWidth="1" />
    </>,
    over: <>{line('M9 90H92', metal, 1)}{line('M20 69V76M18 73L20 76L22 73', blue, .8)}</>,
  },
  ま: {
    treatment: 'scene', ink: wood,
    under: <>
      <path className="art-parchment" d="M24 32L49 30V44L27 45ZM54 30L79 28L74 44H54Z" />
      <path className="art-sky" d="M24 52L49 51V64L29 64ZM54 51L76 49L72 64H54Z" />
      <path className="art-dough" d="M12 87H90L82 95H22Z" />
    </>,
    over: <>{line('M15 98H38M50 98H91', blue, 1)}{line('M27 33L30 42M59 53L70 52', 'var(--art-shine)', 1)}</>,
  },
  み: {
    treatment: 'object', ink: metal,
    under: <>
      <ellipse className="art-silver" cx="26" cy="65" rx="8" ry="12" transform="rotate(25 26 65)" />
      <ellipse className="art-silver" cx="62" cy="84" rx="15" ry="3" />
    </>,
    over: <>
      {line('M23 57L30 61M21 62L29 67M21 67L27 71M25 56L20 68M29 59L23 73', metal, .6)}
      {line('M12 58Q7 63 10 69M7 54Q0 63 5 73', blue, 1.2)}
    </>,
  },
  む: {
    treatment: 'object', ink: '#966717',
    under: <>
      <path className="art-parchment" d="M40 28L64 34L76 48L80 68Q83 85 60 85L36 79L27 63L27 47Z" />
      <ellipse className="art-skin" cx="33" cy="56" rx="8" ry="9" />
      <path className="art-skin" d="M70 22Q82 21 89 37L80 39Z" />
      <path className="art-dough" d="M63 57Q76 54 76 67Q73 76 64 72Z" />
    </>,
    over: <>{dot(31, 56, 1.6, wood)}{dot(57, 46, 2.2, 'var(--ink)')}{line('M55 41L60 42', wood, 1.1)}</>,
  },
  め: {
    treatment: 'space',
    under: <path className="art-porcelain" d="M22 55Q40 28 65 33Q91 47 79 69Q62 90 36 76Z" />,
    over: <>
      <ellipse cx="55" cy="57" rx="10" ry="14" transform="rotate(-18 55 57)" fill={blue} />
      <ellipse cx="55" cy="57" rx="4" ry="8" transform="rotate(-18 55 57)" fill="var(--ink)" />
      {dot(52, 52, 2.3, 'var(--art-shine)')}
    </>,
  },
  も: {
    treatment: 'object', ink: metal,
    under: <>
      <rect className="art-dough" x="23" y="8" width="30" height="85" rx="2" />
      {line('M28 11V25M28 58V88M47 12V25M47 58Q42 74 47 89', wood, .6)}
      <path className="art-silver" d="M14 27L69 25V36L14 38ZM12 45L67 43V54L12 56Z" />
    </>,
    over: <>{dot(20, 33, 1.3, gold)}{dot(61, 31, 1.3, gold)}{dot(19, 51, 1.3, gold)}{dot(60, 49, 1.3, gold)}</>,
  },
  や: {
    treatment: 'scene', ink: wood,
    under: <>
      <path className="art-dough" d="M40 34Q57 25 74 31Q88 40 75 48Q56 55 43 45Z" />
      <path className="art-porcelain" d="M35 13L42 34L61 28Z" />
      <path className="art-coral" d="M60 11L77 9L66 24Z" />
    </>,
    over: <>
      {dot(60, 40, 2, blue)}{dot(70, 38, 2, blue)}
      {line('M18 60Q30 55 43 60M67 60Q81 55 96 60', blue, 1.2)}
      {line('M45 81Q50 96 60 86L65 78M44 80L43 86M65 78L60 80', metal, 1.5)}
    </>,
  },
  ゆ: {
    treatment: 'scene', ink: metal, focus: gold,
    under: <>
      <ellipse className="art-meadow" cx="55" cy="53" rx="29" ry="24" />
      <path fill={metal} opacity=".12" d="M57 68L91 79L87 85L50 74Z" />
    </>,
    over: <>
      {line('M25 39L29 34L30 41M73 60L68 65L74 65', blue, 1.5)}
      <path d="M20 28L20 52Q33 27 54 29Q80 29 80 49Q80 67 62 72" fill="none" stroke="var(--art-shine)" strokeWidth=".8" strokeDasharray="2 3" />
    </>,
  },
  よ: {
    treatment: 'object', ink: wood,
    under: <>
      <ellipse className="art-coral" cx="36" cy="72" rx="15" ry="10" />
      <path className="art-skin" d="M52 26L77 23Q84 23 82 30L55 36Z" />
    </>,
    over: <>
      {dot(36, 72, 3, gold)}{dot(36, 72, 1, wood)}
      {line('M66 45V57M63 49L66 45L69 49M74 56V68M71 64L74 68L77 64', blue, 1)}
    </>,
  },
  ら: {
    treatment: 'object', ink: wood,
    under: <>
      <circle className="art-honey" cx="50" cy="18" r="11" />
      <path className="art-coral" d="M30 65Q41 53 57 54Q75 57 73 69Q69 80 48 79Q31 79 30 65Z" />
    </>,
    over: <>{line('M40 62Q50 58 60 60', 'var(--art-shine)', 1.7)}{line('M76 23L78 18M81 28L86 26', gold, .8)}</>,
  },
  り: {
    treatment: 'scene', ink: wood,
    under: <>
      <path className="art-water" d="M30 20Q49 11 66 21L65 59Q60 78 40 85L39 73Q54 62 53 47L35 49Z" />
      <path className="art-meadow" d="M10 18L23 17L22 55L10 62ZM77 20L92 25V70L63 89L54 85Q77 62 77 20Z" />
    </>,
    over: <>{line('M44 34L48 39L52 34M45 53L49 58L53 53', blue, 1)}{line('M82 57L80 48M82 57L87 50', green, 1)}</>,
  },
  る: {
    treatment: 'object', ink: wood,
    under: <>
      <path className="art-parchment" d="M24 16L72 16L31 58Q67 36 80 58Q92 83 57 90L31 82L27 69Q32 60 44 63L55 78Q77 75 73 63Q68 48 50 57L19 69L57 27H24Z" />
      <ellipse className="art-honey" cx="43" cy="74" rx="13" ry="8" />
    </>,
    over: <>{line('M35 70Q44 65 49 74Q49 79 44 78Q40 77 42 74', wood, .8)}{line('M29 20H54', 'var(--art-shine)', 1)}</>,
  },
  れ: {
    treatment: 'scene', ink: metal, material: 'metal',
    under: <>
      <path className="art-dough" d="M9 94L91 68L97 80L28 100Z" />
      {line('M22 95L92 73M35 98L94 80', wood, .7)}
      <ellipse className="art-silver" cx="32" cy="86" rx="8" ry="3" transform="rotate(-18 32 86)" />
      <ellipse className="art-silver" cx="85" cy="74" rx="8" ry="3" transform="rotate(-18 85 74)" />
    </>,
    over: <>{dot(30, 88, .8, wood)}{dot(87, 74, .8, wood)}{line('M75 95H94', blue, 1)}</>,
  },
  ろ: {
    treatment: 'object', ink: wood,
    under: <>
      <path className="art-dough" d="M26 18H71L34 56Q60 42 74 53Q90 70 65 85Q43 91 26 79L29 73Q48 77 58 68Q63 59 49 59L20 68L57 27H26Z" />
    </>,
    over: <>{line('M51 54L55 61M65 57L64 68M61 76L55 80', gold, 1.7)}{dot(17, 81, 1.2, gold)}{dot(85, 86, 1, gold)}{dot(81, 90, .8, gold)}</>,
  },
  わ: {
    treatment: 'object', ink: blue,
    under: <>
      <path className="art-sky" d="M33 17Q42 15 43 27V43Q56 30 70 37Q89 48 77 68Q69 84 48 78L35 73L31 86Z" />
    </>,
    over: <>
      {line('M48 51L51 54L54 51M58 49L61 52L64 49M48 61L51 64L54 61M58 59L61 62L64 59M68 57L71 60L74 57M58 69L61 72L64 69', 'var(--art-shine)', 1.2)}
      {line('M29 90L40 88', blue, 1.5)}
    </>,
  },
  を: {
    treatment: 'material', ink: wood, focus: blue,
    under: <>
      <path className="art-parchment" d="M31 10L40 12L29 55L20 62L19 53Z" />
      <path className="art-dough" d="M18 25L76 22L78 32L18 35Z" />
    </>,
    over: <>{line('M88 43L97 38M78 87L91 89', blue, 1.2)}{line('M43 60Q48 58 52 61M42 65Q47 62 51 65', blue, .8)}</>,
  },
  ん: {
    treatment: 'letters', ink: blue,
    under: <>{line('M9 88H91', blue, .6)}<path d="M9 16H91" fill="none" stroke={blue} strokeWidth=".4" strokeDasharray="2 3" opacity=".4" /></>,
    over: <>
      <path fill={gold} d="M83 65L84 51L91 55Z" />
      <path fill={metal} d="M84 51L93 35L99 39L91 55Z" />
      {line('M84 62L87 54', 'var(--ink)', .6)}
    </>,
  },
}
