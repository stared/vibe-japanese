import { useEffect, useRef, useState } from 'react'
import { BASE, SCRIPTS, align, match, misread, normalize, tokenize, type Script, type Seg, type Tok } from './kana'
import { ScriptCtx, loadScript, saveScript, useScript } from './script'
import { ORIGIN, ORIGIN_MEANING, NOTE } from './kanaInfo'
import { WORDS, NEW_CHARS, toks, type Word } from './words'
import { load, logRetype, newCard, record, save, solid, MIN, DAY, type Attempt, type Store } from './srs'
import { Grid } from './Grid'
import { WordList } from './WordList'
import { Rows } from './Rows'
import { Hook, KanaPic, PICS } from './pics'
import { fade, recent, weighted, type Recent } from './recency'

type Tab = 'study' | 'rows' | 'grid' | 'words'

export default function App() {
  const [store, setStore] = useState<Store>(load)
  const [tab, setTab] = useState<Tab>('study')
  const [visit, setVisit] = useState(0) // clicking the open tab again resets it
  const [now, setNow] = useState(Date.now())
  const [script, setScript] = useState<Script>(loadScript)
  useEffect(() => saveScript(script), [script])
  useEffect(() => save(store), [store])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10_000)
    return () => clearInterval(t)
  }, [])

  const due = Object.values(store.cards).filter(c => c.due <= now).length

  return (
    <ScriptCtx.Provider value={script}>
    <div className="app">
      <header>
        <nav>
          {(['study', 'rows', 'grid', 'words'] as Tab[]).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => { setTab(t); setVisit(v => v + 1) }}>{t}</button>
          ))}
        </nav>
        {due > 0 && <span className="due">{due} due</span>}
        <span className="scripts">
          {SCRIPTS.map(sc => (
            <button key={sc.id} className={script === sc.id ? 'on' : ''} onMouseDown={e => e.preventDefault()} onClick={() => setScript(sc.id)}>{sc.label}</button>
          ))}
        </span>
      </header>
      {tab === 'study' && <Study store={store} setStore={setStore} now={now} />}
      {tab === 'rows' && <Rows key={visit} store={store} setStore={setStore} />}
      {tab === 'grid' && <Grid store={store} />}
      {tab === 'words' && <WordList store={store} onReplace={setStore} />}
    </div>
    </ScriptCtx.Provider>
  )
}

type Result = { ok: boolean; segs: Seg[] | null; before: Store; attempt: Attempt; fixed?: boolean }
type Phase =
  | { kind: 'kana'; word: Word; chars: string[]; i: number }
  | { kind: 'quiz'; word: Word; first: boolean; drill?: boolean }
  | ({ kind: 'reveal'; word: Word; first: boolean; drill?: boolean } & Result)
  | { kind: 'idle' }

function pick(s: Store, now: number): Phase {
  const r = recent(s.log)
  const due = Object.values(s.cards).filter(c => c.due <= now).sort((a, b) => a.due - b.due)
  const c = due.find(c => Math.random() < fade(r.ids.get(c.id)))
  if (c) return quiz(c.id)
  const d = drillItem(s, r)
  if (d) return { kind: 'quiz', word: d, first: false, drill: true }
  const fresh = WORDS.find(w => !s.cards[w.kana])
  if (!fresh) return due.length ? quiz(due[0].id) : { kind: 'idle' }
  // kana already met (e.g. in rows) need no introduction
  const chars = NEW_CHARS.get(fresh.kana)!.filter(c => !s.kana[c])
  return chars.length ? { kind: 'kana', word: fresh, chars, i: 0 } : { kind: 'quiz', word: fresh, first: true }
}
const quiz = (id: string): Phase => ({ kind: 'quiz', word: WORDS.find(w => w.kana === id)!, first: false })

/** Before any new kana, drill the known ones until solid: real words first, the bare kana for variety. */
function drillItem(s: Store, r: Recent): Word | null {
  const learned = WORDS.filter(w => s.cards[w.kana])
  const known = [...new Set(learned.flatMap(w => toks(w).map(t => t.kana)))]
  const weak = known.filter(k => !solid(s.kana[k]))
  // the least practised first, but not one just asked
  const k = weighted(weak, k => fade(r.kana.get(k)) / (1 + (s.kana[k]?.n ?? 0)))
  if (!k) return null
  // a third of the time, any known word: keeps older kana in the mix
  const options: Word[] = Math.random() < 1 / 3 && learned.length > 2
    ? learned
    : [...learned.filter(w => toks(w).some(t => t.kana === k)), { kana: k, en: '' }]
  return weighted(options, w => fade(r.ids.get(w.kana))) ?? null
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/ /g, ''))
  u.lang = 'ja-JP'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

