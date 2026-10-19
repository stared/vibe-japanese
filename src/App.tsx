import { useEffect, useRef, useState } from 'react'
import { BASE, align, match, misread, normalize, type Seg, type Tok } from './kana'
import { ORIGIN, ORIGIN_MEANING, NOTE } from './kanaInfo'
import { WORDS, NEW_CHARS, toks, type Word } from './words'
import { answer, load, newCard, save, MIN, DAY, type Store } from './srs'
import { Grid } from './Grid'
import { WordList } from './WordList'

type Tab = 'study' | 'grid' | 'words'

export default function App() {
  const [store, setStore] = useState<Store>(load)
  const [tab, setTab] = useState<Tab>('study')
  const [now, setNow] = useState(Date.now())
  useEffect(() => save(store), [store])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10_000)
    return () => clearInterval(t)
  }, [])

  const due = Object.values(store.cards).filter(c => c.due <= now).length

  return (
    <div className="app">
      <header>
        <nav>
          {(['study', 'grid', 'words'] as Tab[]).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        {due > 0 && <span className="due">{due} due</span>}
      </header>
      {tab === 'study' && <Study store={store} setStore={setStore} now={now} />}
      {tab === 'grid' && <Grid store={store} />}
      {tab === 'words' && <WordList store={store} onReset={() => setStore({ cards: {}, kana: {}, log: [] })} />}
    </div>
  )
}

type Result = { ok: boolean; segs: Seg[] | null; before: Store }
type Phase =
  | { kind: 'kana'; word: Word; chars: string[]; i: number }
  | { kind: 'quiz'; word: Word; first: boolean }
  | ({ kind: 'reveal'; word: Word; first: boolean } & Result)
  | { kind: 'idle' }

function pick(s: Store, now: number, last: string | null): Phase {
  const due = Object.values(s.cards).filter(c => c.due <= now).sort((a, b) => a.due - b.due)
  const c = due[0]?.id === last && due.length > 1 ? due[1] : due[0]
  if (c) return { kind: 'quiz', word: WORDS.find(w => w.kana === c.id)!, first: false }
  const fresh = WORDS.find(w => !s.cards[w.kana])
  if (!fresh) return { kind: 'idle' }
  const chars = NEW_CHARS.get(fresh.kana)!
  return chars.length ? { kind: 'kana', word: fresh, chars, i: 0 } : { kind: 'quiz', word: fresh, first: true }
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
  const [phase, setPhase] = useState<Phase>(() => pick(store, Date.now(), null))
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(0)
  const storeRef = useRef(store)
  storeRef.current = store
  const last = useRef<string | null>(null)

  const commit = (s: Store) => {
    storeRef.current = s
    setStore(s)
  }
  const next = () => {
    setInput('')
    setShake(0)
    setPhase(pick(storeRef.current, Date.now(), last.current))
  }

  // while idle, wake up when something becomes due
  useEffect(() => {
    if (phase.kind === 'idle') setPhase(pick(storeRef.current, now, last.current))
  }, [now])

  const submit = (w: Word, first: boolean) => {
    const t = toks(w)
    const given = normalize(input)
    const segs = given ? align(t, given) : null
    const wrong = segs ? segs.flatMap((sg, i) => (sg.ok ? [] : [i])) : t.map((_, i) => i)
    let before = storeRef.current
    if (!before.cards[w.kana]) before = { ...before, cards: { ...before.cards, [w.kana]: newCard(w.kana, Date.now()) } }
    commit(answer(before, w.kana, t, wrong, Date.now()))
    last.current = w.kana
    setInput('')
    setPhase({ kind: 'reveal', word: w, first, ok: wrong.length === 0, segs, before })
    speak(w.kana)
  }

  // correct answers move on by themselves, unless there is a note to read
  useEffect(() => {
    if (phase.kind !== 'reveal' || !phase.ok || (phase.first && phase.word.note)) return
    const t = setTimeout(next, 1400)
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
      } else if (phase.kind === 'reveal' && phase.ok && e.key === 'Enter') {
        e.preventDefault()
        next()
      } else if (phase.kind === 'reveal' && !phase.ok && e.key === 'Escape') {
        commit(answer(phase.before, phase.word.kana, toks(phase.word), [], Date.now()))
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
    const reading = BASE[k]?.[0]
    const advance = () => {
      const i = phase.i + 1
      setPhase(i < phase.chars.length ? { ...phase, i } : { kind: 'quiz', word: phase.word, first: true })
    }
    return (
      <main className="study">
        <div className="word">{k}</div>
        {reading && <div className="reading">{reading}</div>}
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
        <KanaWord toks={t} />
        <AnswerInput value={input} onChange={setInput} onEnter={() => submit(w, phase.first)} />
      </main>
    )
  }

  const { ok, segs, first } = phase
  const retype = () => {
    if (match(t, normalize(input)).ok) next()
    else setShake(n => n + 1)
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
            <span key={i} className={'tok' + (x.space ? ' gap' : '') + (sg && !sg.ok ? ' bad' : '')}>
              <span>{x.gem ? 'っ' : ''}{x.kana}</span>
              {sg && <span className={'typed ' + (sg.ok ? 'good' : 'bad')}>{sg.text || '·'}</span>}
              {(!sg || !sg.ok) && <span className="r">{x.pl}</span>}
            </span>
          )
        })}
      </div>
      {confusions.map(([x, c]) => (
        <div key={x.kana} className="confusion">
          <span className="jp">{x.kana}</span> {x.pl}
          <span className="vs">≠</span>
          <span className="jp">{c}</span> {BASE[c][0]}
        </div>
      ))}
      <div className="meaning">
        {w.kanji && <span className="kanji">{w.kanji}</span>} {w.en}
      </div>
      {first && w.note && <p className="sub note">{w.note}</p>}
      {ok
        ? (first && w.note) && <button className="next" onClick={next}>next</button>
        : <>
            <AnswerInput key={shake} shake={shake > 0} value={input} onChange={setInput} onEnter={retype} />
            <button className="hint" onClick={() => {
              commit(answer(phase.before, w.kana, t, [], Date.now()))
              next()
            }}>typo</button>
          </>}
    </main>
  )
}

function AnswerInput({ value, onChange, onEnter, placeholder, shake }: { value: string; onChange: (s: string) => void; onEnter: () => void; placeholder?: string; shake?: boolean }) {
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

function KanaWord({ toks: t }: { toks: Tok[] }) {
  return (
    <div className="word">
      {t.map((x, i) => (
        <span key={i} className={'tok' + (x.space ? ' gap' : '')}>
          <span>{x.gem ? 'っ' : ''}{x.kana}</span>
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
