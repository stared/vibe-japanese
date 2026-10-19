// Readings: [Polish (phonetic), Hepburn, ...other accepted spellings]
export const BASE: Record<string, string[]> = {
  あ: ['a'], い: ['i'], う: ['u'], え: ['e'], お: ['o'],
  か: ['ka'], き: ['ki'], く: ['ku'], け: ['ke'], こ: ['ko'],
  さ: ['sa'], し: ['si', 'shi'], す: ['su'], せ: ['se'], そ: ['so'],
  た: ['ta'], ち: ['ci', 'chi', 'ti'], つ: ['cu', 'tsu', 'tu'], て: ['te'], と: ['to'],
  な: ['na'], に: ['ni'], ぬ: ['nu'], ね: ['ne'], の: ['no'],
  は: ['ha'], ひ: ['hi'], ふ: ['fu', 'fu', 'hu'], へ: ['he'], ほ: ['ho'],
  ま: ['ma'], み: ['mi'], む: ['mu'], め: ['me'], も: ['mo'],
  や: ['ja', 'ya'], ゆ: ['ju', 'yu'], よ: ['jo', 'yo'],
  ら: ['ra'], り: ['ri'], る: ['ru'], れ: ['re'], ろ: ['ro'],
  わ: ['ła', 'wa', 'la'], を: ['o', 'o', 'wo'], ん: ['n'],
  が: ['ga'], ぎ: ['gi'], ぐ: ['gu'], げ: ['ge'], ご: ['go'],
  ざ: ['za'], じ: ['dzi', 'ji', 'zi'], ず: ['zu', 'zu', 'dzu'], ぜ: ['ze'], ぞ: ['zo'],
  だ: ['da'], ぢ: ['dzi', 'ji', 'di'], づ: ['dzu', 'zu', 'du'], で: ['de'], ど: ['do'],
  ば: ['ba'], び: ['bi'], ぶ: ['bu'], べ: ['be'], ぼ: ['bo'],
  ぱ: ['pa'], ぴ: ['pi'], ぷ: ['pu'], ぺ: ['pe'], ぽ: ['po'],
}

export const IPA: Record<string, string> = {
  あ: 'a', い: 'i', う: 'ɯ', え: 'e', お: 'o',
  か: 'ka', き: 'kʲi', く: 'kɯ', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'ɕi', す: 'sɯ', せ: 'se', そ: 'so',
  た: 'ta', ち: 'tɕi', つ: 'tsɯ', て: 'te', と: 'to',
  な: 'na', に: 'ɲi', ぬ: 'nɯ', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'çi', ふ: 'ɸɯ', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mʲi', む: 'mɯ', め: 'me', も: 'mo',
  や: 'ja', ゆ: 'jɯ', よ: 'jo',
  ら: 'ɾa', り: 'ɾʲi', る: 'ɾɯ', れ: 'ɾe', ろ: 'ɾo',
  わ: 'ɰa', を: 'o', ん: 'ɴ',
  が: 'ɡa', ぎ: 'ɡʲi', ぐ: 'ɡɯ', げ: 'ɡe', ご: 'ɡo',
  ざ: 'za', じ: 'dʑi', ず: 'dzɯ', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'dʑi', づ: 'dzɯ', で: 'de', ど: 'do',
  ば: 'ba', び: 'bʲi', ぶ: 'bɯ', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pʲi', ぷ: 'pɯ', ぺ: 'pe', ぽ: 'po',
}

export type Script = 'pl' | 'hep' | 'ipa'
export const SCRIPTS: { id: Script; label: string }[] = [
  { id: 'pl', label: 'polski' },
  { id: 'hep', label: 'Hepburn' },
  { id: 'ipa', label: 'IPA' },
]

const SMALL: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' }
const IPA_V: Record<string, string> = { a: 'a', u: 'ɯ', o: 'o' }