function Study({ store, setStore, now }: { store: Store; setStore: (s: Store) => void; now: number }) {
  const sc = useScript()
  const [phase, setPhase] = useState<Phase>(() => pick(store, Date.now()))
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(0)
  const storeRef = useRef(store)
  storeRef.current = store
  const shownAt = useRef(0)
  const hinted = useRef<number[]>([])

  const commit = (s: Store) => {
    storeRef.current = s
    setStore(s)
  }
  const next = () => {
    hinted.current = []
    setInput('')
    setShake(0)
    setPhase(pick(storeRef.current, Date.now()))
  }

  // while idle, wake up when something becomes due
  useEffect(() => {
    if (phase.kind === 'idle') setPhase(pick(storeRef.current, now))
  }, [now])

  const submit = (w: Word, first: boolean, isDrill = false) => {
    const t = toks(w)
    const given = normalize(input)
    const segs = given ? align(t, given) : null
    const wrong = segs ? segs.flatMap((sg, i) => (sg.ok ? [] : [i])) : t.map((_, i) => i)
    // kana peeked at by hovering: shown as hinted, not scored
    const hint = [...new Set(hinted.current)].filter(i => !wrong.includes(i)).sort((a, b) => a - b)
    hinted.current = []
    let before = storeRef.current
    if (!isDrill && !before.cards[w.kana]) before = { ...before, cards: { ...before.cards, [w.kana]: newCard(w.kana, Date.now()) } }
    const attempt: Attempt = { typed: input, kind: isDrill ? 'drill' : first ? 'new' : 'review', hint }
    commit(record(before, w.kana, t, wrong, Date.now(), attempt))
    setInput('')
    shownAt.current = Date.now()
    setPhase({ kind: 'reveal', word: w, first, drill: isDrill, ok: wrong.length === 0, segs, before, attempt })
    speak(w.kana)
  }

  // correct answers move on by themselves, unless there is a note to read
  useEffect(() => {
    if (phase.kind !== 'reveal' || !phase.ok || (phase.first && phase.word.note)) return
    const t = setTimeout(next, 2500)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      // the Enter that submitted an answer must not also skip its reveal
      if (e.repeat || (e.target instanceof HTMLInputElement && e.key === 'Enter')) return
      if (phase.kind === 'kana' && e.key === 'Enter') {
        e.preventDefault()
        const i = phase.i + 1
        setPhase(i < phase.chars.length ? { ...phase, i } : { kind: 'quiz', word: phase.word, first: true })
      } else if (phase.kind === 'reveal' && (phase.ok || phase.fixed) && e.key === 'Enter' && Date.now() - shownAt.current > 1000) {
        e.preventDefault()
        next()
      } else if (phase.kind === 'reveal' && !phase.ok && !phase.fixed && e.key === 'Escape') {
        commit(record(phase.before, phase.word.kana, toks(phase.word), [], Date.now(), { ...phase.attempt, typo: true }))
        next()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [phase])

  if (phase.kind === 'idle') {
    const nextDue = Math.min(...Object.values(store.cards).map(c => c.due))
    return (
      <main className="study">
        <div className="word">おつかれさま</div>
        <p className="sub">All done. Next review {fmtIn(nextDue - now)}.</p>
      </main>
    )
  }

  if (phase.kind === 'kana') {
    const k = phase.chars[phase.i]
    const reading = BASE[k] && tokenize(k)[0][sc]
    const advance = () => {
      const i = phase.i + 1
      setPhase(i < phase.chars.length ? { ...phase, i } : { kind: 'quiz', word: phase.word, first: true })
    }
    return (
      <main className="study">
        {PICS[k] ? <KanaPic k={k} size={150} /> : <div className="word">{k}</div>}
        {reading && <div className="reading">{reading}</div>}
        <Hook k={k} />
        {ORIGIN[k] && <div className="sub">from <span className="origin">{ORIGIN[k]}</span> meaning ‘{ORIGIN_MEANING[ORIGIN[k]]}’</div>}
        {NOTE[k] && <div className="sub">{NOTE[k]}</div>}
        <button className="next" onClick={advance}>next</button>
      </main>
    )
  }

  const w = phase.word
  const t = toks(w)

  if (phase.kind === 'quiz') {
    return (
      <main className="study">
        <KanaWord toks={t} onHint={i => hinted.current.push(i)} />
        <AnswerInput value={input} onChange={setInput} onEnter={() => submit(w, phase.first, phase.drill)} />
      </main>
    )
  }

  const { ok, first, fixed } = phase
  const segs = fixed ? t.map(x => ({ text: x.pl, ok: true })) : phase.segs
  const retype = () => {
    const good = match(t, normalize(input)).ok
    commit(logRetype(storeRef.current, w.kana, input, good, Date.now()))
    if (good) {
      // after a correction, move on only when asked
      shownAt.current = Date.now()
      setInput('')
      setPhase({ ...phase, fixed: true })
    } else setShake(n => n + 1)
  }
  const confusions = segs ? t.flatMap((x, i) => {
    const c = segs[i].ok ? null : misread(x, segs[i].text)
    return c ? [[x, c] as const] : []
  }) : []
  return (
    <main className="study">
      <div className="word" onClick={() => speak(w.kana)}>
        {t.map((x, i) => {
          const sg = segs?.[i]
          return (
            <span key={i} className={'tok' + (x.space ? ' gap' : '') + (sg && !sg.ok ? ' bad' : '') + (sg?.ok && !fixed && phase.attempt.hint?.includes(i) ? ' hinted' : '')}>
              <span>{x.gem ? 'っ' : ''}{[...x.kana].map((c, j) => <HoverKana key={j} k={c} />)}</span>
              {sg && <span className={'typed ' + (sg.ok ? (phase.attempt.hint?.includes(i) && !fixed ? 'hinted' : 'good') : 'bad')}>{sg.ok ? x[sc] : sg.text || '·'}</span>}
              {(!sg || !sg.ok) && <span className="r">{x[sc]}</span>}
            </span>
          )
        })}
      </div>
      {confusions.map(([x, c]) => (
        <div key={x.kana} className="confusion">
          <span className="jp">{x.kana}</span> {x[sc]}
          <span className="vs">≠</span>
          <span className="jp">{c}</span> {tokenize(c)[0][sc]}
        </div>
      ))}
      {w.en && (
        <div className="meaning">
          {w.kanji && <span className="kanji">{w.kanji}</span>} {w.en}
        </div>
      )}
      {first && w.note && <p className="sub note">{w.note}</p>}
      {ok || fixed
        ? (fixed || (first && w.note)) && <button className="next" onClick={next}>next</button>
        : <>
            <AnswerInput key={shake} shake={shake > 0} value={input} onChange={setInput} onEnter={retype} />
            <button className="hint" onClick={() => {
              commit(record(phase.before, w.kana, t, [], Date.now(), { ...phase.attempt, typo: true }))
              next()
            }}>typo</button>
          </>}
    </main>
  )
}

export function AnswerInput({ value, onChange, onEnter, placeholder, shake }: { value: string; onChange: (s: string) => void; onEnter: () => void; placeholder?: string; shake?: boolean }) {
  return (
    <input
      autoFocus
      className={'answer' + (shake ? ' shake' : '')}
      value={value}
      placeholder={placeholder}
      spellCheck={false}
      autoComplete="off"
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && !e.repeat && onEnter()}
    />
  )
}

/** A kana that shows its picture while hovered. */
function HoverKana({ k, onHint }: { k: string; onHint?: () => void }) {
  const [on, setOn] = useState(false)
  if (!PICS[k]) return <>{k}</>
  return (
    <span className={'hk' + (on ? ' on' : '')} onMouseEnter={() => { setOn(true); onHint?.() }} onMouseLeave={() => setOn(false)}>
      {k}
      {on && <KanaPic k={k} size={124} />}
    </span>
  )
}

function KanaWord({ toks: t, onHint }: { toks: Tok[]; onHint: (i: number) => void }) {
  return (
    <div className="word">
      {t.map((x, i) => (
        <span key={i} className={'tok' + (x.space ? ' gap' : '')}>
          <span>{x.gem ? 'っ' : ''}{[...x.kana].map((c, j) => <HoverKana key={j} k={c} onHint={() => onHint(i)} />)}</span>
        </span>
      ))}
    </div>
  )
}

export function fmtIn(ms: number) {
  if (ms <= 0) return 'now'
  if (ms < 60 * MIN) return `in ${Math.ceil(ms / MIN)} min`
  if (ms < DAY) return `in ${Math.round(ms / (60 * MIN))} h`
  return `in ${Math.round(ms / DAY)} d`
}
