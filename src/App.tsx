import { useEffect, useRef, useState } from 'react'
import { BASE, display, match, normalize, type Tok } from './kana'
import { ORIGIN, NOTE, confusables } from './kanaInfo'
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

  const cards = Object.values(store.cards)
  const due = cards.filter(c => c.due <= now).length
  const today = store.log.filter(l => now - l.t < DAY && new Date(l.t).toDateString() === new Date(now).toDateString())

  return (
    <div className="app">
      <header>
        <span className="logo">かな</span>
        <nav>
          {(['study', 'grid', 'words'] as Tab[]).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        <span className="stats">
          {due} due · {cards.length}/{WORDS.length} words · {today.length} reviews today
          {today.length > 0 && ` (${Math.round((100 * today.filter(l => l.ok).length) / today.length)}%)`}
        </span>
      </header>
      {tab === 'study' && <Study store={store} setStore={setStore} now={now} />}
      {tab === 'grid' && <Grid store={store} />}
      {tab === 'words' && <WordList store={store} now={now} onReset={() => setStore({ cards: {}, kana: {}, log: [] })} />}
    </div>
  )
}

type Phase =
  | { kind: 'intro'; word: Word }
  | { kind: 'quiz'; word: Word }
  | { kind: 'reveal'; word: Word; ok: boolean; given: string; blame: number | null; before: Store }
  | { kind: 'idle' }

function pick(s: Store, now: number, last: string | null): Phase {
  const due = Object.values(s.cards).filter(c => c.due <= now).sort((a, b) => a.due - b.due)
  const c = due[0]?.id === last && due.length > 1 ? due[1] : due[0]
  const byId = (id: string) => WORDS.find(w => w.kana === id)!
  if (c) return { kind: 'quiz', word: byId(c.id) }
  const fresh = WORDS.find(w => !s.cards[w.kana])
  return fresh ? { kind: 'intro', word: fresh } : { kind: 'idle' }
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
  const storeRef = useRef(store)
  storeRef.current = store
  const last = useRef<string | null>(null)

  const commit = (s: Store) => {
    storeRef.current = s
    setStore(s)
  }
  const next = () => {
    setInput('')
    setPhase(pick(storeRef.current, Date.now(), last.current))
  }

  // while idle, wake up when something becomes due
  useEffect(() => {
    if (phase.kind === 'idle') setPhase(pick(storeRef.current, now, last.current))
  }, [now])

  const startQuiz = (w: Word) => {
    const s = storeRef.current
    commit({ ...s, cards: { ...s.cards, [w.kana]: newCard(w.kana, Date.now()) } })
    setPhase({ kind: 'quiz', word: w })
  }

  const submit = (w: Word) => {
    const t = toks(w)
    const given = normalize(input)
    const { ok, blame } = given ? match(t, given) : { ok: false, blame: null }
    const before = storeRef.current
    commit(answer(before, w.kana, t, ok, blame, Date.now()))
    last.current = w.kana
    setPhase({ kind: 'reveal', word: w, ok, given: input, blame, before })
    speak(w.kana)
  }

  const overrule = () => {
    if (phase.kind !== 'reveal') return
    commit(answer(phase.before, phase.word.kana, toks(phase.word), true, null, Date.now()))
    next()
  }

  useEffect(() => {
    if (phase.kind !== 'intro' && phase.kind !== 'reveal') return
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'Enter') {
        e.preventDefault()
        phase.kind === 'intro' ? startQuiz(phase.word) : next()
      } else if (e.key === ' ') {
        e.preventDefault()
        speak(phase.word.kana)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [phase])

  if (phase.kind === 'idle') {
    const nextDue = Math.min(...Object.values(store.cards).map(c => c.due))
    return (
      <main className="study">
        <p className="big-msg">おつかれさま</p>
        <p className="muted">otsukaresama: "you've worked hard". All words learned and nothing due. Next review {fmtIn(nextDue - now)}.</p>
      </main>
    )
  }

  const w = phase.word
  const t = toks(w)
  const fresh = new Set(NEW_CHARS.get(w.kana))

  if (phase.kind === 'intro') {
    return (
      <main className="study">
        <div className="label">{fresh.size ? `new word · new kana: ${[...fresh].join(' ')}` : 'new word · only kana you know'}</div>
        <KanaWord toks={t} mark={i => [...t[i].kana].some(c => fresh.has(c)) || (t[i].gem && fresh.has('っ')) ? 'new' : ''} />
        <Ruby toks={t} />
        <Meaning w={w} />
        {fresh.size > 0 && (
          <div className="kana-cards">
            {[...fresh].map(c => <KanaCard key={c} k={c} />)}
          </div>
        )}
        <div className="hint">Enter: quiz me · Space: listen</div>
      </main>
    )
  }

  if (phase.kind === 'quiz') {
    return (
      <main className="study">
        <div className="label">read it</div>
        <KanaWord toks={t} mark={() => ''} />
        <input
          autoFocus
          className="answer"
          value={input}
          placeholder="type the reading…"
          spellCheck={false}
          autoComplete="off"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.repeat && submit(w)}
        />
        <div className="hint">Polish (cuki) or Hepburn (tsuki) both work · empty Enter = don't know</div>
      </main>
    )
  }

  const { ok, given, blame } = phase
  return (
    <main className="study">
      <div className={'label ' + (ok ? 'good' : 'bad')}>{ok ? '✓ correct' : given ? `✗ you typed “${given}”` : '✗ skipped'}</div>
      <KanaWord toks={t} mark={i => (i === blame ? 'bad' : '')} />
      <Ruby toks={t} blame={blame} />
      <Meaning w={w} />
      <div className="hint">
        Enter: next · Space: listen
        {!ok && given && <> · <button className="link" onClick={overrule}>typo, count as correct</button></>}
      </div>
    </main>
  )
}