// き + ゃ: Polish keeps the i (kia, sia, cia, dzia); Hepburn uses y or drops it (kya, sha, cha, ja)
function combo(base: string[], v: string): string[] {
  const out = new Set<string>()
  base.forEach((r, i) => {
    const stem = r.slice(0, -1)
    if (i === 0) out.add(stem + 'i' + v)
    if (['sh', 'ch', 'j'].includes(stem)) out.add(stem + v)
    else out.add(stem + 'y' + v)
  })
  return [...out]
}

const hepCombo = (r: string, v: string) => {
  const stem = r.slice(0, -1)
  return ['sh', 'ch', 'j'].includes(stem) ? stem + v : stem + 'y' + v
}

export type Tok = { kana: string; gem: boolean; space: boolean; pl: string; hep: string; ipa: string; readings: string[] }

export function tokenize(s: string, override?: Record<number, string[]>): Tok[] {
  const units: { kana: string; gem: boolean; space: boolean }[] = []
  let gem = false
  let space = false
  for (const ch of s) {
    if (ch === 'っ') gem = true
    else if (ch === ' ') space = true
    else if (ch in SMALL && units.length) units[units.length - 1].kana += ch
    else { units.push({ kana: ch, gem, space }); gem = space = false }
  }
  const toks: Tok[] = units.map((u, i) => {
    const base = BASE[u.kana[0]]
    let rs = override?.[i] ?? (u.kana.length === 1 ? base : combo(base, SMALL[u.kana[1]]))
    if (!rs) throw new Error(`unknown kana ${u.kana} in ${s}`)
    let pl = rs[0]
    let hep = override?.[i]?.[1] ?? (u.kana.length === 1 ? (base[1] ?? base[0]) : hepCombo(base[1] ?? base[0], SMALL[u.kana[1]]))
    const hepToKana = (h: string) => Object.keys(BASE).find(k => (BASE[k][1] ?? BASE[k][0]) === h)!
    let ipa = override?.[i] ? IPA[hepToKana(hep)] : u.kana.length === 1 ? IPA[u.kana] : IPA[u.kana[0]].slice(0, -1) + IPA_V[SMALL[u.kana[1]]]
    rs = [...new Set(rs)]
    if (u.gem) {
      ipa = (ipa[0] === 't' ? 't' : ipa[0]) + ipa
      rs = rs.flatMap(r => [r[0] + r, ...(r[0] === 'c' ? ['t' + r] : [])])
      pl = pl[0] + pl
      hep = (hep[0] === 'c' ? 't' : hep[0]) + hep
    }
    return { ...u, pl, hep, ipa, readings: rs }
  })
  toks.forEach((t, i) => {
    const prev = toks[i - 1]?.pl ?? ''
    const next = toks[i + 1]?.pl ?? ''
    if (t.kana === 'ん') {
      t.readings = ['n', 'nn', ...(/^[pbm]/.test(next) ? ['m'] : [])]
      t.pl = /^[pbm]/.test(next) ? 'm' : /^[aeiouj]/.test(next) ? "n'" : 'n'
      const ni = toks[i + 1]?.ipa ?? ''
      t.ipa = /^[pbm]/.test(ni) ? 'm' : /^[kɡ]/.test(ni) ? 'ŋ' : /^[ntdɾzsɕɲ]/.test(ni) ? 'n' : 'ɴ'
    }
    // long vowels: とう = tō, so the う may be dropped (tokyo, tōkyō)
    if ((t.kana === 'う' && /[ou]$/.test(prev)) || (t.kana === 'お' && /o$/.test(prev)) || (t.kana === 'い' && /e$/.test(prev)))
    {
      t.readings.push('')
      if (t.kana !== 'い') t.ipa = 'ː'
    }
  })
  return toks
}

export const show = (t: Tok, sc: Script) => t[sc]
export const display = (toks: Tok[], sc: Script = 'pl') => toks.map(t => (t.space ? ' ' : '') + t[sc]).join('')

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[\s'’\-.]/g, '')
}

