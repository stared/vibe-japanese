import { useEffect, useMemo, useRef, useState } from 'react'
import { GRID, GRID_VOICED, match, misread, normalize, tokenize } from './kana'
import { record, logRetype, solid, type Store } from './srs'
import { useScript } from './script'
import { KanaPic, PICS } from './pics'
import { kanaHistories, recentScore } from './history'
import { AnswerInput, speak } from './App'

// わ, を and ん share one row
export const ROWS: string[] = [
  ...GRID.filter(r => r.c !== 'n' || r.cells[0] !== 'ん').map(r => r.cells.replace(/・/g, '') + (r.cells[0] === 'わ' ? 'ん' : '')),
  ...GRID_VOICED.map(r => r.cells),
]
const GOAL = 3 // correct in a row, per kana, to finish a row
const OLD_SHARE = 0.25 // how often a kana from an earlier mastered row comes back

type Props = { store: Store; setStore: (s: Store) => void }

export function Rows({ store, setStore }: Props) {
  const [row, setRow] = useState<number | null>(null)
  const hists = useMemo(() => kanaHistories(store.log), [store.log])
  if (row !== null) return <RowSession key={row} row={row} store={store} setStore={setStore} onNext={() => setRow(row + 1 < ROWS.length ? row + 1 : null)} />
  return (
    <main className="rows-page">
      {ROWS.map((r, i) => (
        <button key={i} className={'row-pick' + (i === GRID.length - 1 ? ' gap' : '')} onClick={() => setRow(i)}>
          {[...r].map(k => {
            const score = store.kana[k] ? recentScore(hists.get(k) ?? []) : null
            return <span key={k} style={score === null ? undefined : { color: `color-mix(in oklab, var(--good) ${Math.round(score * 100)}%, var(--bad))` }}>{k}</span>
          })}
        </button>
      ))}
    </main>
  )
}

type Step =
  | { kind: 'intro' }
  | { kind: 'quiz'; k: string }
  | { kind: 'reveal'; k: string; ok: boolean; typed: string; conf: string | null; fixed?: boolean }
  | { kind: 'done' }

function RowSession({ row, store, setStore, onNext }: Props & { row: number; onNext: () => void }) {
  const sc = useScript()
  const kana = [...ROWS[row]]
  const [step, setStep] = useState<Step>({ kind: 'intro' })
  const [streak, setStreak] = useState<Record<string, number>>({})
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(0)
  const storeRef = useRef(store)
  storeRef.current = store
  const last = useRef<string | null>(null)
  const shownAt = useRef(0)
  const commit = (s: Store) => {
    storeRef.current = s
    setStore(s)
  }

  // earlier rows already solid: mixed in so they don't fade
  const old = ROWS.slice(0, row).flatMap(r => [...r]).filter(k => solid(store.kana[k]))

  const next = (st = streak) => {
    setInput('')
    setShake(0)
    const open = kana.filter(k => (st[k] ?? 0) < GOAL)
    if (!open.length) return setStep({ kind: 'done' })
    const fromOld = old.filter(k => k !== last.current)
    const pool = fromOld.length && Math.random() < OLD_SHARE ? fromOld : open.filter(k => k !== last.current).length ? open.filter(k => k !== last.current) : open
    const k = pool[Math.floor(Math.random() * pool.length)]
    last.current = k
    setStep({ kind: 'quiz', k })
  }

  const submit = (k: string) => {
    const t = tokenize(k)
    const given = normalize(input)
    const ok = !!given && match(t, given).ok
    commit(record(storeRef.current, k, t, ok ? [] : [0], Date.now(), { typed: input, kind: 'drill' }))
    if (kana.includes(k)) setStreak(s => ({ ...s, [k]: ok ? (s[k] ?? 0) + 1 : 0 }))
    shownAt.current = Date.now()
    setInput('')
    setStep({ kind: 'reveal', k, ok, typed: input, conf: ok || !given ? null : misread(t[0], given) })
    speak(k)
  }

  // correct: stay a moment so it sinks in, then move on
  useEffect(() => {
    if (step.kind !== 'reveal' || !step.ok) return
    const t = setTimeout(() => next(), 1500)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || e.target instanceof HTMLInputElement) return
      if (step.kind === 'intro') next()
      else if (step.kind === 'done') onNext()
      else if (step.kind === 'reveal' && step.fixed && Date.now() - shownAt.current > 1000) next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [step, streak])

  const read = (k: string) => tokenize(k)[0][sc]
  const hook = (k: string) => PICS[k] && <div className="hook">{PICS[k].hook}</div>

  if (step.kind === 'intro') {
    return (
      <main className="study">
        <div className="row-intro">
          {kana.map(k => (
            <div key={k} className="row-card" onClick={() => speak(k)}>
              <KanaPic k={k} size={150} />
              <div className="reading">{read(k)}</div>
              {hook(k)}
            </div>
          ))}
        </div>
        <button className="next" onClick={() => next()}>start</button>
      </main>
    )
  }

  if (step.kind === 'done') {
    return (
      <main className="study">
        <div className="word good">{kana.join('')}</div>
        {row + 1 < ROWS.length && <button className="next" onClick={onNext}>next row</button>}
      </main>
    )
  }

  const progress = (
    <div className="row-progress">
      {kana.map(k => <span key={k} style={{ color: `color-mix(in oklab, var(--good) ${Math.round(100 * Math.min(streak[k] ?? 0, GOAL) / GOAL)}%, var(--faint))` }}>{k}</span>)}
    </div>
  )

  if (step.kind === 'quiz') {
    return (
      <main className="study">
        {progress}
        <div className="word">{step.k}</div>
        <AnswerInput value={input} onChange={setInput} onEnter={() => submit(step.k)} />
      </main>
    )
  }

  const { k, ok, typed, conf, fixed } = step
  const retype = () => {
    const good = match(tokenize(k), normalize(input)).ok
    commit(logRetype(storeRef.current, k, input, good, Date.now()))
    if (good) {
      shownAt.current = Date.now()
      setInput('')
      setStep({ ...step, fixed: true })
    } else setShake(n => n + 1)
  }
  return (
    <main className="study">
      {progress}
      <div className="word" onClick={() => speak(k)}>
        <span className={'tok' + (ok || fixed ? '' : ' bad')}>
          {ok ? <span>{k}</span> : <KanaPic k={k} size={140} />}
          {ok || fixed
            ? <span className="typed good">{read(k)}</span>
            : <>{typed.trim() && <span className="typed bad">{typed}</span>}<span className="r">{read(k)}</span></>}
        </span>
      </div>
      {!ok && hook(k)}
      {conf && (
        <div className="confusion">
          <span className="jp">{conf}</span> {read(conf)}
        </div>
      )}
      {ok ? null : fixed
        ? <button className="next" onClick={() => next()}>next</button>
        : <AnswerInput key={shake} shake={shake > 0} value={input} onChange={setInput} onEnter={retype} />}
    </main>
  )
}