function KanaWord({ toks: t, mark }: { toks: Tok[]; mark: (i: number) => string }) {
  return (
    <div className="kana-word">
      {t.map((x, i) => (
        <span key={i} className={mark(i)}>{x.space ? '　' : ''}{x.gem ? 'っ' : ''}{x.kana}</span>
      ))}
    </div>
  )
}

function Ruby({ toks: t, blame }: { toks: Tok[]; blame?: number | null }) {
  return (
    <div className="ruby">
      <div className="pl">
        {t.map((x, i) => (
          <span key={i} className={'cell' + (i === blame ? ' bad' : '') + (x.space ? ' gap' : '')}>
            <span className="k">{x.gem ? 'っ' : ''}{x.kana}</span>
            <span className="r">{x.pl}</span>
          </span>
        ))}
      </div>
      {display(t, false) !== display(t) && <div className="hep">Hepburn: {display(t, false)}</div>}
    </div>
  )
}

function Meaning({ w }: { w: Word }) {
  return (
    <div className="meaning">
      {w.kanji && <span className="kanji">{w.kanji}</span>}
      <span className="en">{w.en}</span>
      {w.note && <p className="note">{w.note}</p>}
    </div>
  )
}

export function KanaCard({ k }: { k: string }) {
  const t = BASE[k] ? toks({ kana: k, en: '' })[0] : null
  const conf = confusables(k)
  return (
    <div className="kana-card">
      <div className="fonts">
        <span className="sans">{k}</span>
        <span className="serif">{k}</span>
        <span className="hand">{k}</span>
      </div>
      {t && <div className="reading">{t.pl}{t.hep !== t.pl && ` · ${t.hep}`}</div>}
      {ORIGIN[k] && <div className="origin">from <span className="serif">{ORIGIN[k]}</span></div>}
      {NOTE[k] && <div className="note">{NOTE[k]}</div>}
      {conf.length > 0 && <div className="conf">don't confuse: {conf.map(c => <span key={c}>{c}</span>)}</div>}
    </div>
  )
}

export function fmtIn(ms: number) {
  if (ms <= 0) return 'now'
  if (ms < 60 * MIN) return `in ${Math.ceil(ms / MIN)} min`
  if (ms < DAY) return `in ${Math.round(ms / (60 * MIN))} h`
  return `in ${Math.round(ms / DAY)} d`
}