/** Does the input spell the tokens? If not: which token broke first, and where in the input. */
export function match(toks: Tok[], input: string): { ok: boolean; blame: number | null; at: number } {
  let pos = new Set([0])
  for (let i = 0; i < toks.length; i++) {
    const next = new Set<number>()
    for (const p of pos) for (const r of toks[i].readings) if (input.startsWith(r, p)) next.add(p + r.length)
    if (!next.size) return { ok: false, blame: i, at: Math.max(...pos) }
    pos = next
  }
  return pos.has(input.length) ? { ok: true, blame: null, at: input.length } : { ok: false, blame: toks.length - 1, at: Math.max(...pos) }
}

export type Seg = { text: string; ok: boolean }

/** Align the typed answer to the tokens with the fewest wrong tokens. */
export function align(toks: Tok[], input: string): Seg[] {
  const n = toks.length, L = input.length
  // cost[i][p]: min wrong tokens to read toks[i..] from input[p..]
  const cost = Array.from({ length: n + 1 }, () => new Array<number>(L + 1).fill(Infinity))
  const step = Array.from({ length: n + 1 }, () => new Array<Seg | null>(L + 1).fill(null))
  cost[n][L] = 0
  for (let i = n - 1; i >= 0; i--) {
    for (let p = L; p >= 0; p--) {
      for (const r of toks[i].readings) {
        if (input.startsWith(r, p) && cost[i + 1][p + r.length] < cost[i][p]) {
          cost[i][p] = cost[i + 1][p + r.length]
          step[i][p] = { text: r, ok: true }
        }
      }
      const maxK = i === n - 1 ? L - p : Math.min(4, L - p)
      for (let k = 0; k <= maxK; k++) {
        if (1 + cost[i + 1][p + k] < cost[i][p]) {
          cost[i][p] = 1 + cost[i + 1][p + k]
          step[i][p] = { text: input.slice(p, p + k), ok: false }
        }
      }
    }
  }
  const segs: Seg[] = []
  let p = 0
  for (let i = 0; i < n; i++) {
    const sg = step[i][p]!
    segs.push(sg)
    p += sg.text.length
  }
  return segs
}

/** Which kana did the reader probably see instead? E.g. typed "re" where ね was → れ. */
export function misread(tok: Tok, rest: string): string | null {
  let best: [string, number] | null = null
  for (const [k, rs] of Object.entries(BASE)) {
    if (k === tok.kana) continue
    for (const r of rs) if (rest === r && (!best || r.length > best[1])) best = [k, r.length]
  }
  return best?.[0] ?? null
}

// The gojūon grid: consonant rows × vowel columns
export const VOWELS = ['a', 'i', 'u', 'e', 'o']
export const GRID: { c: string; cells: string }[] = [
  { c: '–', cells: 'あいうえお' },
  { c: 'k', cells: 'かきくけこ' },
  { c: 's', cells: 'さしすせそ' },
  { c: 't', cells: 'たちつてと' },
  { c: 'n', cells: 'なにぬねの' },
  { c: 'h', cells: 'はひふへほ' },
  { c: 'm', cells: 'まみむめも' },
  { c: 'j', cells: 'や・ゆ・よ' },
  { c: 'r', cells: 'らりるれろ' },
  { c: 'w', cells: 'わ・・・を' },
  { c: 'n', cells: 'ん・・・・' },
]
export const GRID_VOICED: { c: string; cells: string }[] = [
  { c: 'g', cells: 'がぎぐげご' },
  { c: 'z', cells: 'ざじずぜぞ' },
  { c: 'd', cells: 'だぢづでど' },
  { c: 'b', cells: 'ばびぶべぼ' },
  { c: 'p', cells: 'ぱぴぷぺぽ' },
]
export const YOON_BASES = 'きしちにひみりぎじびぴ'
export const YOON_SMALL = 'ゃゅょ'
