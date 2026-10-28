import { useEffect, useRef, useState } from 'react'
import { BASE, align, match, misread, normalize, tokenize, type Script, type Seg, type Tok } from './kana'
import { ScriptCtx, loadScript, saveScript, useScript } from './script'
import { ORIGIN, ORIGIN_MEANING, NOTE } from './kanaInfo'
import { WORDS, NEW_CHARS, toks, type Word } from './words'
import { load, logRetype, newCard, record, save, MIN, DAY, type Attempt, type Store } from './srs'
import { Grid } from './Grid'
import { WordList } from './WordList'
import { Rows } from './Rows'
import { Settings } from './Settings'
import { Hook, KanaPic, pic } from './pics'
import { pick, type Pick } from './pick'

type Tab = 'study' | 'rows' | 'grid' | 'words' | 'settings'

export default function App() {
  const [store, setStore] = useState<Store>(load)
  const [tab, setTab] = useState<Tab>('study')
  const [visit, setVisit] = useState(0)
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
        <button className={'gear' + (tab === 'settings' ? ' on' : '')} onClick={() => setTab('settings')}>settings</button>
      </header>
      {tab === 'study' && <Study store={store} setStore={setStore} now={now} />}
      {tab === 'rows' && <Rows key={visit} store={store} setStore={setStore} />}
      {tab === 'grid' && <Grid store={store} />}
      {tab === 'words' && <WordList store={store} />}
      {tab === 'settings' && <Settings store={store} onReplace={setStore} script={script} setScript={setScript} />}
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

const toPhase = (p: Pick): Phase =>
  p.kind === 'review' ? { kind: 'quiz', word: p.word, first: false }
  : p.kind === 'drill' ? { kind: 'quiz', word: p.word, first: false, drill: true }
  : p.kind === 'new' ? (p.chars.length ? { kind: 'kana', word: p.word, chars: p.chars, i: 0 } : { kind: 'quiz', word: p.word, first: true })
  : { kind: 'idle' }

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
  const [phase, setPhase] = useState<Phase>(() => toPhase(pick(store, Date.now())))
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
    setPhase(toPhase(pick(storeRef.current, Date.now())))
  }

  useEffect(() => {
    if (phase.kind === 'idle') setPhase(toPhase(pick(storeRef.current, now)))
  }, [now])

  const submit = (w: Word, first: boolean, isDrill = false) => {
    const t = toks(w)
    const given = normalize(input)
    const segs = given ? align(t, given) : null
    const wrong = segs ? segs.flatMap((sg, i) => (sg.ok ? [] : [i])) : t.map((_, i) => i)
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

  useEffect(() => {
    if (phase.kind !== 'reveal' || !phase.ok || phase.first) return
    const t = setTimeout(next, 2500)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
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
        {pic(k) ? <KanaPic k={k} size={150} /> : <div className="word">{k}</div>}
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
      {first && (ok || fixed) && <div className="new-word">new word</div>}
      {w.en && (
        <div className="meaning">
          {w.kanji && <span className="kanji">{w.kanji}</span>} {w.en}
        </div>
      )}
      {first && w.note && <p className="sub note">{w.note}</p>}
      {ok || fixed
        ? (fixed || first) && <button className="next" onClick={next}>next</button>
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

export function HoverKana({ k, onHint }: { k: string; onHint?: () => void }) {
  const [on, setOn] = useState(false)
  if (!pic(k)) return <>{k}</>
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
